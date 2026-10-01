# Animação de abertura (intro splash) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ao abrir `/`, tocar uma sequência de abertura (fundo vermelho cheio → logo → texto → encolhe para o Hero atual) antes do layout normal, usando Framer Motion.

**Architecture:** ~~Um componente client `IntroSplash` renderizado acima do `Hero`~~ — **revisado durante a implementação**: um `layoutId` compartilhado entre dois componentes sempre montados simultaneamente (`IntroSplash` fixo sobre a página + `Hero` já presente por baixo) não é um padrão suportado pelo Framer Motion — na prática ele produz um Hero final com opacidade/cor quebradas. A arquitetura final é um único componente `Hero` com estado de fase (`"intro" | "done"`), usando a prop `layout` do Framer Motion para animar a própria transição de tamanho/posição (tela cheia → tamanho do header normal) e `initial`/`animate` para o fade-in da logo e do texto. Não existe mais `IntroSplash.tsx`.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS, Framer Motion (`framer-motion`).

## Global Constraints

- Cor de marca: `#AC1214` (do spec principal)
- Toca em todo carregamento de página, sem `sessionStorage` (do spec da splash)
- Rolagem travada (`overflow: hidden` no body) enquanto a splash está ativa (do spec da splash)
- Deve respeitar `prefers-reduced-motion: reduce` pulando a animação inteira (do spec da splash)
- Sequência: bg fade-in 0.3s → logo 0.3s–0.7s → texto 0.7s–1.0s → hold até 2.0s → encolhe 2.0s–2.5s (do spec da splash)
- Sem botão de "pular", sem lembrar que já foi vista (fora de escopo, do spec da splash)
- Projeto não tem jsdom/testing-library configurado; componentes visuais não têm testes automatizados hoje (`lib/*.test.ts` só testa funções puras) — verificação desta feature é manual via `npm run dev` + navegador, consistente com o padrão já usado no projeto.

---

### Task 1: Adicionar dependência Framer Motion

**Files:**
- Modify: `catalogo/package.json`

**Interfaces:**
- Produces: pacote `framer-motion` disponível para import em `motion/react`-style API (`import { motion, AnimatePresence } from "framer-motion"`) nas próximas tasks.

- [ ] **Step 1: Instalar o pacote**

Run (dentro de `catalogo/`): `npm install framer-motion`

Expected: `package.json` ganha `"framer-motion": "^<versão>"` em `dependencies`, `package-lock.json` é atualizado, instalação termina sem erro.

- [ ] **Step 2: Confirmar que o resto do projeto continua saudável**

Run: `npm run test` (dentro de `catalogo/`)
Expected: PASS (os 3 arquivos de teste existentes em `lib/*.test.ts` continuam passando — a nova dependência não afeta esses testes).

- [ ] **Step 3: Commit**

```bash
git add catalogo/package.json catalogo/package-lock.json
git commit -m "chore: add framer-motion dependency"
```

---

### Task 2: Converter `Hero` em componente client com elementos de layout compartilhado

**Files:**
- Modify: `catalogo/components/Hero.tsx`

**Interfaces:**
- Consumes: `framer-motion` (`motion`) instalado na Task 1.
- Produces: `<Hero />` passa a renderizar um `motion.header` com `layoutId="hero-bg"` envolvendo um `motion.div` com `layoutId="hero-logo"` — esses dois `layoutId`s são os que `IntroSplash` (Task 3) vai usar para o morph.

- [ ] **Step 1: Reescrever o componente**

Substituir todo o conteúdo de `catalogo/components/Hero.tsx`:

```tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <motion.header
      layoutId="hero-bg"
      transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
      className="bg-[#AC1214] px-4 py-16 text-center text-white"
    >
      <motion.div
        layoutId="hero-logo"
        transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
        className="mx-auto mb-4 h-[140px] w-[140px]"
      >
        <Image
          src="/logo-filinto.png"
          alt="Filinto Sorvetes"
          width={140}
          height={140}
          className="rounded-full"
          preload
        />
      </motion.div>
      <h1 className="font-[family-name:var(--font-dancing-script)] text-4xl">
        Filinto Sorvetes
      </h1>
      <p className="mt-2 text-white/90">O sabor que refresca o seu dia</p>
    </motion.header>
  );
}
```

