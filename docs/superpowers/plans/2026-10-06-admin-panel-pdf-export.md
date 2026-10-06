# Painel admin + exportação de PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que o Filinto edite produtos e categorias do catálogo por um painel admin protegido por senha (`/admin`), com persistência em `localStorage` (sem backend), e exporte o catálogo atual como PDF com a identidade visual da marca.

**Architecture:** Camada de dados pura (`lib/catalogo-store.ts`) com funções sem efeitos colaterais (create/rename/remove/reorder de categorias e produtos), testável com Vitest sem React. Um hook (`lib/useCatalogStore.ts`) expõe essas funções com estado React persistido em `localStorage`, consumido tanto pelo catálogo público (`app/page.tsx`) quanto pelo painel admin. O painel (`/admin`) é protegido por senha via cookie `httpOnly` checado em `proxy.ts` (Next.js 16 renomeou `middleware.ts` para `proxy.ts`). A exportação de PDF usa `@react-pdf/renderer` renderizando os dados atuais do store direto no navegador, sem round-trip de servidor.

**Tech Stack:** Next.js 16 (App Router, Server Actions, `proxy.ts`), React 19, TypeScript, Tailwind CSS v4, Vitest (ambiente `node`), `@react-pdf/renderer` v4.9+ (nova dependência).

## Global Constraints

- Cor de marca (exata): `#AC1214` — usar esse hex literal em qualquer elemento novo que precise da cor da marca.
- Mobile-first: todo elemento novo (incluindo o painel admin) precisa ler bem a partir de 375px de largura.
- Projeto não tem jsdom/testing-library configurado (`vitest.config.ts` usa `environment: "node"`) — `lib/*.test.ts` só cobre funções puras. Componentes React (incluindo os do painel admin) são verificados manualmente via `npm run dev`, não por teste automatizado.
- Sem banco de dados / Supabase nesta rodada — toda persistência é `localStorage` do navegador, sob a chave `"filinto-catalogo-v1"`.
- Sem upload de imagem de produto — o modal de produto não tem campo de foto.
- Next.js 16 renomeou o arquivo `middleware.ts` para `proxy.ts` (função exportada também se chama `proxy`, não `middleware`) — usar essa convenção, não a antiga.
- `@react-pdf/renderer` (a instalar, versão `^4.9.0`) é compatível com React 19 a partir da v4.1.0 — não usar uma versão anterior.
- A senha do admin fica em `process.env.ADMIN_PASSWORD`. Em dev, precisa existir em `catalogo/.env.local` (já cobrido pelo `.gitignore`, padrão `.env*`). Em produção, precisa ser configurada manualmente nas env vars do projeto na Vercel — isso é uma ação fora do repositório, não uma tarefa deste plano.

---

### Task 1: Camada de dados pura (`lib/catalogo-store.ts`)

**Files:**
- Create: `catalogo/lib/catalogo-store.ts`
- Create: `catalogo/lib/catalogo-store.test.ts`

**Interfaces:**
- Produces: tipos `Categoria`, `Produto`, `NovoProduto`, `CatalogoState`; constante `DEFAULT_CATALOGO: CatalogoState`; funções puras `addCategoria(state, nome)`, `renameCategoria(state, id, nome)`, `removeCategoria(state, id)`, `moveCategoria(state, id, direction)`, `addProduto(state, novo)`, `updateProduto(state, id, changes)`, `removeProduto(state, id)`, `moveProduto(state, id, direction)` — todas recebem e retornam `CatalogoState`, sem mutar o argumento recebido. Usadas pela Task 2 (hook) e Task 4 (tipos nos componentes).

- [ ] **Step 1: Escrever os testes (vão falhar, o módulo ainda não existe)**

