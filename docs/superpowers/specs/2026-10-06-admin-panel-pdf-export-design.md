# Painel admin + exportação de catálogo em PDF — Design Spec

**Goal:** Permitir que o Filinto edite produtos e categorias do catálogo por um
painel admin protegido por senha, e exporte o catálogo atual como PDF
(sempre refletindo os dados em vigor) para enviar a empresas que só aceitam
pedidos/cardápios nesse formato.

**Contexto:** até aqui o catálogo é estático — `lib/produtos.ts` é um array
fixo lido direto pela página pública, sem backend algum (ver
`2026-10-01-catalogo-v1-design.md`). Nesta rodada o cliente decidiu **não**
trazer Supabase ainda (fica pra quando o projeto evoluir pra Fase 2); o
painel admin e o PDF precisam funcionar só com front-end.

**Non-goals:**
- Sem banco de dados / Supabase nesta rodada — persistência é só
  `localStorage` do navegador.
- Sem upload de imagem de produto — painel não tem campo de foto; produtos
  continuam sem imagem real (como hoje).
- Sem sincronização entre dispositivos/navegadores — editar no celular e no
  notebook são dois estados independentes (cada um com seu `localStorage`).
- Sem botão de exportar PDF na página pública — a ação é exclusiva do
  painel admin.
- Sem múltiplos usuários/permissões — uma senha única, um nível de acesso.

## Arquitetura geral

Introduz uma camada de dados client-side que substitui a leitura direta do
array estático:

- `lib/catalogo-store.ts` — hook `useCatalogStore()` que mantém **produtos**
  e **categorias** em estado React, persistido em `localStorage` sob uma
  chave única (`filinto-catalogo-v1`).
- Na primeira visita (sem nada salvo), o store semeia o estado a partir dos
  arrays estáticos atuais (`lib/produtos.ts` / categorias hoje fixas no
  tipo `Produto.categoria`), que passam a ser apenas o **default inicial**,
  não mais a fonte de verdade em runtime.
- A página pública (`/`) e o painel (`/admin`) consomem o mesmo hook —
  edições no admin refletem no catálogo público imediatamente na mesma aba,
  e após reload em outras abas/sessões (via `localStorage`).
- Hidratação: como o estado real só existe no navegador, o primeiro render
  usa os defaults (evita mismatch de SSR) e um `useEffect` carrega o
  `localStorage` em seguida, substituindo o estado se houver dados salvos.

### Modelo de dados

```ts
type Categoria = {
  id: string;
  nome: string;
  ordem: number;
};

type Produto = {
  id: string;
  categoriaId: string; // referencia Categoria.id
  nome: string;
  preco: number;
  descricao?: string;
  ordem: number;
};
```

`categoria` como union fixa (`"sorvetes" | "acai" | "milkshakes"`) deixa de
existir — categorias passam a ser entidades com id próprio, criadas pelo
admin.

## Autenticação do painel

- Senha única via variável de ambiente `ADMIN_PASSWORD` (Vercel +
  `.env.local` em dev).
- `/admin/login`: formulário de senha → Server Action compara com
  `process.env.ADMIN_PASSWORD` → se correto, seta cookie `httpOnly`
  (`admin_session`, valor opaco fixo, sem JWT) e redireciona para `/admin`.
- `middleware.ts` protege todas as rotas `/admin/**` exceto `/admin/login`:
  sem o cookie, redireciona para o login.
- Botão "Sair" no admin limpa o cookie (Server Action simples).
- Nível de segurança básico, adequado ao risco desta fase (não resiste a um
  atacante determinado; suficiente para impedir acesso casual).

## Painel admin — categorias e produtos

`/admin` (autenticado) mostra as categorias existentes como seções:

- **Categorias**: criar nova (nome), renomear, excluir (com confirmação —
  excluir uma categoria exclui os produtos dela; aviso explícito disso na
  confirmação), reordenar via setas (sem drag-and-drop).
- **Produtos** (dentro de cada categoria): lista com nome + preço e ações
  (editar, excluir, reordenar via setas). Criar/editar produto abre um
  **modal** com campos nome, preço, descrição (sem campo de imagem).
- Validação: nome obrigatório (categoria e produto), preço numérico > 0.
- Botão "Restaurar padrão": limpa o `localStorage` e recarrega os defaults
  originais — desfaz testes/erros do próprio cliente.
- Toda alteração persiste automaticamente no `localStorage` ao confirmar o
  modal ou a ação (sem botão "Salvar" global).

## Exportação de PDF

- Botão "Exportar PDF" no topo do `/admin`.
- Novo documento React-PDF em `lib/pdf/catalogo-pdf.tsx`, construído com os
  primitivos do `@react-pdf/renderer` (`Document`, `Page`, `View`, `Text`,
  `Image`) — não reaproveita o CSS/componentes do site, é um layout próprio
  nesse "dialeto":
  - Cabeçalho com "Filinto Sorvetes" na fonte script (`Dancing Script`,
    registrada via URL do Google Fonts) sobre a cor da marca `#AC1214`.
  - Seções por categoria, na ordem definida no admin.
  - Cada produto: nome + preço formatado em R$ (reaproveita
    `lib/format.ts`). Sem fotos (consistente com a ausência de imagem real
    no catálogo hoje).
- Geração 100% client-side ao clicar: lê o estado atual de
  `useCatalogStore`, monta `<CatalogoPDF dados={...} />`, chama
  `pdf(...).toBlob()`, cria um blob URL e dispara download via `<a
  download>`. Sem round-trip de servidor — garante que o PDF reflete
  exatamente o estado em vigor no momento do clique.
- Nome do arquivo: `catalogo-filinto-{AAAA-MM-DD}.pdf`.

## Fora de escopo (confirmar não esquecido)

- Integração Supabase (fica para quando o projeto avançar de fase).
- Upload/troca de foto de produto.
- Sincronização entre dispositivos.
- PDF acessível pela página pública.
- Gerenciamento de múltiplos usuários/permissões no admin.

## Testes / Verificação

Sem testes automatizados de UI (consistente com o padrão do projeto —
`lib/*.test.ts` cobre só funções puras). Cobertura automatizada prevista:
- `lib/catalogo-store.ts`: lógica de seed inicial, CRUD de produto/categoria,
  reordenação — testável fora do React (funções puras por trás do hook, se
  viável) ou via testes do hook.
- `lib/pdf/catalogo-pdf.tsx`: se a geração dos dados de entrada do PDF for
  isolada numa função pura (ex: agrupar produtos por categoria ordenada),
  cobrir com teste unitário.

Verificação manual via `npm run dev`:
- Login com senha errada bloqueia; senha certa libera `/admin` e cookie
  persiste em reload.
- Criar/editar/excluir categoria e produto refletem na lista do admin e na
  página pública (mesma aba, sem reload).
- Reload da página pública após editar no admin mantém os dados (persistiu
  no `localStorage`).
- "Restaurar padrão" volta aos dados originais.
- "Exportar PDF" gera arquivo com os dados atuais (editar um preço, exportar
  de novo, confirmar que o PDF novo reflete a mudança), visual com a marca
  (cor, fonte script no título), categorias na ordem certa.
- Acesso direto a `/admin` sem cookie redireciona para `/admin/login`.
