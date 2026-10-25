"use client";

import { formatPrice } from "@/lib/format";
import { STATUS_LABEL, type Pedido, type StatusPedido } from "@/lib/pedidos-store";

type Props = {
  pedidos: Pedido[];
  atualizarStatus: (id: number, status: StatusPedido) => void;
};

export function AdminPedidos({ pedidos, atualizarStatus }: Props) {
  if (pedidos.length === 0) {
    return (
      <p className="rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-600">
        Nenhum pedido ainda. Os pedidos feitos neste navegador aparecem aqui.
      </p>
    );
  }

  function cancelar(id: number) {
    if (confirm(`Cancelar o pedido #${id}?`)) atualizarStatus(id, "cancelado");
  }

  return (
    <ul className="flex flex-col gap-4">
      {pedidos.map((p) => {
        const sobConsulta = p.total === 0 && p.itens.length > 0;
        const podeCancelar = p.status !== "cancelado" && p.status !== "entregue";
        return (
          <li key={p.id} className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-dancing-script)] text-2xl text-brand">
                Pedido #{p.id}
              </h2>
              <time className="text-sm text-neutral-600" dateTime={p.criadoEm}>
                {new Date(p.criadoEm).toLocaleString("pt-BR")}
              </time>
            </div>
            <p className="mt-1 text-sm text-neutral-800">
              {p.cliente.nome} · {p.cliente.telefone}
            </p>
            <ul className="mt-3 text-sm text-neutral-800">
              {p.itens.map((i) => (
                <li key={i.produtoId}>
                  {i.quantidade}× {i.nome}
                </li>
              ))}
            </ul>
            {p.observacao ? (
              <p className="mt-2 text-sm text-neutral-600">Obs.: {p.observacao}</p>
            ) : null}
            <p className="mt-3 font-medium text-neutral-900">
              Total: {sobConsulta ? "Sob consulta" : formatPrice(p.total)}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor={`status-${p.id}`}>
                Status do pedido #{p.id}
              </label>
              <select
                id={`status-${p.id}`}
                value={p.status}
                onChange={(e) => {
                  const novo = e.target.value as StatusPedido;
                  const fechado = p.status === "cancelado" || p.status === "entregue";
                  const msg =
                    novo === "cancelado" ? `Cancelar o pedido #${p.id}?` : `Reabrir o pedido #${p.id}?`;
                  if ((fechado || novo === "cancelado") && !confirm(msg)) return;
                  atualizarStatus(p.id, novo);
                }}
                className="min-h-11 rounded-lg border border-neutral-300 px-3 text-sm"
              >
                {(Object.keys(STATUS_LABEL) as StatusPedido[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              {podeCancelar ? (
                <button
                  type="button"
                  onClick={() => cancelar(p.id)}
                  className="min-h-11 rounded-lg border border-red-300 px-3 text-sm font-medium text-red-700"
                >
                  Cancelar pedido
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