Criar `catalogo/lib/catalogo-store.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  DEFAULT_CATALOGO,
  addCategoria,
  renameCategoria,
  removeCategoria,
  moveCategoria,
  addProduto,
  updateProduto,
  removeProduto,
  moveProduto,
} from "./catalogo-store";

describe("DEFAULT_CATALOGO", () => {
  it("has no duplicate category ids", () => {
    const ids = DEFAULT_CATALOGO.categorias.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate product ids", () => {
    const ids = DEFAULT_CATALOGO.produtos.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only uses category ids declared in categorias", () => {
    const validIds = DEFAULT_CATALOGO.categorias.map((c) => c.id);
    for (const produto of DEFAULT_CATALOGO.produtos) {
      expect(validIds).toContain(produto.categoriaId);
    }
  });

  it("has a positive price for every product", () => {
    for (const produto of DEFAULT_CATALOGO.produtos) {
      expect(produto.preco).toBeGreaterThan(0);
    }
  });
});

describe("addCategoria", () => {
  it("appends a new category with a generated id", () => {
    const state = addCategoria(DEFAULT_CATALOGO, "Bolos");
    const added = state.categorias.at(-1);
    expect(added?.nome).toBe("Bolos");
    expect(added?.id).toBeTruthy();
    expect(state.categorias.length).toBe(DEFAULT_CATALOGO.categorias.length + 1);
  });

  it("does not mutate the original state", () => {
    const before = DEFAULT_CATALOGO.categorias.length;
    addCategoria(DEFAULT_CATALOGO, "Bolos");
    expect(DEFAULT_CATALOGO.categorias.length).toBe(before);
  });
});

describe("renameCategoria", () => {
  it("updates only the matching category name", () => {
    const state = renameCategoria(DEFAULT_CATALOGO, "sorvetes", "Sorvetes Especiais");
    expect(state.categorias.find((c) => c.id === "sorvetes")?.nome).toBe(
      "Sorvetes Especiais"
    );
    expect(state.categorias.find((c) => c.id === "acai")?.nome).toBe("Açaí");
  });
});

describe("removeCategoria", () => {
  it("removes the category and its products", () => {
    const state = removeCategoria(DEFAULT_CATALOGO, "milkshakes");
    expect(state.categorias.find((c) => c.id === "milkshakes")).toBeUndefined();
    expect(state.produtos.some((p) => p.categoriaId === "milkshakes")).toBe(false);
  });

  it("leaves other categories and products untouched", () => {
    const state = removeCategoria(DEFAULT_CATALOGO, "milkshakes");
    expect(state.categorias.length).toBe(DEFAULT_CATALOGO.categorias.length - 1);
    expect(state.produtos.some((p) => p.categoriaId === "sorvetes")).toBe(true);
  });
});

describe("moveCategoria", () => {
  it("swaps a category with the next one when moving down", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "sorvetes", "down");
    expect(state.categorias[0].id).toBe("acai");
    expect(state.categorias[1].id).toBe("sorvetes");
  });

  it("does nothing when moving the first category up", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "sorvetes", "up");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });

  it("does nothing when moving the last category down", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "milkshakes", "down");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });
});

describe("addProduto", () => {
  it("appends a new product with a generated id", () => {
    const state = addProduto(DEFAULT_CATALOGO, {
      categoriaId: "sorvetes",
      nome: "Casquinha de Limão",
      preco: 9,
    });
    const added = state.produtos.at(-1);
    expect(added?.nome).toBe("Casquinha de Limão");
    expect(added?.categoriaId).toBe("sorvetes");
    expect(added?.id).toBeTruthy();
  });
});

describe("updateProduto", () => {
  it("updates only the matching product", () => {
    const state = updateProduto(DEFAULT_CATALOGO, "sorv-chocolate", { preco: 10 });
    expect(state.produtos.find((p) => p.id === "sorv-chocolate")?.preco).toBe(10);
    expect(state.produtos.find((p) => p.id === "sorv-morango")?.preco).toBe(8);
  });
});

describe("removeProduto", () => {
  it("removes only the matching product", () => {
    const state = removeProduto(DEFAULT_CATALOGO, "sorv-chocolate");
    expect(state.produtos.find((p) => p.id === "sorv-chocolate")).toBeUndefined();
    expect(state.produtos.length).toBe(DEFAULT_CATALOGO.produtos.length - 1);
  });
});

describe("moveProduto", () => {
  it("swaps a product with the next one in the same category", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "sorv-chocolate", "down");
    const sorvetes = state.produtos.filter((p) => p.categoriaId === "sorvetes");
    expect(sorvetes[0].id).toBe("sorv-morango");
    expect(sorvetes[1].id).toBe("sorv-chocolate");
  });

  it("does not affect products in other categories", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "sorv-chocolate", "down");
    const acai = state.produtos.filter((p) => p.categoriaId === "acai");
    expect(acai.map((p) => p.id)).toEqual(
      DEFAULT_CATALOGO.produtos.filter((p) => p.categoriaId === "acai").map((p) => p.id)
    );
  });

  it("does nothing when moving the first product of a category up", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "sorv-chocolate", "up");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });
});
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run (dentro de `catalogo/`): `npm run test`
Expected: FAIL com erro de módulo não encontrado (`Cannot find module './catalogo-store'` ou similar).

- [ ] **Step 3: Implementar `lib/catalogo-store.ts`**

Criar `catalogo/lib/catalogo-store.ts`:

```ts
export type Categoria = {
  id: string;
  nome: string;
};

export type Produto = {
  id: string;
  categoriaId: string;
  nome: string;
  preco: number;
  descricao?: string;
};

export type NovoProduto = {
  categoriaId: string;
  nome: string;
  preco: number;
  descricao?: string;
};

export type CatalogoState = {
  categorias: Categoria[];
  produtos: Produto[];
};

