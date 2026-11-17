"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { Categoria, Produto } from "@/lib/catalogo-store";
import { setCategoriaOculta, setProdutoEsgotado } from "@/lib/catalogo-actions";
import { AdminProdutoModal } from "./AdminProdutoModal";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";

type AdminCategoriaCardProps = {
  categoria: Categoria;
  produtos: Produto[];
};

export function AdminCategoriaCard({ categoria, produtos }: AdminCategoriaCardProps) {
  const [editando, setEditando] = useState<Produto | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Categorias em lista (sem nenhuma foto) ganham linhas compactas, sem miniatura vazia.
  const semFotos = produtos.every((p) => !p.imagem);
  const esgotados = produtos.filter((p) => p.esgotado).length;

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
    <section
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
        categoria.oculta ? "border-dashed border-neutral-300" : "border-neutral-200"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-neutral-100 bg-brand/5 px-4 py-3">
        <div className="min-w-0">
          <h2 className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-dancing-script)] text-2xl leading-tight text-brand">
            {categoria.nome}
            {categoria.oculta ? (
              <span className="rounded-full bg-neutral-700 px-2 py-0.5 font-sans text-xs font-semibold text-white">
                Oculta no site
              </span>
            ) : null}
          </h2>
          <p className="text-sm text-neutral-600">
            {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
            {esgotados > 0 ? ` · ${esgotados} esgotado${esgotados === 1 ? "" : "s"}` : ""}
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          aria-label={`${categoria.oculta ? "Mostrar" : "Ocultar"} ${categoria.nome}`}
          onClick={() => executar(() => setCategoriaOculta(categoria.id, !categoria.oculta))}
          className="min-h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 disabled:opacity-50"
        >
          {categoria.oculta ? "Mostrar categoria" : "Ocultar categoria"}
        </button>
      </div>

      {erro ? (
        <p role="alert" className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {erro}
        </p>
      ) : null}

      <ul className={`divide-y divide-neutral-100 ${categoria.oculta ? "opacity-60" : ""}`}>
        {produtos.map((produto) => (
          <li
            key={produto.id}
            className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 ${
              semFotos ? "py-2" : "py-3"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {semFotos ? null : (
                <div className={`h-12 w-12 shrink-0 ${produto.esgotado ? "grayscale" : ""}`}>
                  {produto.imagem ? (
                    <Image
                      src={produto.imagem}
                      alt={produto.nome}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <ProductImagePlaceholder nome={produto.nome} compacto />
                  )}
                </div>
              )}
              <p
                className={`min-w-0 font-medium ${
                  produto.esgotado ? "text-neutral-500" : "text-neutral-900"
                }`}
              >
                {produto.nome}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pending}
                aria-label={`Marcar ${produto.nome} como ${produto.esgotado ? "disponível" : "esgotado"}`}
                onClick={() => executar(() => setProdutoEsgotado(produto.id, !produto.esgotado))}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium transition disabled:opacity-50 ${
                  produto.esgotado
                    ? "border-neutral-300 bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-2 w-2 rounded-full ${produto.esgotado ? "bg-neutral-400" : "bg-emerald-600"}`}
                />
                {produto.esgotado ? "Esgotado" : "Disponível"}
              </button>
              <button
                type="button"
                disabled={pending}
                aria-label={`Editar ${produto.nome}`}
                onClick={() => setEditando(produto)}
                className="min-h-10 rounded-lg px-3 text-sm font-medium text-brand transition hover:bg-brand/10 disabled:opacity-50"
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
