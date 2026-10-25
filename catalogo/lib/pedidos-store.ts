export type StatusPedido = "novo" | "em_preparo" | "pronto" | "entregue" | "cancelado";

export const STATUS_LABEL: Record<StatusPedido, string> = {
  novo: "Novo",
  em_preparo: "Em preparo",
  pronto: "Pronto",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export type ItemCarrinho = { produtoId: string; nome: string; preco: number; quantidade: number };
export type Cliente = { nome: string; telefone: string };
export type Pedido = {
  id: number;
  cliente: Cliente;
  observacao?: string;
  itens: ItemCarrinho[];
  total: number;
  status: StatusPedido;
  criadoEm: string;
};

const MAX_QTD = 99;
const ID_INICIAL = 1001;

export function addItem(
  itens: ItemCarrinho[],
  produto: { id: string; nome: string; preco: number },
): ItemCarrinho[] {
  if (itens.some((i) => i.produtoId === produto.id)) {
    return itens.map((i) =>
      i.produtoId === produto.id ? { ...i, quantidade: Math.min(MAX_QTD, i.quantidade + 1) } : i,
    );
  }
  return [...itens, { produtoId: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 }];
}

export function setQuantidade(itens: ItemCarrinho[], produtoId: string, quantidade: number): ItemCarrinho[] {
  if (quantidade <= 0) return itens.filter((i) => i.produtoId !== produtoId);
  const q = Math.min(MAX_QTD, quantidade);
  return itens.map((i) => (i.produtoId === produtoId ? { ...i, quantidade: q } : i));
}

export function totalCarrinho(itens: ItemCarrinho[]): number {
  return itens.reduce((s, i) => s + (i.preco > 0 ? i.preco * i.quantidade : 0), 0);
}

export function quantidadeTotal(itens: ItemCarrinho[]): number {
  return itens.reduce((s, i) => s + i.quantidade, 0);
}

export function temSoConsulta(itens: ItemCarrinho[]): boolean {
  return itens.length > 0 && itens.every((i) => i.preco === 0);
}

export function validarCliente(
  c: Cliente,
): { ok: true; cliente: Cliente } | { ok: false; erros: { nome?: string; telefone?: string } } {
  const nome = c.nome.trim();
  const telefone = c.telefone.replace(/\D/g, "");
  const erros: { nome?: string; telefone?: string } = {};
  if (!nome) erros.nome = "Informe seu nome";
  if (telefone.length < 10 || telefone.length > 11) erros.telefone = "Informe um telefone com DDD";
  if (erros.nome || erros.telefone) return { ok: false, erros };
  return { ok: true, cliente: { nome, telefone } };
}

export function criarPedido(
  pedidos: Pedido[],
  itens: ItemCarrinho[],
  cliente: Cliente,
  observacao: string | undefined,
  agora: Date,
): { pedidos: Pedido[]; pedido: Pedido } {
  if (itens.length === 0) throw new Error("Carrinho vazio");
  const id = pedidos.length ? Math.max(...pedidos.map((p) => p.id)) + 1 : ID_INICIAL;
  const pedido: Pedido = {
    id,
    cliente,
    observacao,
    itens,
    total: totalCarrinho(itens),
    status: "novo",
    criadoEm: agora.toISOString(),
  };
  return { pedidos: [pedido, ...pedidos], pedido };
}

export function atualizarStatus(pedidos: Pedido[], id: number, status: StatusPedido): Pedido[] {
  return pedidos.map((p) => (p.id === id ? { ...p, status } : p));
}