export const DEFAULT_CATALOGO: CatalogoState = {
  categorias: [
    { id: "sorvetes", nome: "Sorvetes" },
    { id: "acai", nome: "Açaí" },
    { id: "milkshakes", nome: "Milkshakes" },
  ],
  produtos: [
    { id: "sorv-chocolate", categoriaId: "sorvetes", nome: "Casquinha de Chocolate", preco: 8 },
    { id: "sorv-morango", categoriaId: "sorvetes", nome: "Casquinha de Morango", preco: 8 },
    { id: "sorv-creme", categoriaId: "sorvetes", nome: "Casquinha de Creme", preco: 8 },
    { id: "sorv-flocos", categoriaId: "sorvetes", nome: "Casquinha de Flocos", preco: 8 },
    { id: "sorv-napolitano", categoriaId: "sorvetes", nome: "Pote Napolitano 500ml", preco: 22 },
    {
      id: "acai-300",
      categoriaId: "acai",
      nome: "Açaí 300ml",
      preco: 14,
      descricao: "Com granola e banana",
    },
    {
      id: "acai-500",
      categoriaId: "acai",
      nome: "Açaí 500ml",
      preco: 19,
      descricao: "Com granola e banana",
    },
    {
      id: "acai-700",
      categoriaId: "acai",
      nome: "Açaí 700ml",
      preco: 24,
      descricao: "Com granola e banana",
    },
    { id: "acai-combo", categoriaId: "acai", nome: "Combo Açaí + Leite em pó", preco: 21 },
    { id: "milk-chocolate", categoriaId: "milkshakes", nome: "Milkshake de Chocolate", preco: 16 },
    { id: "milk-morango", categoriaId: "milkshakes", nome: "Milkshake de Morango", preco: 16 },
    { id: "milk-ovomaltine", categoriaId: "milkshakes", nome: "Milkshake de Ovomaltine", preco: 18 },
    { id: "milk-baunilha", categoriaId: "milkshakes", nome: "Milkshake de Baunilha", preco: 15 },
  ],
};

export function addCategoria(state: CatalogoState, nome: string): CatalogoState {
  const categoria: Categoria = { id: crypto.randomUUID(), nome };
  return { ...state, categorias: [...state.categorias, categoria] };
}

export function renameCategoria(
  state: CatalogoState,
  id: string,
  nome: string
): CatalogoState {
  return {
    ...state,
    categorias: state.categorias.map((c) => (c.id === id ? { ...c, nome } : c)),
  };
}

export function removeCategoria(state: CatalogoState, id: string): CatalogoState {
  return {
    categorias: state.categorias.filter((c) => c.id !== id),
    produtos: state.produtos.filter((p) => p.categoriaId !== id),
  };
}

export function moveCategoria(
  state: CatalogoState,
  id: string,
  direction: "up" | "down"
): CatalogoState {
  const index = state.categorias.findIndex((c) => c.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || targetIndex < 0 || targetIndex >= state.categorias.length) {
    return state;
  }
  const categorias = [...state.categorias];
  [categorias[index], categorias[targetIndex]] = [categorias[targetIndex], categorias[index]];
  return { ...state, categorias };
}

export function addProduto(state: CatalogoState, novo: NovoProduto): CatalogoState {
  const produto: Produto = { id: crypto.randomUUID(), ...novo };
  return { ...state, produtos: [...state.produtos, produto] };
}

export function updateProduto(
  state: CatalogoState,
  id: string,
  changes: Partial<NovoProduto>
): CatalogoState {
  return {
    ...state,
    produtos: state.produtos.map((p) => (p.id === id ? { ...p, ...changes } : p)),
  };
}

export function removeProduto(state: CatalogoState, id: string): CatalogoState {
  return { ...state, produtos: state.produtos.filter((p) => p.id !== id) };
}

