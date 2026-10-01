# Catálogo digital Filinto Sorvetes — v1 (mockup de apresentação)

## Contexto

Cliente: Filinto Sorvetes (sorveteria). Objetivo desta v1: um catálogo digital
simples, estático, para apresentar ao cliente e validar a direção visual antes
de investir em backend/dados reais. Depois de aprovado, a estrutura evolui
(fotos reais, Supabase, mais seções) sem precisar reescrever o front-end.

Referências visuais usadas (estrutura/layout, não cor): prints salvos em
`Referencias pinterest/` — sites de sorveteria com hero, seções por categoria,
cards de produto com preço e CTA.

Marca: logo em `logo filinto.png`. Vermelho extraído do arquivo: `#AC1214`.
Logo em script branco sobre fundo vermelho, ícone de casquinha de sorvete.

## Stack

- Next.js (App Router) + Tailwind CSS
- Hospedagem: Vercel
- Sem backend nesta v1 — produtos em array local tipado, já no formato que o
  Supabase vai usar na Fase 2 (troca o array por uma query, componentes não
  mudam)

## Estrutura da página

Página única (`/`), scroll vertical, mobile-first:

1. **Topo (hero)**: fundo vermelho da marca (`#AC1214`), logo do Filinto,
   slogan curto, botão flutuante/fixo "Adicionar ao pedido" sempre visível
   durante o scroll.
2. **Seções por categoria**: "Sorvetes", "Açaí", "Milkshakes" — lista
   genérica plausível para a apresentação (ajustável depois). Cada seção tem
   título (fonte script) e grade de cards de produto: 2 colunas no celular,
   3–4 no desktop.
3. **Rodapé**: nome, endereço/horário (placeholder "em breve"), ícones
   WhatsApp/Instagram (links placeholder).

## Modelo de dados (`lib/produtos.ts`)

```ts
type Produto = {
  id: string;
  nome: string;
  categoria: "sorvetes" | "acai" | "milkshakes";
  preco: number;
  descricao?: string;
  imagem?: string; // ausente nesta v1 -> usa placeholder
};
```

Array local com ~4–6 produtos por categoria (12–18 produtos no total),
conteúdo genérico de sorveteria (sabores comuns, combos de açaí, milkshakes
clássicos) só para preencher o layout de forma realista.

## Card de produto

- Imagem: placeholder neutro (cinza claro, ícone de sorvete centralizado) —
  sem fotos reais nesta v1
- Nome do produto
- Preço (formatado em R$)
- Sem botão individual — o pedido é feito pelo botão flutuante de WhatsApp,
  único CTA da página
- Número de WhatsApp: `55 67 8131-6194` (Filinto Sorvetes)

## Visual

- Cor primária: `#AC1214` (vermelho Filinto)
- Fundo/contraste: branco / creme claro
- Fonte script: Dancing Script (Google Font) para logo, título do hero e
  nomes de categoria
- Fonte sem serifa limpa para o restante do texto (nome de produto, preço,
  rodapé)
- Mobile-first: prioridade é como fica no celular, já que é o canal principal
  de acesso (Instagram/WhatsApp)

## Fora de escopo (v1)

- Fotos reais dos produtos
- Integração Supabase
- Carrinho ou fluxo de pedido estruturado
- Páginas extras (sobre, contato, galeria)
- Animações elaboradas (GSAP etc., como nas referências) — exceção pontual:
  animação de abertura, ver `2026-10-01-intro-splash-design.md`

## Critério de pronto

Página publicável (local ou preview Vercel) que o Lucca consegue abrir no
celular e mostrar pro cliente: hero com marca, 3 categorias com produtos
placeholder, botão de WhatsApp funcional, visual coerente com a marca
Filinto.
