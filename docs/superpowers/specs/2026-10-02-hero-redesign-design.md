# Redesign do Hero (referência Cafe & Creamery) — Design Spec

**Goal:** Aproximar visualmente o Hero do catálogo Filinto Sorvetes de uma referência (template "Cafe and Creamery"), adicionando: barra de navegação superior, decoração de frutas nos cantos, e uma borda "derretendo" na transição pro resto da página. Escopo limitado ao Hero — categorias e footer não mudam nesta rodada.

**Non-goals:**
- Não trocar a tipografia do título (mantém Dancing Script, não vai pra brush/pincel como na referência).
- Não adicionar menu de navegação com links (Home/About/Menu/Gallery/etc.) — o catálogo é página única.
- Não adicionar carrossel/slider numerado (01-05) da referência.
- Não gerar fotos reais de produto nesta rodada — decoração de frutas é SVG flat, não foto.
- Não alterar o comportamento da intro splash existente além de atrasar a entrada dos novos elementos.

## Referência visual

Template com fundo vermelho escuro, nav superior (logo + contato + redes sociais + botão), tipografia brush grande, framboesas decorativas nos cantos, foto grande de produto central, e borda inferior com efeito de gotejamento (drip) fazendo a transição pro fundo claro da seção seguinte.

## Arquitetura

Quatro arquivos em `catalogo/components/`:

- **`Hero.tsx`** (modificado) — mantém a máquina de estados de fase (`"intro" | "done"`) já existente (ver `docs/superpowers/specs/2026-10-01-intro-splash-design.md` e a nota de revisão no plano correspondente). Passa a compor: `HeroNav`, conteúdo central (logo circular + título + subtítulo, como hoje), `HeroFruitDecor` (x2) e `HeroDripEdge`. Os quatro elementos novos só renderizam quando `phase === "done"`.
- **`HeroNav.tsx`** (novo) — barra fina no topo do Hero: logo pequeno (reaproveita `/logo-filinto.png`) à esquerda, botão "Pedir no WhatsApp" à direita (mesmo util `buildWhatsAppUrl` + `WHATSAPP_NUMBER` usados em `FloatingWhatsAppButton.tsx`, mesma cor de destaque). Não é `fixed`/`sticky` — rola junto com a página; o `FloatingWhatsAppButton` já cobre a necessidade de CTA persistente durante o scroll. Em viewport de 375px, o botão pode reduzir para só o ícone de WhatsApp se o texto não couber numa linha.
- **`HeroFruitDecor.tsx`** (novo) — componente de decoração, renderiza por padrão um SVG flat de morango/framboesa (2-3 cores, formas simples) inline. Aceita uma prop opcional `src?: string` — se fornecida, renderiza um `<Image>` com esse src no lugar do SVG, permitindo trocar por um asset de alta qualidade no futuro sem mudar o layout que o usa. Posicionado absoluto, um no canto superior esquerdo e um no canto superior direito do Hero, atrás do conteúdo central (z-index baixo) e com opacidade reduzida (~0.8) pra não competir com logo/título. Reduz de tamanho em viewports pequenos (não some).
- **`HeroDripEdge.tsx`** (novo) — SVG de "gotas" (blobs) na cor `#AC1214`, posicionado absoluto na base do `Hero`, criando a transição de derretimento pro fundo branco da primeira `CategorySection`. Largura 100%, altura proporcional, formas simples (3-5 gotas de tamanhos variados é suficiente — não precisa replicar exatamente a referência).

## Interação com a intro splash

Durante a fase `"intro"` (tela cheia vermelha, splash ativa), `HeroNav`, `HeroFruitDecor` e `HeroDripEdge` **não renderizam** — o visual da splash continua idêntico ao atual (logo + título centralizados em tela cheia). Assim que `phase` muda para `"done"` (ao fim do `HOLD_UNTIL_MS` e do encolhimento via `layout`), os três elementos aparecem com fade-in (opacity 0 → 1, usando o padrão `motion`/`transition` já usado no restante do componente). Em carregamento com `prefers-reduced-motion: reduce` (onde `phase` já começa em `"done"`), os elementos aparecem direto, sem fade.

## Responsividade

Mobile-first (375px) é a referência principal, conforme já estabelecido no projeto:
- Nav: logo pequeno + botão (texto ou só ícone conforme espaço).
- Frutas: tamanho reduzido nos cantos, sem sobrepor texto do título/subtítulo.
- Drip edge: altura proporcionalmente menor em mobile pra não consumir espaço vertical demais.

Desktop (verificado depois do mobile): elementos podem crescer moderadamente, mantendo as proporções do Hero atual.

## Testes / Verificação

Sem testes automatizados visuais, consistente com o padrão já usado no projeto (`lib/*.test.ts` só cobre funções puras). Verificação manual via `npm run dev`:
- Em 375px: nav legível e sem overflow, frutas não cobrem texto, drip edge visível e proporcional.
- Em desktop: mesmos pontos, checando se os elementos escalam bem.
- Intro splash: recarregar a página e confirmar que a sequência de abertura continua idêntica à atual, com nav/frutas/drip aparecendo só depois do encolhimento, com fade.
- `prefers-reduced-motion: reduce` (DevTools → Rendering): Hero já nasce em `"done"`, elementos novos visíveis sem animação de fade.
