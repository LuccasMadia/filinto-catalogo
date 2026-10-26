export type Categoria = {
  id: string;
  nome: string;
};

export type Produto = {
  id: string;
  categoriaId: string;
  nome: string;
  imagem?: string;
  esgotado?: boolean;
};

export type NovoProduto = {
  categoriaId: string;
  nome: string;
  imagem?: string;
  esgotado?: boolean;
};

export type CatalogoState = {
  categorias: Categoria[];
  produtos: Produto[];
};

// Enquanto não há foto de cada sabor, todos usam o pote genérico (public/produtos/pote.png).
const IMAGEM_PADRAO = "/produtos/pote.png";

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
    { id: "pote18-abacaxi", categoriaId: "pote-1-8l", nome: "Pote de Abacaxi 1,8L", imagem: "/produtos/pote18-abacaxi.jpg", esgotado: true },
    { id: "pote18-morango", categoriaId: "pote-1-8l", nome: "Pote de Morango 1,8L", imagem: "/produtos/pote18-napolitano.jpg", esgotado: true },
    { id: "pote18-creme", categoriaId: "pote-1-8l", nome: "Pote de Creme 1,8L", imagem: "/produtos/pote18-flocos.jpg" },
    { id: "pote18-flocos", categoriaId: "pote-1-8l", nome: "Pote de Flocos 1,8L", imagem: "/produtos/pote18-flocos.jpg" },
    { id: "pote18-milho", categoriaId: "pote-1-8l", nome: "Pote de Milho 1,8L", imagem: "/produtos/pote18-abacaxi.jpg" },
    { id: "pote18-chocomenta", categoriaId: "pote-1-8l", nome: "Pote de Chocomenta 1,8L", imagem: "/produtos/pote18-flocos.jpg" },
    { id: "pote18-napolitano", categoriaId: "pote-1-8l", nome: "Pote Napolitano 1,8L", imagem: "/produtos/pote18-napolitano.jpg" },
    { id: "pote18-coco-branco", categoriaId: "pote-1-8l", nome: "Pote de Coco Branco 1,8L", imagem: "/produtos/pote18-flocos.jpg" },
    { id: "pote18-chocolate", categoriaId: "pote-1-8l", nome: "Pote de Chocolate 1,8L", imagem: "/produtos/pote18-napolitano.jpg" },
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
    {
      id: "paleta-morango",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Morango",
    },
    {
      id: "paleta-manga",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Manga",
    },
    {
      id: "paleta-abacaxi-hortela",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Abacaxi com Hortelã",
    },
    {
      id: "paleta-melancia",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Melancia",
    },
    {
      id: "paleta-coco",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Coco",
    },
    {
      id: "paleta-maracuja",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Maracujá",
    },
    {
      id: "paleta-limao",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Limão",
    },
    {
      id: "paleta-morango-chocolate",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Morango com Chocolate",
    },
    {
      id: "paleta-uva",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Uva",
    },
    {
      id: "paleta-caju",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Caju",
    },
    {
      id: "paleta-manga-pimenta",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Manga com Pimenta",
    },
    {
      id: "paleta-framboesa",
      categoriaId: "paleta-mexicana",
      nome: "Paleta Mexicana de Framboesa",
    },
    { id: "acai-pote-1l", categoriaId: "acai", nome: "Açaí Pote 1L", imagem: "/produtos/acai.jpg" },
    { id: "acai-caixa-10l", categoriaId: "acai", nome: "Açaí Caixa 10L", imagem: "/produtos/acai.jpg" },
  ],
};

export const DEFAULT_CATALOGO: CatalogoState = {
  ...CATALOGO_BASE,
  produtos: CATALOGO_BASE.produtos.map((p) => ({ ...p, imagem: IMAGEM_PADRAO })),
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
