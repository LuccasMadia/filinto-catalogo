"use client";

import { useState, type FormEvent } from "react";
import type { NovoProduto, Produto } from "@/lib/catalogo-store";

type AdminProdutoModalProps = {
  categoriaId: string;
  produto?: Produto;
  onClose: () => void;
  onSubmit: (dados: NovoProduto) => void;
};

export function AdminProdutoModal({
  categoriaId,
  produto,
  onClose,
  onSubmit,
}: AdminProdutoModalProps) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [preco, setPreco] = useState(produto ? String(produto.preco) : "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const precoNumero = Number(preco.replace(",", "."));

    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }
    if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
      setErro("Informe um preço válido, maior que zero.");
      return;
    }

    onSubmit({
      categoriaId,
      nome: nome.trim(),
      preco: precoNumero,
      descricao: descricao.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          {produto ? "Editar produto" : "Novo produto"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-neutral-700">
            Nome
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              autoFocus
            />
          </label>
          <label className="text-sm text-neutral-700">
            Preço (R$)
            <input
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
          </label>
          <label className="text-sm text-neutral-700">
            Descrição (opcional)
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
          </label>
          {erro ? <p className="text-sm text-red-600">{erro}</p> : null}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm text-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#AC1214] px-3 py-2 text-sm font-medium text-white"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