export function moveProduto(
  state: CatalogoState,
  id: string,
  direction: "up" | "down"
): CatalogoState {
  const produto = state.produtos.find((p) => p.id === id);
  if (!produto) return state;

  const siblingIds = state.produtos
    .filter((p) => p.categoriaId === produto.categoriaId)
    .map((p) => p.id);
  const siblingIndex = siblingIds.indexOf(id);
  const targetSiblingIndex = direction === "up" ? siblingIndex - 1 : siblingIndex + 1;
  if (targetSiblingIndex < 0 || targetSiblingIndex >= siblingIds.length) {
    return state;
  }
  const targetId = siblingIds[targetSiblingIndex];

  const indexA = state.produtos.findIndex((p) => p.id === id);
  const indexB = state.produtos.findIndex((p) => p.id === targetId);
  const produtos = [...state.produtos];
  [produtos[indexA], produtos[indexB]] = [produtos[indexB], produtos[indexA]];
  return { ...state, produtos };
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npm run test`
Expected: PASS (todos os testes de `catalogo-store.test.ts`, mais os 3 arquivos de teste existentes continuam passando).

- [ ] **Step 5: Verificar que o projeto builda**

Run: `npm run build`
Expected: build termina sem erro de tipo/compilação.

- [ ] **Step 6: Commit**

```bash
git add catalogo/lib/catalogo-store.ts catalogo/lib/catalogo-store.test.ts
git commit -m "feat: add pure catalogo-store data layer with category/product CRUD"
```

---

### Task 2: Hook de persistência + migração do catálogo público

**Files:**
- Create: `catalogo/lib/useCatalogStore.ts`
- Modify: `catalogo/app/page.tsx`
- Modify: `catalogo/components/CategorySection.tsx:1`
- Modify: `catalogo/components/ProductCard.tsx:1`
- Delete: `catalogo/lib/produtos.ts`
- Delete: `catalogo/lib/produtos.test.ts`

**Interfaces:**
- Consumes: `DEFAULT_CATALOGO`, `CatalogoState`, `NovoProduto`, e todas as funções puras de `catalogo-store.ts` (Task 1).
- Produces: hook `useCatalogStore(): CatalogStore` e tipo `CatalogStore`, em `lib/useCatalogStore.ts`. `CatalogStore` é `{ categorias: Categoria[]; produtos: Produto[]; addCategoria; renameCategoria; removeCategoria; moveCategoria; addProduto; updateProduto; removeProduto; moveProduto; restaurarPadrao }` — usado pela Task 4.

- [ ] **Step 1: Criar o hook `useCatalogStore`**

Criar `catalogo/lib/useCatalogStore.ts`:

```ts
"use client";

import { useEffect, useState } from "react";
import {
  CatalogoState,
  DEFAULT_CATALOGO,
  NovoProduto,
  addCategoria as addCategoriaPura,
  renameCategoria as renameCategoriaPura,
  removeCategoria as removeCategoriaPura,
  moveCategoria as moveCategoriaPura,
  addProduto as addProdutoPura,
  updateProduto as updateProdutoPura,
  removeProduto as removeProdutoPura,
  moveProduto as moveProdutoPura,
} from "./catalogo-store";

const STORAGE_KEY = "filinto-catalogo-v1";

export function useCatalogStore() {
  const [state, setState] = useState<CatalogoState>(DEFAULT_CATALOGO);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      setState(JSON.parse(saved) as CatalogoState);
    } catch {
      // storage corrompido: mantém os defaults já carregados
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return {
    categorias: state.categorias,
    produtos: state.produtos,
    addCategoria: (nome: string) => setState((s) => addCategoriaPura(s, nome)),
    renameCategoria: (id: string, nome: string) =>
      setState((s) => renameCategoriaPura(s, id, nome)),
    removeCategoria: (id: string) => setState((s) => removeCategoriaPura(s, id)),
    moveCategoria: (id: string, direction: "up" | "down") =>
      setState((s) => moveCategoriaPura(s, id, direction)),
    addProduto: (novo: NovoProduto) => setState((s) => addProdutoPura(s, novo)),
    updateProduto: (id: string, changes: Partial<NovoProduto>) =>
      setState((s) => updateProdutoPura(s, id, changes)),
    removeProduto: (id: string) => setState((s) => removeProdutoPura(s, id)),
    moveProduto: (id: string, direction: "up" | "down") =>
      setState((s) => moveProdutoPura(s, id, direction)),
    restaurarPadrao: () => setState(DEFAULT_CATALOGO),
  };
}

export type CatalogStore = ReturnType<typeof useCatalogStore>;
```

- [ ] **Step 2: Migrar `app/page.tsx` para consumir o store**

Substituir todo o conteúdo de `catalogo/app/page.tsx`:

```tsx
"use client";

import { Hero } from "@/components/Hero";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { useCatalogStore } from "@/lib/useCatalogStore";

export default function Home() {
  const { categorias, produtos } = useCatalogStore();

  return (
    <main>
      <Hero />
      {categorias.map((categoria) => (
        <CategorySection
          key={categoria.id}
          titulo={categoria.nome}
          produtos={produtos.filter((p) => p.categoriaId === categoria.id)}
        />
      ))}
      <Footer />
      <FloatingWhatsAppButton />
    </main>
  );
}
```

- [ ] **Step 3: Atualizar a origem do tipo `Produto` em `CategorySection` e `ProductCard`**

Em `catalogo/components/CategorySection.tsx:1`, trocar:

```tsx
import type { Produto } from "@/lib/produtos";
```

por:

```tsx
import type { Produto } from "@/lib/catalogo-store";
```

Em `catalogo/components/ProductCard.tsx:1`, trocar:

```tsx
import type { Produto } from "@/lib/produtos";
```

por:

```tsx
import type { Produto } from "@/lib/catalogo-store";
```

Nenhuma outra linha desses dois arquivos muda — ambos só usam `produto.nome`, `produto.descricao` e `produto.preco`, que continuam existindo no novo tipo `Produto`.

- [ ] **Step 4: Remover os arquivos estáticos substituídos**

```bash
git rm catalogo/lib/produtos.ts catalogo/lib/produtos.test.ts
```

- [ ] **Step 5: Rodar os testes e confirmar que passam**

Run: `npm run test`
Expected: PASS. Os testes de `produtos.test.ts` não existem mais; `catalogo-store.test.ts` (Task 1), `format.test.ts` e `whatsapp.test.ts` continuam passando.

- [ ] **Step 6: Verificar que o projeto builda**

Run: `npm run build`
Expected: build termina sem erro de tipo/compilação (nenhuma referência restante a `@/lib/produtos`).

- [ ] **Step 7: Verificação manual no navegador**

Run: `npm run dev`, abrir `http://localhost:3000`.

- A página carrega normalmente: Hero, as 3 categorias (Sorvetes, Açaí, Milkshakes) com os mesmos produtos de antes, Footer, botão flutuante de WhatsApp.
- Abrir DevTools → Application → Local Storage: existe uma chave `filinto-catalogo-v1` com o JSON do catálogo.
- Recarregar a página: catálogo continua idêntico (lendo do `localStorage`, não re-semeando).

- [ ] **Step 8: Commit**

```bash
git add catalogo/lib/useCatalogStore.ts catalogo/app/page.tsx catalogo/components/CategorySection.tsx catalogo/components/ProductCard.tsx
git commit -m "feat: back public catalog with localStorage-persisted catalogo store"
```

---

### Task 3: Autenticação do painel admin

**Files:**
- Create: `catalogo/lib/auth.ts`
- Create: `catalogo/lib/auth.test.ts`
- Create: `catalogo/app/admin/login/actions.ts`
- Create: `catalogo/app/admin/login/page.tsx`
- Create: `catalogo/proxy.ts`

**Interfaces:**
- Produces: `ADMIN_SESSION_COOKIE: string` e `isValidAdminPassword(password: string): boolean` em `lib/auth.ts` (usados por `actions.ts` e `proxy.ts`); Server Actions `login(prevState: { error?: string }, formData: FormData): Promise<{ error?: string }>` e `logout(): Promise<void>` em `app/admin/login/actions.ts` (usados pela Task 4 para o botão "Sair").

- [ ] **Step 1: Escrever o teste de `isValidAdminPassword` (vai falhar, o módulo ainda não existe)**

Criar `catalogo/lib/auth.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isValidAdminPassword } from "./auth";

describe("isValidAdminPassword", () => {
  const originalValue = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "senha-correta";
  });

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalValue;
  });

  it("returns true when the password matches ADMIN_PASSWORD", () => {
    expect(isValidAdminPassword("senha-correta")).toBe(true);
  });

  it("returns false when the password does not match", () => {
    expect(isValidAdminPassword("errada")).toBe(false);
  });

  it("returns false when ADMIN_PASSWORD is not set", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(isValidAdminPassword("qualquer")).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `npm run test`
Expected: FAIL com erro de módulo não encontrado (`Cannot find module './auth'`).

- [ ] **Step 3: Implementar `lib/auth.ts`**

Criar `catalogo/lib/auth.ts`:

```ts
export const ADMIN_SESSION_COOKIE = "admin_session";

export function isValidAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npm run test`
Expected: PASS em todos os arquivos de teste, incluindo `auth.test.ts`.

- [ ] **Step 5: Criar a variável de ambiente local**

Criar `catalogo/.env.local` (não versionado, já cobrido por `.env*` no `.gitignore`) com:

```
ADMIN_PASSWORD=escolha-uma-senha-aqui
```

- [ ] **Step 6: Criar as Server Actions de login/logout**

Criar `catalogo/app/admin/login/actions.ts`:

```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isValidAdminPassword } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!isValidAdminPassword(password)) {
    return { error: "Senha incorreta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
```

- [ ] **Step 7: Criar a página de login**

Criar `catalogo/app/admin/login/page.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4">
      <h1 className="text-center font-[family-name:var(--font-dancing-script)] text-3xl text-[#AC1214]">
        Painel Filinto
      </h1>
      <form action={formAction} className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          placeholder="Senha"
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#AC1214] px-3 py-2 font-medium text-white disabled:opacity-60"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 8: Criar `proxy.ts` protegendo `/admin`**

Criar `catalogo/proxy.ts` (raiz do projeto, mesmo nível de `app/`):

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminPassword } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!session || !isValidAdminPassword(session)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: "/admin/:path*",
};
```

- [ ] **Step 9: Verificar que o projeto builda**

Run: `npm run build`
Expected: build termina sem erro de tipo/compilação. (A rota `/admin` ainda não tem página própria — isso é esperado, a Task 4 cria `app/admin/page.tsx`; o build não falha por isso, só não haverá página pra visitar ainda.)

- [ ] **Step 10: Verificar que os testes continuam passando**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 11: Verificação manual no navegador**

Run: `npm run dev`, abrir `http://localhost:3000/admin`.