- [ ] **Step 2: Verificar que o projeto builda**

Run: `npm run build` (dentro de `catalogo/`)
Expected: build termina sem erro de tipo/compilação (a página `/` segue sendo gerada normalmente, agora com `Hero` como client component).

- [ ] **Step 3: Verificar que os testes existentes continuam passando**

Run: `npm run test`
Expected: PASS (sem relação com `Hero`, apenas confirmando que nada quebrou).

- [ ] **Step 4: Commit**

```bash
git add catalogo/components/Hero.tsx
git commit -m "refactor: convert Hero to client component with shared layout ids"
```

---

### Task 3: Criar `IntroSplash` e montá-lo na página

**Files:**
- Create: `catalogo/components/IntroSplash.tsx`
- Modify: `catalogo/app/page.tsx`

**Interfaces:**
- Consumes: `framer-motion` (`motion`, `AnimatePresence`); `layoutId`s `"hero-bg"` e `"hero-logo"` definidos em `Hero.tsx` (Task 2).
- Produces: `<IntroSplash />`, componente sem props, pronto para ser renderizado uma vez por `page.tsx`.

- [ ] **Step 1: Criar o componente**

Criar `catalogo/components/IntroSplash.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const HOLD_UNTIL_MS = 2000;

export function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setSkip(true);
      return;
    }

    setVisible(true);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setVisible(false);
    }, HOLD_UNTIL_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  if (skip) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          layoutId="hero-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            default: { duration: 0.3 },
            layout: { duration: 0.5, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#AC1214] text-center text-white"
        >
          <motion.div
            layoutId="hero-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              default: { delay: 0.3, duration: 0.4 },
              layout: { duration: 0.5, ease: "easeInOut" },
            }}
            className="mb-4 h-[140px] w-[140px]"
          >
            <Image
              src="/logo-filinto.png"
              alt="Filinto Sorvetes"
              width={140}
              height={140}
              className="rounded-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <h1 className="font-[family-name:var(--font-dancing-script)] text-4xl">
              Filinto Sorvetes
            </h1>
            <p className="mt-2 text-white/90">
              O sabor que refresca o seu dia
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Montar na página**

Em `catalogo/app/page.tsx`, adicionar o import e renderizar antes do `<Hero />`:

```tsx
import { Hero } from "@/components/Hero";
import { IntroSplash } from "@/components/IntroSplash";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { produtos, CATEGORIAS } from "@/lib/produtos";

export default function Home() {
  return (
    <main>
      <IntroSplash />
      <Hero />
      {CATEGORIAS.map((categoria) => (
        <CategorySection
          key={categoria.id}
          titulo={categoria.titulo}
          produtos={produtos.filter((p) => p.categoria === categoria.id)}
        />
      ))}
      <Footer />
      <FloatingWhatsAppButton />
    </main>
  );
}
```

- [ ] **Step 3: Build e testes existentes**

Run: `npm run build` então `npm run test`
Expected: ambos PASS.

- [ ] **Step 4: Verificação manual no navegador**

Run: `npm run dev`, abrir `http://localhost:3000`.
Expected (checklist manual):
- Ao carregar, tela fica vermelha cheia, logo aparece, depois o texto
- Por ~1s depois do texto, nada muda (hold)
- Em seguida o bloco vermelho encolhe suavemente até virar o cabeçalho atual, no topo da página
- Durante toda a sequência (até o fim do encolhimento), a página não rola
- Depois da sequência, a página rola normalmente e o Hero final é visualmente idêntico ao Hero de hoje
- Recarregar a página repete a sequência (não é pulada na segunda vez)

- [ ] **Step 5: Commit**

```bash
git add catalogo/components/IntroSplash.tsx catalogo/app/page.tsx
git commit -m "feat: add intro splash animation before Hero"
```

---

## Verificação de `prefers-reduced-motion`

Não há automação de emulação de mídia disponível neste ambiente para testar isso via navegador automatizado. A lógica (`window.matchMedia("(prefers-reduced-motion: reduce)").matches`) é a API padrão do browser e o caminho de código (`skip = true` → `return null`, sem travar scroll) é direto o suficiente para confiar na revisão de código. Se quiser confirmar manualmente depois: Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → "reduce", recarregar a página.
