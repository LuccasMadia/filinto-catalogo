"use client";

import { useEffect, useState } from "react";
import {
  CatalogoState,
  DEFAULT_CATALOGO,
  NovoProduto,
  addCategoria as addCategoriaPura,
  renameCategoria as renameCategoriaPura,
  removeCategoria as removeCategoriaPura,
  moveCategoria as moveCategoriaPura,
  addProduto as addProdutoPura,
  updateProduto as updateProdutoPura,
  removeProduto as removeProdutoPura,
  moveProduto as moveProdutoPura,
} from "./catalogo-store";

const STORAGE_KEY = "filinto-catalogo-v3";

export function useCatalogStore() {
  const [state, setState] = useState<CatalogoState>(DEFAULT_CATALOGO);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      setState(JSON.parse(saved) as CatalogoState);
    } catch {
      // storage corrompido: mantém os defaults já carregados
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // cota cheia (fotos grandes): a edição vale só até recarregar
    }
  }, [state]);

  return {
    categorias: state.categorias,
    produtos: state.produtos,
    addCategoria: (nome: string) => setState((s) => addCategoriaPura(s, nome)),
    renameCategoria: (id: string, nome: string) =>
      setState((s) => renameCategoriaPura(s, id, nome)),
    removeCategoria: (id: string) => setState((s) => removeCategoriaPura(s, id)),
    moveCategoria: (id: string, direction: "up" | "down") =>
      setState((s) => moveCategoriaPura(s, id, direction)),
    addProduto: (novo: NovoProduto) => setState((s) => addProdutoPura(s, novo)),
    updateProduto: (id: string, changes: Partial<NovoProduto>) =>
      setState((s) => updateProdutoPura(s, id, changes)),
    removeProduto: (id: string) => setState((s) => removeProdutoPura(s, id)),
    moveProduto: (id: string, direction: "up" | "down") =>
      setState((s) => moveProdutoPura(s, id, direction)),
  };
}

export type CatalogStore = ReturnType<typeof useCatalogStore>;