- Acesso direto a `/admin` sem estar logado redireciona para `/admin/login`.
- Em `/admin/login`, digitar uma senha errada: mostra "Senha incorreta.", permanece na página.
- Digitar a senha de `ADMIN_PASSWORD` (a configurada no `.env.local`): redireciona para `/admin` (vai dar 404 até a Task 4 criar a página — isso é esperado nesta etapa).
- Verificar no DevTools → Application → Cookies: existe um cookie `admin_session`, marcado como `HttpOnly`.

- [ ] **Step 12: Commit**

```bash
git add catalogo/lib/auth.ts catalogo/lib/auth.test.ts catalogo/app/admin/login/actions.ts catalogo/app/admin/login/page.tsx catalogo/proxy.ts
git commit -m "feat: add password-protected admin session via proxy"
```

---

### Task 4: Painel admin — categorias e produtos

**Files:**
- Create: `catalogo/app/admin/page.tsx`
- Create: `catalogo/components/AdminPanel.tsx`
- Create: `catalogo/components/AdminCategoriaCard.tsx`
- Create: `catalogo/components/AdminProdutoModal.tsx`

**Interfaces:**
- Consumes: `useCatalogStore`, `CatalogStore` (Task 2); `Categoria`, `Produto`, `NovoProduto` (Task 1); `logout` (Task 3); `formatPrice` (`lib/format.ts`, já existente).
- Produces: `<AdminPanel />` (default export de `components/AdminPanel.tsx`), renderizado por `app/admin/page.tsx`. Task 5 modifica `AdminPanel.tsx` para adicionar o botão de exportar PDF.

