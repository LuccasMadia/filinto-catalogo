"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import type { Produto } from "@/lib/catalogo-store";
import { setProdutoNome } from "@/lib/catalogo-actions";

type AdminProdutoModalProps = {
  produto: Produto;
  onClose: () => void;
};

export function AdminProdutoModal({ produto, onClose }: AdminProdutoModalProps) {
  const [nome, setNome] = useState(produto.nome);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }
    startTransition(async () => {
      const res = await setProdutoNome(produto.id, nome.trim());
      if (res.error) setErro(res.error);
      else onClose();
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editar produto"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Editar produto</h3>
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
          {erro ? (
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          ) : null}
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
              disabled={pending}
              className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {pending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
