import { describe, it, expect } from "vitest";
import { produtos, CATEGORIAS } from "./produtos";

describe("produtos", () => {
  it("has no duplicate ids", () => {
    const ids = produtos.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least 4 products in every declared category", () => {
    for (const categoria of CATEGORIAS) {
      const count = produtos.filter((p) => p.categoria === categoria.id).length;
      expect(count).toBeGreaterThanOrEqual(4);
    }
  });

  it("has a positive price for every product", () => {
    for (const produto of produtos) {
      expect(produto.preco).toBeGreaterThan(0);
    }
  });

  it("only uses categories declared in CATEGORIAS", () => {
    const validIds = CATEGORIAS.map((c) => c.id);
    for (const produto of produtos) {
      expect(validIds).toContain(produto.categoria);
    }
  });
});