- [ ] **Step 1: Criar o modal de produto**

Criar `catalogo/components/AdminProdutoModal.tsx`:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import type { NovoProduto, Produto } from "@/lib/catalogo-store";

type AdminProdutoModalProps = {
  categoriaId: string;
  produto?: Produto;
  onClose: () => void;
  onSubmit: (dados: NovoProduto) => void;
};

export function AdminProdutoModal({
  categoriaId,
  produto,
  onClose,
  onSubmit,
}: AdminProdutoModalProps) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [preco, setPreco] = useState(produto ? String(produto.preco) : "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const precoNumero = Number(preco.replace(",", "."));

    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }
    if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
      setErro("Informe um preço válido, maior que zero.");
      return;
    }

    onSubmit({
      categoriaId,
      nome: nome.trim(),
      preco: precoNumero,
      descricao: descricao.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          {produto ? "Editar produto" : "Novo produto"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-neutral-700">
            Nome
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              autoFocus
            />
          </label>
          <label className="text-sm text-neutral-700">
            Preço (R$)
            <input
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
          </label>
          <label className="text-sm text-neutral-700">
            Descrição (opcional)
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
          </label>
          {erro ? <p className="text-sm text-red-600">{erro}</p> : null}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm text-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#AC1214] px-3 py-2 text-sm font-medium text-white"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Criar o card de categoria**

Criar `catalogo/components/AdminCategoriaCard.tsx`:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import type { Categoria, Produto } from "@/lib/catalogo-store";
import type { CatalogStore } from "@/lib/useCatalogStore";
import { formatPrice } from "@/lib/format";
import { AdminProdutoModal } from "./AdminProdutoModal";

type AdminCategoriaCardProps = {
  store: CatalogStore;
  categoria: Categoria;
  produtos: Produto[];
  isFirst: boolean;
  isLast: boolean;
};

export function AdminCategoriaCard({
  store,
  categoria,
  produtos,
  isFirst,
  isLast,
}: AdminCategoriaCardProps) {
  const [renaming, setRenaming] = useState(false);
  const [nome, setNome] = useState(categoria.nome);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [criandoProduto, setCriandoProduto] = useState(false);

  function handleRenameSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nome.trim()) return;
    store.renameCategoria(categoria.id, nome.trim());
    setRenaming(false);
  }

  function handleRemoveCategoria() {
    const confirmado = confirm(
      `Excluir "${categoria.nome}"? Isso remove também os ${produtos.length} produto(s) dessa categoria.`
    );
    if (confirmado) {
      store.removeCategoria(categoria.id);
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        {renaming ? (
          <form onSubmit={handleRenameSubmit} className="flex flex-1 gap-2">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="flex-1 rounded-lg border border-neutral-300 px-2 py-1"
              autoFocus
            />
            <button type="submit" className="text-sm font-medium text-[#AC1214]">
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setRenaming(false);
                setNome(categoria.nome);
              }}
              className="text-sm text-neutral-500"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <h2 className="font-[family-name:var(--font-dancing-script)] text-2xl text-[#AC1214]">
            {categoria.nome}
          </h2>
        )}

        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => store.moveCategoria(categoria.id, "up")}
            className="disabled:opacity-30"
            aria-label="Mover categoria para cima"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => store.moveCategoria(categoria.id, "down")}
            className="disabled:opacity-30"
            aria-label="Mover categoria para baixo"
          >
            ↓
          </button>
          {!renaming && (
            <button type="button" onClick={() => setRenaming(true)}>
              Renomear
            </button>
          )}
          <button type="button" onClick={handleRemoveCategoria} className="text-red-600">
            Excluir
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {produtos.map((produto, index) => (
          <li
            key={produto.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-neutral-100 px-3 py-2"
          >
            <div>
              <p className="font-medium text-neutral-900">{produto.nome}</p>
              <p className="text-sm text-neutral-500">{formatPrice(produto.preco)}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => store.moveProduto(produto.id, "up")}
                className="disabled:opacity-30"
                aria-label="Mover produto para cima"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === produtos.length - 1}
                onClick={() => store.moveProduto(produto.id, "down")}
                className="disabled:opacity-30"
                aria-label="Mover produto para baixo"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => setEditando(produto)}
                className="text-[#AC1214]"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${produto.nome}"?`)) {
                    store.removeProduto(produto.id);
                  }
                }}
                className="text-red-600"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setCriandoProduto(true)}
        className="mt-3 w-full rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-sm text-neutral-600"
      >
        + Adicionar produto
      </button>

      {criandoProduto && (
        <AdminProdutoModal
          categoriaId={categoria.id}
          onClose={() => setCriandoProduto(false)}
          onSubmit={(novo) => {
            store.addProduto(novo);
            setCriandoProduto(false);
          }}
        />
      )}

      {editando && (
        <AdminProdutoModal
          categoriaId={categoria.id}
          produto={editando}
          onClose={() => setEditando(null)}
          onSubmit={(changes) => {
            store.updateProduto(editando.id, changes);
            setEditando(null);
          }}
        />
      )}
    </section>
  );
}
```

- [ ] **Step 3: Criar o painel admin**

Criar `catalogo/components/AdminPanel.tsx`:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useCatalogStore } from "@/lib/useCatalogStore";
import { logout } from "@/app/admin/login/actions";
import { AdminCategoriaCard } from "./AdminCategoriaCard";

export function AdminPanel() {
  const store = useCatalogStore();
  const [novaCategoria, setNovaCategoria] = useState("");

  function handleAddCategoria(event: FormEvent) {
    event.preventDefault();
    if (!novaCategoria.trim()) return;
    store.addCategoria(novaCategoria.trim());
    setNovaCategoria("");
  }

  function handleRestaurarPadrao() {
    const confirmado = confirm(
      "Restaurar os dados originais? Todas as edições feitas no painel serão perdidas."
    );
    if (confirmado) {
      store.restaurarPadrao();
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-dancing-script)] text-3xl text-[#AC1214]">
          Painel Filinto
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRestaurarPadrao}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700"
          >
            Restaurar padrão
          </button>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700"
            >
              Sair
            </button>
          </form>
        </div>
      </div>

      <form onSubmit={handleAddCategoria} className="mb-6 flex gap-2">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#AC1214] px-3 py-2 text-sm font-medium text-white"
        >
          Adicionar
        </button>
      </form>

      <div className="flex flex-col gap-6">
        {store.categorias.map((categoria, index) => (
          <AdminCategoriaCard
            key={categoria.id}
            store={store}
            categoria={categoria}
            produtos={store.produtos.filter((p) => p.categoriaId === categoria.id)}
            isFirst={index === 0}
            isLast={index === store.categorias.length - 1}
          />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Criar a página `/admin`**

Criar `catalogo/app/admin/page.tsx`:

```tsx
import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
  return <AdminPanel />;
}
```

- [ ] **Step 5: Verificar que o projeto builda**

Run: `npm run build`
Expected: build termina sem erro de tipo/compilação.

- [ ] **Step 6: Verificar que os testes continuam passando**

Run: `npm run test`
Expected: PASS (nenhum teste novo nesta tarefa — painel é só verificado manualmente).

- [ ] **Step 7: Verificação manual no navegador**

Run: `npm run dev`, logar em `http://localhost:3000/admin/login` com a senha do `.env.local`.

