# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Lojistas e revendedores (mercados, lanchonetes, sorveterias) que compram sorvete da Filinto em volume e escolhem o que pedir olhando o catálogo no celular ou no computador. Eles querem ver rápido a linha de produtos (potes, caixas, sundaes, picolés, paletas mexicanas, açaí) e fechar o pedido por WhatsApp. Também há cliente final que chega pelo mesmo link.

## Product Purpose

Catálogo digital da Filinto Sorvetes: mostra os produtos por categoria, deixa o dono marcar o que está esgotado e ocultar categorias pelo /admin, e gera um PDF do catálogo. Sucesso é o lojista abrir o cardápio, achar o que procura e pedir pelo WhatsApp.

## Operating Context

Site Next.js hospedado na Vercel; catálogo no Supabase. Acesso principalmente por celular. Pedido por WhatsApp: (67) 8131-6194, link wa.me/556781316194. Nem todos os produtos têm foto real ainda; as fotos são trocadas aos poucos pelo Lucca.

## Capabilities and Constraints

- Hero fica no topo da página inicial (`components/Hero.tsx`), antes do menu de categorias e do cardápio.
- Âncora do cardápio hoje é `#cardapio`.
- Intro/splash de ~2 s com o logo antes da hero aparecer (a manter).
- Sem claims inventados: nada de preço, prazo, avaliação, quantidade de lojas ou tempo de mercado que o cliente não tenha confirmado.

## Brand Commitments

Nome "Filinto Sorvetes"; logo redondo em `public/logo-filinto.png`; frase atual "O sabor que refresca o seu dia"; vermelho da marca #AC1214. A foto real da fachada da loja continua na hero (`public/fachada-desktop.jpg` e `fachada-mobile.jpg`).

## Evidence on Hand

Fotos reais: fachada da loja, potes de 1,8L, paletas mexicanas, picolés especiais. Faltam fotos reais dos demais produtos. Na hero nova, qualquer imagem de produto é ilustração fictícia (SVG) a ser trocada depois pelo Lucca com fotos do cliente.

## Product Principles

- O lojista chega ao cardápio e ao pedido no primeiro gesto.
- O produto real manda: a hero abre espaço para trocar ilustração por foto sem refazer o layout.
- Nada de afirmação comercial que o cliente não confirmou.
- Leve e rápido no celular.
