# Catálogo no Supabase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Categorias e produtos do catálogo passam a morar no Supabase; o `/admin` grava lá e o site público lê de lá.

**Architecture:** As duas páginas (`/` e `/admin`) viram Server Components que leem o banco com a chave `anon` e passam os dados por props aos componentes de tela, que continuam client. Toda escrita é uma Server Action que confere o cookie de sessão do admin e grava com a `service_role`. O `localStorage` e o estado local saem.

**Tech Stack:** Next.js 16.3 (App Router), React 19, `@supabase/supabase-js`, Vitest, Tailwind 4.

**Spec:** `docs/superpowers/specs/2026-11-03-banco-de-dados-design.md`

> O `AGENTS.md` do projeto avisa que este Next tem mudanças em relação ao que você conhece. Antes de escrever Server Actions, `revalidatePath` ou a configuração de renderização dinâmica, leia o guia correspondente em `catalogo/node_modules/next/dist/docs/01-app/` (por exemplo `02-guides/caching-without-cache-components.md`).

## Global Constraints

- Admin continua com **senha única** (`ADMIN_PASSWORD`); sem login por e-mail.
- O cliente só pode: marcar produto disponível/indisponível, editar o **nome** do produto, ocultar/mostrar categoria. Não cria nem apaga produto ou categoria, não troca foto, não reordena, não renomeia categoria.
- `SUPABASE_SERVICE_ROLE_KEY` nunca recebe prefixo `NEXT_PUBLIC_` e só é lida em código de servidor.
- RLS ligado nas duas tabelas: leitura pública, nenhuma política de escrita.
- Os ids atuais de categorias e produtos em `lib/catalogo-store.ts` são mantidos.
- Fotos continuam em `public/produtos`; no banco fica só o caminho, em `imagem_url`.
- Categoria oculta some do site público e do PDF; no admin continua visível, marcada como oculta.
- Commits em Conventional Commits.

## Review Focus

- Banco fora do ar ou vazio: a página pública mostra o catálogo do código em vez de ficar em branco (Task 2).
- Escrita sem cookie, ou com senha errada: nada é gravado (Task 3).
- Nome de produto vazio, só espaços ou com mais de 80 caracteres: recusado, nome antigo permanece (Task 3).
- Id inexistente em qualquer ação: devolve erro, não quebra a tela (Task 3).
- Categoria oculta some também do menu de categorias e do PDF, junto com seus produtos (Tasks 2 e 5).
- Depois de salvar no admin, o site público mostra a mudança no próximo reload, sem esperar cache (Task 4).

---

### Task 1: Banco, clientes Supabase e carga inicial

**Files:**
- Create: `catalogo/supabase/schema.sql`
- Create: `catalogo/lib/supabase.ts`
- Create: `catalogo/scripts/seed.ts`
- Modify: `catalogo/lib/catalogo-store.ts` (adicionar `oculta?: boolean` ao tipo `Categoria`)
- Modify: `catalogo/package.json` (dependência `@supabase/supabase-js`)

**Interfaces:**
- Produces: `createPublicClient(): SupabaseClient` (URL + chave `anon`) e `createServiceClient(): SupabaseClient` (URL + `service_role`) em `lib/supabase.ts`; ambas lançam erro claro se a variável de ambiente faltar. `Categoria.oculta?: boolean`.

- [ ] **Step 1: Escrever `supabase/schema.sql`** com `categorias(id text pk, nome text not null, ordem int not null, oculta boolean not null default false)` e `produtos(id text pk, categoria_id text not null references categorias(id), nome text not null, imagem_url text, esgotado boolean not null default false, ordem int not null)`; `enable row level security` nas duas e uma política `for select using (true)` em cada.
- [ ] **Step 2: Instalar `@supabase/supabase-js`** e implementar `lib/supabase.ts` com as duas funções acima (sem persistir sessão).
- [ ] **Step 3: Implementar `scripts/seed.ts`:** lê `DEFAULT_CATALOGO`, faz `upsert` de categorias e depois de produtos (`ordem` = posição no array; `imagem_url` = `produto.imagem ?? null`), usando `createServiceClient`. Rodar com `npx tsx --env-file=.env.local scripts/seed.ts`.
- [ ] **Step 4: Passo manual do Lucca:** colar `schema.sql` no SQL Editor do Supabase e confirmar que as 3 variáveis do `.env.local` estão preenchidas.
- [ ] **Step 5: Rodar o seed e verificar:** no Table Editor, `categorias` tem 8 linhas e `produtos` tem o mesmo número de itens de `DEFAULT_CATALOGO.produtos`. Rodar o seed duas vezes não duplica nada.
- [ ] **Step 6: Commit** `feat: add supabase schema, clients and seed`

### Task 2: Leitura do catálogo

**Files:**
- Create: `catalogo/lib/catalogo-db.ts`
- Test: `catalogo/lib/catalogo-db.test.ts`