Em `/admin`, em 375px de largura:
- Criar uma categoria nova ("Bolos"): aparece no final da lista, sem produtos.
- Renomear uma categoria existente: nome atualiza na lista.
- Mover uma categoria para cima/para baixo: ordem muda; botão de mover fica desabilitado no topo/base da lista.
- Adicionar um produto numa categoria (modal abre, preencher nome/preço, salvar): produto aparece na lista.
- Tentar salvar o modal sem nome ou com preço inválido (0, negativo, vazio): mostra a mensagem de erro, não fecha o modal.
- Editar um produto existente (modal pré-preenchido): alterações refletem na lista.
- Mover um produto para cima/para baixo dentro da mesma categoria.
- Excluir um produto (confirmação aparece antes).
- Excluir uma categoria com produtos (confirmação menciona a quantidade de produtos que serão removidos); confirmar e checar que os produtos somem.
- Clicar em "Restaurar padrão": confirmação aparece; confirmar e checar que volta aos 3 categorias/13 produtos originais.
- Abrir `http://localhost:3000/` em outra aba: mudanças feitas no admin aparecem lá após recarregar a página.
- Clicar em "Sair": redireciona para `/admin/login`; tentar acessar `/admin` direto depois disso redireciona de volta pro login.

- [ ] **Step 8: Commit**

```bash
git add catalogo/app/admin/page.tsx catalogo/components/AdminPanel.tsx catalogo/components/AdminCategoriaCard.tsx catalogo/components/AdminProdutoModal.tsx
git commit -m "feat: add admin panel for managing categories and products"
```

---

### Task 5: Exportação de catálogo em PDF

**Files:**
- Modify: `catalogo/package.json` (nova dependência `@react-pdf/renderer`)
- Create: `catalogo/lib/pdf/catalogo-pdf.tsx`
- Modify: `catalogo/components/AdminPanel.tsx`

**Interfaces:**
- Consumes: `Categoria`, `Produto` (Task 1); `formatPrice` (`lib/format.ts`).
- Produces: `buildCatalogoPdfBlob(dados: { categorias: Categoria[]; produtos: Produto[] }): Promise<Blob>`, exportado de `lib/pdf/catalogo-pdf.tsx`, chamado pelo botão "Exportar PDF" em `AdminPanel.tsx`.

- [ ] **Step 1: Instalar a dependência**

