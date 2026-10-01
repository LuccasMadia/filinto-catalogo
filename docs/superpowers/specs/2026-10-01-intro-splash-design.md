# Animação de abertura (intro splash) — Filinto Sorvetes

## Contexto

Pedido pontual do Lucca: quando o cliente abre o site, antes do layout normal
aparecer, deve tocar uma sequência de abertura que reforça a marca — fundo
vermelho cheio, logo, texto, e depois encolhe para o tamanho do hero atual.

O spec original (`2026-10-01-catalogo-v1-design.md`) lista "animações
elaboradas (GSAP etc.)" como fora de escopo da Fase 1. Esta splash é uma
exceção pontual aprovada — uma única transição de abertura, não um sistema de
animações — por isso ganha spec próprio em vez de reabrir o spec principal.

## Sequência (total ~1.8s)

1. `0.0s` — fundo vermelho (`#AC1214`) cobre 100% da viewport (`100dvh`),
   fade-in 0.3s
2. `0.3s` — logo do Filinto aparece (fade + leve scale-up), 0.4s
3. `0.7s` — texto "Filinto Sorvetes" + subtítulo aparecem embaixo, 0.3s
4. `1.0s` — segura 1s nesse estado
5. `2.0s` — o bloco vermelho encolhe até virar exatamente o `Hero` de hoje
   (mesma altura `py-16`, mesma posição no topo da página), 0.5s
6. `~2.5s` — splash desmonta, `Hero` real assume o lugar, scroll é liberado

## Arquitetura

- Novo componente client-side `IntroSplash`
  (`catalogo/components/IntroSplash.tsx`), renderizado no topo de `page.tsx`,
  acima do `<Hero />`.
- Usa Framer Motion (`motion/react`) com `layoutId` compartilhado entre o
  bloco vermelho/logo da splash e o bloco vermelho/logo do `Hero` — a
  biblioteca anima automaticamente a transição de tamanho/posição de "tela
  cheia" para "tamanho do Hero", sem cálculo manual de posições.
- `Hero.tsx` precisa expor o mesmo `layoutId` no seu contêiner vermelho e na
  tag da logo para o morph funcionar.

## Comportamento

- Toca em todo carregamento de página (sem `sessionStorage`, sem lembrar que
  já foi vista)
- Rolagem da página travada (`overflow: hidden` no `body`) enquanto a splash
  está ativa; liberada quando ela desmonta
- Respeita `prefers-reduced-motion: reduce` — nesse caso pula direto para o
  estado final (Hero normal, sem overlay, sem travar scroll)
- Mesma sequência em mobile e desktop; splash ocupa `100dvh` cheio

## Dependências

- Adiciona `framer-motion` (ou `motion`, pacote sucessor) como dependência de
  produção — única exceção à ausência de libs de animação do spec principal

## Fora de escopo

- Qualquer outra animação além desta splash de abertura
- Pular a animação com um clique/tap do usuário
- Lembrar que o cliente já viu a splash (sempre toca)

## Critério de pronto

Ao abrir `/` (local ou preview Vercel), a sequência acima toca sem travar o
layout final, termina em até ~2.5s, respeita `prefers-reduced-motion`, e o
`Hero` final fica indistinguível do Hero atual (mesma posição/tamanho).
