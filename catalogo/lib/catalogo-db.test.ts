import { describe, it, expect } from "vitest";
import { DEFAULT_CATALOGO, apenasVisiveis } from "./catalogo-store";
import { montarCatalogo, getCatalogoOuPadrao } from "./catalogo-db";

const cats = [
  { id: "b", nome: "B", ordem: 2, oculta: true },
  { id: "a", nome: "A", ordem: 1, oculta: false },
];
const prods = [
  { id: "p2", categoria_id: "b", nome: "P2", imagem_url: null, esgotado: true, ordem: 2 },
  { id: "p1", categoria_id: "a", nome: "P1", imagem_url: "/x.png", esgotado: false, ordem: 1 },
  { id: "p0", categoria_id: "a", nome: "P0", imagem_url: null, esgotado: false, ordem: 0 },
];

describe("montarCatalogo", () => {
  it("ordena categorias e produtos por ordem", () => {
    const s = montarCatalogo(cats, prods);
    expect(s.categorias.map((c) => c.id)).toEqual(["a", "b"]);
    expect(s.produtos.map((p) => p.id)).toEqual(["p0", "p1", "p2"]);
  });
  it("converte imagem_url null em undefined e preserva oculta/esgotado", () => {
    const s = montarCatalogo(cats, prods);
    expect(s.produtos.find((p) => p.id === "p2")).toMatchObject({
      imagem: undefined,
      esgotado: true,
      categoriaId: "b",
    });
    expect(s.categorias.find((c) => c.id === "b")?.oculta).toBe(true);
  });
});

describe("apenasVisiveis", () => {
  it("remove categorias ocultas e seus produtos", () => {
    const s = apenasVisiveis(montarCatalogo(cats, prods));
    expect(s.categorias.map((c) => c.id)).toEqual(["a"]);
    expect(s.produtos.map((p) => p.id)).toEqual(["p0", "p1"]);
  });
});

describe("getCatalogoOuPadrao", () => {
  it("devolve o padrão quando o leitor lança", async () => {
    const s = await getCatalogoOuPadrao(async () => {
      throw new Error("x");
    });
    expect(s).toBe(DEFAULT_CATALOGO);
  });
});
