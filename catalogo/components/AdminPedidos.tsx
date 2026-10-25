"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import {
  STATUS_LABEL,
  listaProducao,
  type Pedido,
  type StatusPedido,
} from "@/lib/pedidos-store";

type Props = {
  pedidos: Pedido[];
  atualizarStatus: (id: number, status: StatusPedido) => void;
};

export function AdminPedidos({ pedidos, atualizarStatus }: Props) {
  const [gerando, setGerando] = useState(false);
  const [erroLista, setErroLista] = useState(false);

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

  const producao = listaProducao(pedidos);

  async function gerarListaProducao() {
    setGerando(true);
    setErroLista(false);
    try {
      const { buildProducaoPdfBlob } = await import("@/lib/pdf/producao-pdf");
      const url = URL.createObjectURL(await buildProducaoPdfBlob(producao));
      const link = document.createElement("a");
      link.href = url;
      link.download = `lista-producao-${new Date().toISOString().slice(0, 10)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setErroLista(true);
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 p-4">
        <button
          type="button"
          onClick={gerarListaProducao}
          disabled={gerando || producao.length === 0}
          className="min-h-11 rounded-lg bg-brand px-4 text-sm font-medium text-white disabled:opacity-50"
        >
          {gerando ? "Gerando..." : "Lista de produção (PDF)"}
        </button>
        <p className="text-sm text-neutral-600">
          {producao.length === 0
            ? "Nada a produzir: não há pedidos novos ou em preparo."
            : "Soma as quantidades dos pedidos novos e em preparo."}
        </p>
        {erroLista ? (
          <p role="alert" className="w-full text-sm text-red-700">
            Não foi possível gerar a lista. Tente novamente.
          </p>
        ) : null}
      </div>
      <ul className="flex flex-col gap-4">
        {pedidos.map((p) => {
          const sobConsulta = p.total === 0 && p.itens.length > 0;
          const podeCancelar =
            p.status !== "cancelado" && p.status !== "entregue";
          return (
            <li
              key={p.id}
              className="rounded-2xl border border-neutral-200 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-[family-name:var(--font-dancing-script)] text-2xl text-brand">
                  Pedido #{p.id}
                </h2>
                <time
                  className="text-sm text-neutral-600"
                  dateTime={p.criadoEm}
                >
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
                <p className="mt-2 text-sm text-neutral-600">
                  Obs.: {p.observacao}
                </p>
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
                    const fechado =
                      p.status === "cancelado" || p.status === "entregue";
                    const msg =
                      novo === "cancelado"
                        ? `Cancelar o pedido #${p.id}?`
                        : `Reabrir o pedido #${p.id}?`;
                    if ((fechado || novo === "cancelado") && !confirm(msg))
                      return;
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
    </div>
  );
}
