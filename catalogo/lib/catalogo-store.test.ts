import { describe, it, expect } from "vitest";
import {
  DEFAULT_CATALOGO,
  addCategoria,
  renameCategoria,
  removeCategoria,
  moveCategoria,
  addProduto,
  updateProduto,
  removeProduto,
  moveProduto,
} from "./catalogo-store";

describe("DEFAULT_CATALOGO", () => {
  it("has no duplicate category ids", () => {
    const ids = DEFAULT_CATALOGO.categorias.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate product ids", () => {
    const ids = DEFAULT_CATALOGO.produtos.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only uses category ids declared in categorias", () => {
    const validIds = DEFAULT_CATALOGO.categorias.map((c) => c.id);
    for (const produto of DEFAULT_CATALOGO.produtos) {
      expect(validIds).toContain(produto.categoriaId);
    }
  });
});

describe("addCategoria", () => {
  it("appends a new category with a generated id", () => {
    const state = addCategoria(DEFAULT_CATALOGO, "Bolos");
    const added = state.categorias.at(-1);
    expect(added?.nome).toBe("Bolos");
    expect(added?.id).toBeTruthy();
    expect(state.categorias.length).toBe(DEFAULT_CATALOGO.categorias.length + 1);
  });

  it("does not mutate the original state", () => {
    const before = DEFAULT_CATALOGO.categorias.length;
    addCategoria(DEFAULT_CATALOGO, "Bolos");
    expect(DEFAULT_CATALOGO.categorias.length).toBe(before);
  });
});

describe("renameCategoria", () => {
  it("updates only the matching category name", () => {
    const state = renameCategoria(DEFAULT_CATALOGO, "pote-1-8l", "Pote 1,8L Especial");
    expect(state.categorias.find((c) => c.id === "pote-1-8l")?.nome).toBe(
      "Pote 1,8L Especial"
    );
    expect(state.categorias.find((c) => c.id === "pote-premium-1-8l")?.nome).toBe(
      "Pote Premium 1,8L"
    );
  });
});

describe("removeCategoria", () => {
  it("removes the category and its products", () => {
    const state = removeCategoria(DEFAULT_CATALOGO, "caixa");
    expect(state.categorias.find((c) => c.id === "caixa")).toBeUndefined();
    expect(state.produtos.some((p) => p.categoriaId === "caixa")).toBe(false);
  });

  it("leaves other categories and products untouched", () => {
    const state = removeCategoria(DEFAULT_CATALOGO, "caixa");
    expect(state.categorias.length).toBe(DEFAULT_CATALOGO.categorias.length - 1);
    expect(state.produtos.some((p) => p.categoriaId === "pote-1-8l")).toBe(true);
  });
});

describe("moveCategoria", () => {
  it("swaps a category with the next one when moving down", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "pote-1-8l", "down");
    expect(state.categorias[0].id).toBe("pote-premium-1-8l");
    expect(state.categorias[1].id).toBe("pote-1-8l");
  });

  it("does nothing when moving the first category up", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "pote-1-8l", "up");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });

  it("does nothing when moving the last category down", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "acai", "down");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });
});

describe("addProduto", () => {
  it("appends a new product with a generated id", () => {
    const state = addProduto(DEFAULT_CATALOGO, {
      categoriaId: "pote-1-8l",
      nome: "Pote de Limão 1,8L",
    });
    const added = state.produtos.at(-1);
    expect(added?.nome).toBe("Pote de Limão 1,8L");
    expect(added?.categoriaId).toBe("pote-1-8l");
    expect(added?.id).toBeTruthy();
  });
});

describe("updateProduto", () => {
  it("updates only the matching product", () => {
    const state = updateProduto(DEFAULT_CATALOGO, "pote18-chocolate", { nome: "Novo" });
    expect(state.produtos.find((p) => p.id === "pote18-chocolate")?.nome).toBe("Novo");
    expect(state.produtos.find((p) => p.id === "pote18-morango")?.nome).toBe("Pote de Morango 1,8L");
  });
});

describe("removeProduto", () => {
  it("removes only the matching product", () => {
    const state = removeProduto(DEFAULT_CATALOGO, "pote18-chocolate");
    expect(state.produtos.find((p) => p.id === "pote18-chocolate")).toBeUndefined();
    expect(state.produtos.length).toBe(DEFAULT_CATALOGO.produtos.length - 1);
  });
});

describe("moveProduto", () => {
  it("swaps a product with the next one in the same category", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "pote18-abacaxi", "down");
    const pote18 = state.produtos.filter((p) => p.categoriaId === "pote-1-8l");
    expect(pote18[0].id).toBe("pote18-morango");
    expect(pote18[1].id).toBe("pote18-abacaxi");
  });

  it("does not affect products in other categories", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "pote18-abacaxi", "down");
    const premium = state.produtos.filter((p) => p.categoriaId === "pote-premium-1-8l");
    expect(premium.map((p) => p.id)).toEqual(
      DEFAULT_CATALOGO.produtos
        .filter((p) => p.categoriaId === "pote-premium-1-8l")
        .map((p) => p.id)
    );
  });

  it("does nothing when moving the first product of a category up", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "pote18-abacaxi", "up");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });
});
