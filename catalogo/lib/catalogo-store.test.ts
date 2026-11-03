import { describe, it, expect } from "vitest";
import { DEFAULT_CATALOGO } from "./catalogo-store";

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
