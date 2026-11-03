import { createPublicClient } from "./supabase";
import { DEFAULT_CATALOGO, type CatalogoState } from "./catalogo-store";

export type CategoriaRow = { id: string; nome: string; ordem: number; oculta: boolean };
export type ProdutoRow = {
  id: string;
  categoria_id: string;
  nome: string;
  imagem_url: string | null;
  esgotado: boolean;
  ordem: number;
};

export function montarCatalogo(categorias: CategoriaRow[], produtos: ProdutoRow[]): CatalogoState {
  const porOrdem = <T extends { ordem: number }>(a: T, b: T) => a.ordem - b.ordem;
  return {
    categorias: [...categorias].sort(porOrdem).map((c) => ({ id: c.id, nome: c.nome, oculta: c.oculta })),
    produtos: [...produtos].sort(porOrdem).map((p) => ({
      id: p.id,
      categoriaId: p.categoria_id,
      nome: p.nome,
      imagem: p.imagem_url ?? undefined,
      esgotado: p.esgotado,
    })),
  };
}

export async function getCatalogo(): Promise<CatalogoState> {
  const db = createPublicClient();
  const [cats, prods] = await Promise.all([
    db.from("categorias").select("id, nome, ordem, oculta"),
    db.from("produtos").select("id, categoria_id, nome, imagem_url, esgotado, ordem"),
  ]);
  if (cats.error) throw cats.error;
  if (prods.error) throw prods.error;
  return montarCatalogo(cats.data as CategoriaRow[], prods.data as ProdutoRow[]);
}

export async function getCatalogoOuPadrao(
  ler: () => Promise<CatalogoState> = getCatalogo
): Promise<CatalogoState> {
  try {
    const state = await ler();
    return state.categorias.length ? state : DEFAULT_CATALOGO;
  } catch {
    return DEFAULT_CATALOGO;
  }
}

export function apenasVisiveis(state: CatalogoState): CatalogoState {
  const categorias = state.categorias.filter((c) => !c.oculta);
  const ids = new Set(categorias.map((c) => c.id));
  return { categorias, produtos: state.produtos.filter((p) => ids.has(p.categoriaId)) };
}