Run (dentro de `catalogo/`): `npm install @react-pdf/renderer@^4.9.0`
Expected: `package.json` e `package-lock.json` atualizados, instalação sem erro.

- [ ] **Step 2: Criar o documento PDF**

Criar `catalogo/lib/pdf/catalogo-pdf.tsx`:

```tsx
import { Document, Page, View, Text, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import type { Categoria, Produto } from "@/lib/catalogo-store";
import { formatPrice } from "@/lib/format";

Font.register({
  family: "Dancing Script",
  src: "https://fonts.gstatic.com/s/dancingscript/v29/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7B1i0HTQ.ttf",
});

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  header: {
    backgroundColor: "#AC1214",
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  headerTitle: {
    fontFamily: "Dancing Script",
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
  },
  categoria: { marginBottom: 16 },
  categoriaTitulo: {
    fontFamily: "Dancing Script",
    fontSize: 20,
    color: "#AC1214",
    marginBottom: 8,
  },
  produtoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  produtoNome: { flex: 1 },
  produtoDescricao: { fontSize: 9, color: "#666666" },
  produtoPreco: { fontWeight: "bold", color: "#AC1214" },
});

export type CatalogoPdfProps = {
  categorias: Categoria[];
  produtos: Produto[];
};

export function CatalogoPdf({ categorias, produtos }: CatalogoPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filinto Sorvetes</Text>
        </View>
        {categorias.map((categoria) => {
          const produtosDaCategoria = produtos.filter((p) => p.categoriaId === categoria.id);
          if (produtosDaCategoria.length === 0) return null;
          return (
            <View key={categoria.id} style={styles.categoria}>
              <Text style={styles.categoriaTitulo}>{categoria.nome}</Text>
              {produtosDaCategoria.map((produto) => (
                <View key={produto.id} style={styles.produtoRow}>
                  <View style={styles.produtoNome}>
                    <Text>{produto.nome}</Text>
                    {produto.descricao ? (
                      <Text style={styles.produtoDescricao}>{produto.descricao}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.produtoPreco}>{formatPrice(produto.preco)}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export async function buildCatalogoPdfBlob(dados: CatalogoPdfProps): Promise<Blob> {
  return pdf(<CatalogoPdf {...dados} />).toBlob();
}
```

- [ ] **Step 3: Adicionar o botão "Exportar PDF" ao painel**

Em `catalogo/components/AdminPanel.tsx`, adicionar o import e o estado de carregamento no topo do componente:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useCatalogStore } from "@/lib/useCatalogStore";
import { logout } from "@/app/admin/login/actions";
import { AdminCategoriaCard } from "./AdminCategoriaCard";

export function AdminPanel() {
  const store = useCatalogStore();
  const [novaCategoria, setNovaCategoria] = useState("");
  const [exportando, setExportando] = useState(false);
```

Adicionar a função de exportação junto das outras funções do componente (`handleAddCategoria`, `handleRestaurarPadrao`):

```tsx
  async function handleExportarPdf() {
    setExportando(true);
    try {
      const { buildCatalogoPdfBlob } = await import("@/lib/pdf/catalogo-pdf");
      const blob = await buildCatalogoPdfBlob({
        categorias: store.categorias,
        produtos: store.produtos,
      });
      const url = URL.createObjectURL(blob);
      const data = new Date().toISOString().slice(0, 10);
      const link = document.createElement("a");
      link.href = url;
      link.download = `catalogo-filinto-${data}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportando(false);
    }
  }
```

E adicionar o botão na barra de ações, antes de "Restaurar padrão":

```tsx
          <button
            type="button"
            onClick={handleExportarPdf}
            disabled={exportando}
            className="rounded-lg bg-[#AC1214] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {exportando ? "Gerando..." : "Exportar PDF"}
          </button>
```

O import de `@react-pdf/renderer` é dinâmico (`await import(...)` dentro do handler) para não aumentar o bundle inicial do painel com uma biblioteca que só é usada quando o botão é clicado.

- [ ] **Step 4: Verificar que o projeto builda**

Run: `npm run build`
Expected: build termina sem erro de tipo/compilação.

- [ ] **Step 5: Verificar que os testes continuam passando**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 6: Verificação manual no navegador**

Run: `npm run dev`, logar em `/admin`.

- Clicar em "Exportar PDF": botão mostra "Gerando..." brevemente, depois um arquivo `catalogo-filinto-AAAA-MM-DD.pdf` é baixado.
- Abrir o PDF: cabeçalho vermelho (`#AC1214`) com "Filinto Sorvetes" na fonte script, seções por categoria na mesma ordem do painel, produtos com nome e preço em R$, descrição exibida quando existir.
- Editar o preço de um produto no painel, exportar de novo: o novo PDF reflete o preço atualizado.
- Excluir todos os produtos de uma categoria (sem excluir a categoria): essa categoria não aparece no PDF (sem seção vazia).

- [ ] **Step 7: Commit**

```bash
git add catalogo/package.json catalogo/package-lock.json catalogo/lib/pdf/catalogo-pdf.tsx catalogo/components/AdminPanel.tsx
git commit -m "feat: export catalog as branded PDF from the admin panel"
```
