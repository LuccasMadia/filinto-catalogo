import { describe, it, expect } from "vitest";
import {
  addItem,
  setQuantidade,
  totalCarrinho,
  quantidadeTotal,
  temSoConsulta,
  validarCliente,
  criarPedido,
  atualizarStatus,
  type ItemCarrinho,
  type Pedido,
} from "./pedidos-store";

const item = (produtoId: string, preco: number, quantidade: number): ItemCarrinho => ({
  produtoId,
  nome: produtoId,
  preco,
  quantidade,
});
const cliente = { nome: "Ana", telefone: "67981316194" };
const agora = new Date("2026-10-25T12:00:00Z");
const pedidoComId = (id: number): Pedido => ({
  id,
  cliente,
  itens: [item("a", 10, 1)],
  total: 10,
  status: "novo",
  criadoEm: agora.toISOString(),
});

describe("carrinho", () => {
  it("addItem soma quantidade do mesmo produto e respeita teto 99", () => {
    const p = { id: "a", nome: "A", preco: 10 };
    const um = addItem([], p);
    expect(um).toEqual([{ produtoId: "a", nome: "A", preco: 10, quantidade: 1 }]);
    expect(addItem(um, p)[0].quantidade).toBe(2);
    expect(addItem([item("a", 10, 99)], p)[0].quantidade).toBe(99);
  });

  it("setQuantidade remove em <=0 e limita a 99", () => {
    expect(setQuantidade([item("a", 10, 2)], "a", 0)).toEqual([]);
    expect(setQuantidade([item("a", 10, 2)], "a", 500)[0].quantidade).toBe(99);
    expect(setQuantidade([item("a", 10, 2)], "a", 5)[0].quantidade).toBe(5);
  });

  it("totais ignoram preço 0", () => {
    const itens = [item("a", 45, 2), item("b", 0, 3)];
    expect(totalCarrinho(itens)).toBe(90);
    expect(quantidadeTotal(itens)).toBe(5);
  });

  it("temSoConsulta só com itens e todos de preço 0", () => {
    expect(temSoConsulta([])).toBe(false);
    expect(temSoConsulta([item("b", 0, 1)])).toBe(true);
    expect(temSoConsulta([item("a", 5, 1), item("b", 0, 1)])).toBe(false);
  });
});

describe("validarCliente", () => {
  it("erra nome e telefone inválidos", () => {
    const r = validarCliente({ nome: " ", telefone: "123" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.erros.nome).toBeTruthy();
      expect(r.erros.telefone).toBeTruthy();
    }
  });

  it("normaliza telefone para dígitos", () => {
    const r = validarCliente({ nome: "Ana", telefone: "(67) 98131-6194" });
    expect(r).toEqual({ ok: true, cliente: { nome: "Ana", telefone: "67981316194" } });
  });
});

describe("pedidos", () => {
  it("criarPedido gera ids 1001 e max+1, no início, status novo", () => {
    const r = criarPedido([], [item("a", 10, 2)], cliente, undefined, agora);
    expect(r.pedido.id).toBe(1001);
    expect(r.pedido.total).toBe(20);
    expect(r.pedido.status).toBe("novo");
    expect(r.pedido.criadoEm).toBe(agora.toISOString());
    const r2 = criarPedido([pedidoComId(1001), pedidoComId(1005)], [item("a", 1, 1)], cliente, "obs", agora);
    expect(r2.pedido.id).toBe(1006);
    expect(r2.pedidos[0]).toBe(r2.pedido);
    expect(r2.pedidos).toHaveLength(3);
  });

  it("criarPedido recusa itens vazios", () => {
    expect(() => criarPedido([], [], cliente, undefined, agora)).toThrow(Error);
  });

  it("atualizarStatus muda só o pedido do id", () => {
    const r = atualizarStatus([pedidoComId(1001), pedidoComId(1002)], 1002, "pronto");
    expect(r[0].status).toBe("novo");
    expect(r[1].status).toBe("pronto");
  });
});
