export type Categoria = "sorvetes" | "acai" | "milkshakes";

export type Produto = {
  id: string;
  nome: string;
  categoria: Categoria;
  preco: number;
  descricao?: string;
  imagem?: string;
};

export const CATEGORIAS: { id: Categoria; titulo: string }[] = [
  { id: "sorvetes", titulo: "Sorvetes" },
  { id: "acai", titulo: "Açaí" },
  { id: "milkshakes", titulo: "Milkshakes" },
];

export const produtos: Produto[] = [
  { id: "sorv-chocolate", nome: "Casquinha de Chocolate", categoria: "sorvetes", preco: 8 },
  { id: "sorv-morango", nome: "Casquinha de Morango", categoria: "sorvetes", preco: 8 },
  { id: "sorv-creme", nome: "Casquinha de Creme", categoria: "sorvetes", preco: 8 },
  { id: "sorv-flocos", nome: "Casquinha de Flocos", categoria: "sorvetes", preco: 8 },
  { id: "sorv-napolitano", nome: "Pote Napolitano 500ml", categoria: "sorvetes", preco: 22 },

  { id: "acai-300", nome: "Açaí 300ml", categoria: "acai", preco: 14, descricao: "Com granola e banana" },
  { id: "acai-500", nome: "Açaí 500ml", categoria: "acai", preco: 19, descricao: "Com granola e banana" },
  { id: "acai-700", nome: "Açaí 700ml", categoria: "acai", preco: 24, descricao: "Com granola e banana" },
  { id: "acai-combo", nome: "Combo Açaí + Leite em pó", categoria: "acai", preco: 21 },

  { id: "milk-chocolate", nome: "Milkshake de Chocolate", categoria: "milkshakes", preco: 16 },
  { id: "milk-morango", nome: "Milkshake de Morango", categoria: "milkshakes", preco: 16 },
  { id: "milk-ovomaltine", nome: "Milkshake de Ovomaltine", categoria: "milkshakes", preco: 18 },
  { id: "milk-baunilha", nome: "Milkshake de Baunilha", categoria: "milkshakes", preco: 15 },
];
