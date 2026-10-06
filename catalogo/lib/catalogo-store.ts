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
