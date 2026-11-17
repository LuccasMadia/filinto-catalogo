export type Categoria = {
  id: string;
  nome: string;
  oculta?: boolean;
};

export type Produto = {
  id: string;
  categoriaId: string;
  nome: string;
  imagem?: string;
  esgotado?: boolean;
};

export type CatalogoState = {
  categorias: Categoria[];
  produtos: Produto[];
};

const CATALOGO_BASE: CatalogoState = {
  categorias: [
    { id: "pote-1-8l", nome: "Pote 1,8L" },
    { id: "pote-premium-1-8l", nome: "Pote Premium 1,8L" },
    { id: "caixa", nome: "Caixa" },
    { id: "sundaes", nome: "Sundaes" },
    { id: "picoles", nome: "Picolés" },
    { id: "picoles-especiais", nome: "Picolés Especiais" },
    { id: "paleta-mexicana", nome: "Paleta Mexicana" },
    { id: "acai", nome: "Açaí" },
  ],
  produtos: [
    { id: "pote18-abacaxi", categoriaId: "pote-1-8l", nome: "Abacaxi 1,8L", imagem: "/produtos/pote18-abacaxi.webp" },
    { id: "pote18-morango", categoriaId: "pote-1-8l", nome: "Morango 1,8L", imagem: "/produtos/pote18-morango.webp" },
    { id: "pote18-creme", categoriaId: "pote-1-8l", nome: "Creme 1,8L", imagem: "/produtos/pote18-creme.webp" },
    { id: "pote18-flocos", categoriaId: "pote-1-8l", nome: "Flocos 1,8L", imagem: "/produtos/pote18-flocos.webp" },
    { id: "pote18-milho", categoriaId: "pote-1-8l", nome: "Milho Verde 1,8L", imagem: "/produtos/pote18-milho-verde.webp" },
    { id: "pote18-chocomenta", categoriaId: "pote-1-8l", nome: "Chocomenta 1,8L", imagem: "/produtos/pote18-chocomenta.webp" },
    { id: "pote18-napolitano", categoriaId: "pote-1-8l", nome: "Napolitano 1,8L", imagem: "/produtos/pote18-napolitano.webp" },
    { id: "pote18-coco-branco", categoriaId: "pote-1-8l", nome: "Coco Branco 1,8L", imagem: "/produtos/pote18-coco-branco.webp" },
    { id: "pote18-chocolate", categoriaId: "pote-1-8l", nome: "Chocolate 1,8L", imagem: "/produtos/pote18-chocolate-2l.webp" },
    { id: "potepremium18-ninho-morango", categoriaId: "pote-premium-1-8l", nome: "Pote Premium Ninho com Morango 1,8L" },
    { id: "potepremium18-ninho-trufado", categoriaId: "pote-premium-1-8l", nome: "Pote Premium Ninho Trufado 1,8L" },
    { id: "potepremium18-leitinho-especial", categoriaId: "pote-premium-1-8l", nome: "Pote Premium Leitinho Especial 1,8L" },
    { id: "potepremium18-rafaello", categoriaId: "pote-premium-1-8l", nome: "Pote Premium Rafaello 1,8L" },
    { id: "potepremium18-crocante", categoriaId: "pote-premium-1-8l", nome: "Pote Premium Crocante 1,8L" },
    { id: "potepremium18-iogurte-amarena", categoriaId: "pote-premium-1-8l", nome: "Pote Premium Iogurte com Amarena 1,8L" },
    { id: "potepremium18-iogurte-maracuja", categoriaId: "pote-premium-1-8l", nome: "Pote Premium Iogurte com Maracujá 1,8L" },
    { id: "caixa-chocolate-5l", categoriaId: "caixa", nome: "Caixa de Chocolate 5L" },
    { id: "caixa-morango-5l", categoriaId: "caixa", nome: "Caixa de Morango 5L" },
    { id: "caixa-creme-5l", categoriaId: "caixa", nome: "Caixa de Creme 5L" },
    { id: "caixa-napolitano-5l", categoriaId: "caixa", nome: "Caixa Napolitano 5L" },
    { id: "caixa-flocos-5l", categoriaId: "caixa", nome: "Caixa de Flocos 5L" },
    {
      id: "caixa-doce-de-leite-5l",
      categoriaId: "caixa",
      nome: "Caixa de Doce de Leite 5L",
    },
    { id: "caixa-coco-5l", categoriaId: "caixa", nome: "Caixa de Coco 5L" },
    { id: "caixa-ovomaltine-5l", categoriaId: "caixa", nome: "Caixa de Ovomaltine 5L" },
    { id: "caixa-uva-5l", categoriaId: "caixa", nome: "Caixa de Uva 5L" },
    { id: "caixa-maracuja-5l", categoriaId: "caixa", nome: "Caixa de Maracujá 5L" },
    { id: "caixa-limao-5l", categoriaId: "caixa", nome: "Caixa de Limão 5L" },
    { id: "caixa-abacaxi-5l", categoriaId: "caixa", nome: "Caixa de Abacaxi 5L" },
    { id: "sundae-chocolate", categoriaId: "sundaes", nome: "Sundae de Chocolate" },
    { id: "sundae-morango", categoriaId: "sundaes", nome: "Sundae de Morango" },
    { id: "sundae-caramelo", categoriaId: "sundaes", nome: "Sundae de Caramelo" },
    { id: "sundae-doce-de-leite", categoriaId: "sundaes", nome: "Sundae de Doce de Leite" },
    { id: "sundae-oreo", categoriaId: "sundaes", nome: "Sundae Oreo" },
    { id: "sundae-nutella", categoriaId: "sundaes", nome: "Sundae de Nutella" },
    { id: "sundae-banana-split", categoriaId: "sundaes", nome: "Sundae Banana Split" },
    { id: "sundae-pacoca", categoriaId: "sundaes", nome: "Sundae de Paçoca" },
    { id: "sundae-morango-chocolate", categoriaId: "sundaes", nome: "Sundae de Morango com Chocolate" },
    { id: "sundae-churros", categoriaId: "sundaes", nome: "Sundae de Churros" },
    { id: "sundae-amendoim", categoriaId: "sundaes", nome: "Sundae de Amendoim" },
    { id: "sundae-red-velvet", categoriaId: "sundaes", nome: "Sundae Red Velvet" },
    { id: "picole-morango", categoriaId: "picoles", nome: "Picolé de Morango" },
    { id: "picole-limao", categoriaId: "picoles", nome: "Picolé de Limão" },
    { id: "picole-uva", categoriaId: "picoles", nome: "Picolé de Uva" },
    { id: "picole-abacaxi", categoriaId: "picoles", nome: "Picolé de Abacaxi" },
    { id: "picole-coco", categoriaId: "picoles", nome: "Picolé de Coco" },
    { id: "picole-manga", categoriaId: "picoles", nome: "Picolé de Manga" },
    { id: "picole-maracuja", categoriaId: "picoles", nome: "Picolé de Maracujá" },
    { id: "picole-chocolate", categoriaId: "picoles", nome: "Picolé de Chocolate" },
    { id: "picole-melancia", categoriaId: "picoles", nome: "Picolé de Melancia" },
    { id: "picole-framboesa", categoriaId: "picoles", nome: "Picolé de Framboesa" },
    { id: "picole-caju", categoriaId: "picoles", nome: "Picolé de Caju" },
    { id: "picole-tangerina", categoriaId: "picoles", nome: "Picolé de Tangerina" },
    {
      id: "picole-especial-ninho-nutella",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Ninho com Nutella",
    },
    {
      id: "picole-especial-brigadeiro",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Brigadeiro",
    },
    {
      id: "picole-especial-prestigio",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Prestígio",
    },
    {
      id: "picole-especial-churros",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Churros",
    },
    {
      id: "picole-especial-pacoca",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Paçoca",
    },
    {
      id: "picole-especial-cookies",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial Cookies and Cream",
    },
    {
      id: "picole-especial-maracuja-chocolate",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Maracujá com Chocolate",
    },
    {
      id: "picole-especial-pistache",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Pistache",
    },
    {
      id: "picole-especial-doce-leite-castanha",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Doce de Leite com Castanha",
    },
    {
      id: "picole-especial-morango-chocolate-belga",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Morango com Chocolate Belga",
    },
    {
      id: "picole-especial-cafe-chocolate",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Café com Chocolate",
    },
    {
      id: "picole-especial-maracuja-granola",
      categoriaId: "picoles-especiais",
      nome: "Picolé Especial de Maracujá com Granola",
    },
    { id: "paleta-banana-avela", categoriaId: "paleta-mexicana", nome: "Banana com Creme de Avelã", imagem: "/produtos/paleta-banana-avela.webp" },
    { id: "paleta-maracuja-avela", categoriaId: "paleta-mexicana", nome: "Maracujá com Avelã", imagem: "/produtos/paleta-maracuja-avela.webp" },
    { id: "paleta-ninho-leitinho", categoriaId: "paleta-mexicana", nome: "Ninho com Leitinho", imagem: "/produtos/paleta-ninho-leitinho.webp" },
    { id: "paleta-ninho-trufado", categoriaId: "paleta-mexicana", nome: "Ninho Trufado", imagem: "/produtos/paleta-ninho-trufado.webp" },
    { id: "paleta-bombom", categoriaId: "paleta-mexicana", nome: "Bombom", imagem: "/produtos/paleta-bombom.webp" },
    { id: "paleta-petit-gateau", categoriaId: "paleta-mexicana", nome: "Petit Gateau", imagem: "/produtos/paleta-petit-gateau.webp" },
    { id: "paleta-morango-coco", categoriaId: "paleta-mexicana", nome: "Morango com Coco", imagem: "/produtos/paleta-morango-coco.webp" },
    { id: "paleta-delirio", categoriaId: "paleta-mexicana", nome: "Delírio", imagem: "/produtos/paleta-delirio.webp" },
    { id: "paleta-gianduia", categoriaId: "paleta-mexicana", nome: "Gianduia", imagem: "/produtos/paleta-gianduia.webp" },
    { id: "paleta-iogurte-amarena", categoriaId: "paleta-mexicana", nome: "Iogurte com Amarena", imagem: "/produtos/paleta-iogurte-amarena.webp" },
    { id: "acai-pote-1l", categoriaId: "acai", nome: "Açaí Pote 1L" },
    { id: "acai-caixa-10l", categoriaId: "acai", nome: "Açaí Caixa 10L" },
  ],
};

export const DEFAULT_CATALOGO: CatalogoState = CATALOGO_BASE;

export function apenasVisiveis(state: CatalogoState): CatalogoState {
  const categorias = state.categorias.filter((c) => !c.oculta);
  const ids = new Set(categorias.map((c) => c.id));
  return { categorias, produtos: state.produtos.filter((p) => ids.has(p.categoriaId)) };
}
