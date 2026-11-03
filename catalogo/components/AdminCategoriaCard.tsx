"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { Categoria, Produto } from "@/lib/catalogo-store";
import { setCategoriaOculta, setProdutoEsgotado } from "@/lib/catalogo-actions";
import { AdminProdutoModal } from "./AdminProdutoModal";

type AdminCategoriaCardProps = {
  categoria: Categoria;
  produtos: Produto[];
};

export function AdminCategoriaCard({ categoria, produtos }: AdminCategoriaCardProps) {
  const [editando, setEditando] = useState<Produto | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Uma única transição por card: desabilita todos os botões enquanto grava.
  function executar(acao: () => Promise<{ error?: string }>) {
    setErro(null);
    startTransition(async () => {
      try {
        const res = await acao();
        if (res.error) setErro(res.error);
      } catch {
        setErro("Não foi possível salvar. Recarregue a página e entre de novo.");
      }
    });
  }

  return (
    <section className="rounded-2xl border border-neutral-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-[family-name:var(--font-dancing-script)] text-2xl text-brand">
          {categoria.nome}
          {categoria.oculta ? (
            <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 align-middle font-sans text-xs text-neutral-600">
              Oculta
            </span>
          ) : null}
        </h2>
        <div className="flex flex-wrap items-center justify-end gap-x-3 text-sm text-neutral-600 [&_button]:min-h-10 [&_button]:px-1">
          <button
            type="button"
            disabled={pending}
            aria-label={`${categoria.oculta ? "Mostrar" : "Ocultar"} ${categoria.nome}`}
            onClick={() => executar(() => setCategoriaOculta(categoria.id, !categoria.oculta))}
            className="disabled:opacity-50"
          >
            {categoria.oculta ? "Mostrar categoria" : "Ocultar categoria"}
          </button>
        </div>
      </div>

      {erro ? (
        <p role="alert" className="mb-2 text-sm text-red-700">
          {erro}
        </p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {produtos.map((produto) => (
          <li
            key={produto.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-neutral-100 px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-3">
              {produto.imagem ? (
                <Image
                  src={produto.imagem}
                  alt={produto.nome}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 shrink-0 rounded-lg bg-neutral-200" aria-hidden />
              )}
              <div className="min-w-0">
                <p className="font-medium text-neutral-900">{produto.nome}</p>
                {produto.esgotado ? <p className="text-sm text-neutral-500">Esgotado</p> : null}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm [&_button]:min-h-10 [&_button]:px-1">
              <button
                type="button"
                disabled={pending}
                aria-label={`Marcar ${produto.nome} como ${produto.esgotado ? "disponível" : "esgotado"}`}
                onClick={() => executar(() => setProdutoEsgotado(produto.id, !produto.esgotado))}
                className="disabled:opacity-50"
              >
                {produto.esgotado ? "Marcar disponível" : "Marcar esgotado"}
              </button>
              <button
                type="button"
                disabled={pending}
                aria-label={`Editar ${produto.nome}`}
                onClick={() => setEditando(produto)}
                className="text-brand disabled:opacity-50"
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editando && <AdminProdutoModal produto={editando} onClose={() => setEditando(null)} />}
    </section>
  );
}
