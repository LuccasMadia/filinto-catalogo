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

  it("has a positive price for every product", () => {
    for (const produto of DEFAULT_CATALOGO.produtos) {
      expect(produto.preco).toBeGreaterThan(0);
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
    const state = renameCategoria(DEFAULT_CATALOGO, "sorvetes", "Sorvetes Especiais");
    expect(state.categorias.find((c) => c.id === "sorvetes")?.nome).toBe(
      "Sorvetes Especiais"
    );
    expect(state.categorias.find((c) => c.id === "acai")?.nome).toBe("Açaí");
  });
});

describe("removeCategoria", () => {
  it("removes the category and its products", () => {
    const state = removeCategoria(DEFAULT_CATALOGO, "milkshakes");
    expect(state.categorias.find((c) => c.id === "milkshakes")).toBeUndefined();
    expect(state.produtos.some((p) => p.categoriaId === "milkshakes")).toBe(false);
  });

  it("leaves other categories and products untouched", () => {
    const state = removeCategoria(DEFAULT_CATALOGO, "milkshakes");
    expect(state.categorias.length).toBe(DEFAULT_CATALOGO.categorias.length - 1);
    expect(state.produtos.some((p) => p.categoriaId === "sorvetes")).toBe(true);
  });
});

describe("moveCategoria", () => {
  it("swaps a category with the next one when moving down", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "sorvetes", "down");
    expect(state.categorias[0].id).toBe("acai");
    expect(state.categorias[1].id).toBe("sorvetes");
  });

  it("does nothing when moving the first category up", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "sorvetes", "up");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });

  it("does nothing when moving the last category down", () => {
    const state = moveCategoria(DEFAULT_CATALOGO, "milkshakes", "down");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });
});

describe("addProduto", () => {
  it("appends a new product with a generated id", () => {
    const state = addProduto(DEFAULT_CATALOGO, {
      categoriaId: "sorvetes",
      nome: "Casquinha de Limão",
      preco: 9,
    });
    const added = state.produtos.at(-1);
    expect(added?.nome).toBe("Casquinha de Limão");
    expect(added?.categoriaId).toBe("sorvetes");
    expect(added?.id).toBeTruthy();
  });
});

describe("updateProduto", () => {
  it("updates only the matching product", () => {
    const state = updateProduto(DEFAULT_CATALOGO, "sorv-chocolate", { preco: 10 });
    expect(state.produtos.find((p) => p.id === "sorv-chocolate")?.preco).toBe(10);
    expect(state.produtos.find((p) => p.id === "sorv-morango")?.preco).toBe(8);
  });
});

describe("removeProduto", () => {
  it("removes only the matching product", () => {
    const state = removeProduto(DEFAULT_CATALOGO, "sorv-chocolate");
    expect(state.produtos.find((p) => p.id === "sorv-chocolate")).toBeUndefined();
    expect(state.produtos.length).toBe(DEFAULT_CATALOGO.produtos.length - 1);
  });
});

describe("moveProduto", () => {
  it("swaps a product with the next one in the same category", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "sorv-chocolate", "down");
    const sorvetes = state.produtos.filter((p) => p.categoriaId === "sorvetes");
    expect(sorvetes[0].id).toBe("sorv-morango");
    expect(sorvetes[1].id).toBe("sorv-chocolate");
  });

  it("does not affect products in other categories", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "sorv-chocolate", "down");
    const acai = state.produtos.filter((p) => p.categoriaId === "acai");
    expect(acai.map((p) => p.id)).toEqual(
      DEFAULT_CATALOGO.produtos.filter((p) => p.categoriaId === "acai").map((p) => p.id)
    );
  });

  it("does nothing when moving the first product of a category up", () => {
    const state = moveProduto(DEFAULT_CATALOGO, "sorv-chocolate", "up");
    expect(state).toEqual(DEFAULT_CATALOGO);
  });
});