**Interfaces:**
- Consumes: `createPublicClient()` (Task 1), `CatalogoState`, `DEFAULT_CATALOGO`.
- Produces, em `lib/catalogo-db.ts`:
  - `montarCatalogo(categorias: CategoriaRow[], produtos: ProdutoRow[]): CatalogoState` (linhas em snake_case; ordena por `ordem`; `imagem_url` null vira `imagem` indefinido; `oculta` vem para `Categoria`).
  - `getCatalogo(): Promise<CatalogoState>` (lê as duas tabelas; lança se o Supabase devolver erro).
  - `getCatalogoOuPadrao(): Promise<CatalogoState>` (devolve `DEFAULT_CATALOGO` se `getCatalogo` lançar ou vier sem categorias).
  - `apenasVisiveis(state: CatalogoState): CatalogoState` (remove categorias ocultas e os produtos delas).

- [ ] **Step 1: Escrever os testes** em `catalogo-db.test.ts`:
  - `montarCatalogo` ordena categorias e produtos por `ordem` mesmo com linhas fora de ordem.
  - `montarCatalogo` converte `imagem_url: null` em `imagem === undefined` e preserva `oculta` e `esgotado`.
  - `apenasVisiveis` com uma categoria oculta remove ela e os produtos dela, e mantém as demais.
  - `getCatalogoOuPadrao` devolve `DEFAULT_CATALOGO` quando o leitor injetado lança (aceitar o leitor como parâmetro opcional com `getCatalogo` como padrão).
- [ ] **Step 2: Rodar `npm test -- catalogo-db`** e ver falhar (funções inexistentes).
- [ ] **Step 3: Implementar as quatro funções.** `getCatalogoOuPadrao(ler = getCatalogo)`.
- [ ] **Step 4: Rodar `npm test -- catalogo-db`** e ver passar.
- [ ] **Step 5: Commit** `feat: read catalog from supabase`

### Task 3: Ações de escrita do admin

**Files:**
- Modify: `catalogo/lib/auth.ts` (adicionar `assertAdmin`)
- Modify: `catalogo/lib/auth.test.ts`
- Create: `catalogo/lib/catalogo-actions.ts` (`"use server"`)
- Create: `catalogo/lib/validar-nome.ts`
- Test: `catalogo/lib/validar-nome.test.ts`

**Interfaces:**
- Consumes: `createServiceClient()` (Task 1), `isValidAdminPassword`, `ADMIN_SESSION_COOKIE`.
- Produces:
  - `assertAdmin(session: string | undefined): void` em `lib/auth.ts`; lança `Error("Não autorizado")` se faltar cookie ou a senha for inválida.
  - `validarNome(nome: string): string` em `lib/validar-nome.ts` (arquivo separado porque um arquivo `"use server"` só pode exportar funções assíncronas). Retorna o nome com `trim()`; lança se vazio ou com mais de 80 caracteres.
  - Ações, todas `Promise<{ error?: string }>`: `setProdutoEsgotado(id: string, esgotado: boolean)`, `setProdutoNome(id: string, nome: string)`, `setCategoriaOculta(id: string, oculta: boolean)`.
  - Cada ação: lê o cookie, chama `assertAdmin`, grava com a service role, devolve `{ error }` se o Supabase falhar **ou se nenhuma linha foi afetada** (id inexistente), e em sucesso chama `revalidatePath("/")` e `revalidatePath("/admin")`.

- [ ] **Step 1: Escrever os testes:**
  - `assertAdmin(undefined)` lança; `assertAdmin("errada")` lança; `assertAdmin(process.env.ADMIN_PASSWORD)` não lança (definir a variável no teste).
  - `validarNome("  Creme 1,8L  ")` devolve `"Creme 1,8L"`; `validarNome("")`, `validarNome("   ")` e `validarNome("a".repeat(81))` lançam; `validarNome("a".repeat(80))` passa.
- [ ] **Step 2: Rodar `npm test -- auth validar-nome`** e ver falhar.
- [ ] **Step 3: Implementar `assertAdmin` e `validar-nome.ts`.**
- [ ] **Step 4: Implementar as três ações** em `catalogo-actions.ts`. Para detectar id inexistente, pedir `.select("id")` no `update` e checar se voltou vazio.
- [ ] **Step 5: Rodar `npm test`** e ver tudo passar; rodar `npx tsc --noEmit`.
- [ ] **Step 6: Commit** `feat: add admin write actions`

### Task 4: Site público lendo do banco

**Files:**
- Create: `catalogo/components/CatalogoHome.tsx` (conteúdo atual de `Home`, recebendo `categorias` e `produtos` por props; continua `"use client"`)
- Modify: `catalogo/app/page.tsx` (Server Component)

**Interfaces:**
- Consumes: `getCatalogoOuPadrao`, `apenasVisiveis` (Task 2).
- Produces: `CatalogoHome({ categorias, produtos }: CatalogoState)`.

- [ ] **Step 1: Mover o JSX atual** de `app/page.tsx` para `CatalogoHome`, trocando `useCatalogStore()` pelas props.
- [ ] **Step 2: Reescrever `app/page.tsx`** como função `async` que faz `apenasVisiveis(await getCatalogoOuPadrao())` e renderiza `<CatalogoHome {...catalogo} />`, com a página marcada como dinâmica (`export const dynamic = "force-dynamic"`, confirmando nos docs do Next 16.3 que ainda é a forma certa) para que uma edição do admin apareça no reload seguinte.
- [ ] **Step 3: Verificar no navegador** (`npm run dev`): a home mostra as 8 categorias e as fotos dos potes; no Supabase, marcar uma categoria como `oculta = true` e recarregar: ela some da página **e do menu de categorias**; desfazer.
- [ ] **Step 4: Rodar `npm test` e `npx tsc --noEmit`**, depois commit `feat: serve public catalog from supabase`

### Task 5: Admin reduzido, lendo e gravando no banco

**Files:**
- Modify: `catalogo/app/admin/page.tsx` (Server Component que lê `getCatalogo()` e passa por props)
- Modify: `catalogo/components/AdminPanel.tsx`, `AdminCategoriaCard.tsx`, `AdminProdutoModal.tsx`
- Delete: `catalogo/lib/useCatalogStore.ts`
- Modify: `catalogo/lib/catalogo-store.ts` e `catalogo-store.test.ts` (remover as funções puras `addCategoria`, `renameCategoria`, `removeCategoria`, `moveCategoria`, `addProduto`, `updateProduto`, `removeProduto`, `moveProduto` e seus testes; manter tipos, `DEFAULT_CATALOGO` e os 3 testes de `DEFAULT_CATALOGO`)

**Interfaces:**
- Consumes: `getCatalogo`, ações da Task 3, `Categoria.oculta`.
- Produces: `AdminPanel({ categorias, produtos }: CatalogoState)`; `AdminCategoriaCard({ categoria, produtos })`.

- [ ] **Step 1: `app/admin/page.tsx`** vira `async`, chama `getCatalogo()` (aqui um erro **não** cai no padrão: deixar estourar para o admin nunca editar dados que não são os reais) e renderiza `AdminPanel`. Mesma marcação dinâmica da Task 4.
- [ ] **Step 2: `AdminPanel`:** remover o formulário "Nova categoria", o texto "As edições ficam salvas só neste navegador" e o estado do store; "Exportar PDF" passa a usar `apenasVisiveis({ categorias, produtos })` como entrada de `buildCatalogoPdfBlob`.
- [ ] **Step 3: `AdminCategoriaCard`:** remover renomear, excluir, mover (categoria e produto), "Adicionar produto" e excluir produto. Ficam: botão "Ocultar categoria"/"Mostrar categoria" (chama `setCategoriaOculta`, com selo "Oculta" no título quando for o caso), por produto o botão "Marcar esgotado"/"Marcar disponível" (`setProdutoEsgotado`) e "Editar" nome.
- [ ] **Step 4: `AdminProdutoModal`:** só o campo nome (sem foto, sem categoria), salvando por `setProdutoNome`; mostra a mensagem de `error` retornado e fecha em caso de sucesso.
- [ ] **Step 5: Em cada botão,** usar `useTransition` para desabilitar enquanto grava e mostrar uma linha de erro (`role="alert"`) se a ação devolver `error`.
- [ ] **Step 6: Apagar `useCatalogStore.ts`,** podar `catalogo-store.ts` e seu teste, e grepar `useCatalogStore`, `localStorage` e `filinto-catalogo-v` para confirmar que nada sobrou.
- [ ] **Step 7: Rodar `npm test`, `npx tsc --noEmit` e `npm run lint`;** tudo limpo.
- [ ] **Step 8: Commit** `feat: admin edits catalog in supabase`

### Task 6: Verificação ponta a ponta e publicação

**Files:**
- Modify: `catalogo/README.md` (seção curta: variáveis de ambiente, como rodar o schema e o seed)

- [ ] **Step 1: Teste no Chrome** (workflow do Lucca): logar no `/admin`; marcar um produto como esgotado, editar um nome e ocultar uma categoria; abrir `/` em **outro navegador ou aba anônima** e confirmar que as três mudanças aparecem; exportar o PDF e confirmar que a categoria oculta não está nele e o esgotado vem em preto e branco; desfazer as três mudanças.
- [ ] **Step 2: Segurança básica:** sem cookie, abrir `/admin` redireciona para `/admin/login`; conferir que `SUPABASE_SERVICE_ROLE_KEY` não aparece em nenhum arquivo de `.next/static`.
- [ ] **Step 3: Rodar `npm test` e `npm run build`** sem erros.
- [ ] **Step 4: Na Vercel,** cadastrar as 3 variáveis do Supabase (Production) e `ADMIN_PASSWORD` se ainda não existir; fazer push e conferir que o deploy termina.
- [ ] **Step 5: Repetir o teste do Step 1** no endereço publicado.
- [ ] **Step 6: Commit** `docs: document supabase setup`
