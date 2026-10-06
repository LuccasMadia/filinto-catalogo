"use client";

import { useState, type FormEvent } from "react";
import type { Categoria, Produto } from "@/lib/catalogo-store";
import type { CatalogStore } from "@/lib/useCatalogStore";
import { formatPrice } from "@/lib/format";
import { AdminProdutoModal } from "./AdminProdutoModal";

type AdminCategoriaCardProps = {
  store: CatalogStore;
  categoria: Categoria;
  produtos: Produto[];
  isFirst: boolean;
  isLast: boolean;
};

export function AdminCategoriaCard({
  store,
  categoria,
  produtos,
  isFirst,
  isLast,
}: AdminCategoriaCardProps) {
  const [renaming, setRenaming] = useState(false);
  const [nome, setNome] = useState(categoria.nome);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [criandoProduto, setCriandoProduto] = useState(false);

  function handleRenameSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nome.trim()) return;
    store.renameCategoria(categoria.id, nome.trim());
    setRenaming(false);
  }

  function handleRemoveCategoria() {
    const confirmado = confirm(
      `Excluir "${categoria.nome}"? Isso remove também os ${produtos.length} produto(s) dessa categoria.`
    );
    if (confirmado) {
      store.removeCategoria(categoria.id);
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        {renaming ? (
          <form onSubmit={handleRenameSubmit} className="flex flex-1 gap-2">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="flex-1 rounded-lg border border-neutral-300 px-2 py-1"
              autoFocus
            />
            <button type="submit" className="text-sm font-medium text-[#AC1214]">
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setRenaming(false);
                setNome(categoria.nome);
              }}
              className="text-sm text-neutral-500"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <h2 className="font-[family-name:var(--font-dancing-script)] text-2xl text-[#AC1214]">
            {categoria.nome}
          </h2>
        )}

        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => store.moveCategoria(categoria.id, "up")}
            className="disabled:opacity-30"
            aria-label="Mover categoria para cima"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => store.moveCategoria(categoria.id, "down")}
            className="disabled:opacity-30"
            aria-label="Mover categoria para baixo"
          >
            ↓
          </button>
          {!renaming && (
            <button type="button" onClick={() => setRenaming(true)}>
              Renomear
            </button>
          )}
          <button type="button" onClick={handleRemoveCategoria} className="text-red-600">
            Excluir
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {produtos.map((produto, index) => (
          <li
            key={produto.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-neutral-100 px-3 py-2"
          >
            <div>
              <p className="font-medium text-neutral-900">{produto.nome}</p>
              <p className="text-sm text-neutral-500">{formatPrice(produto.preco)}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => store.moveProduto(produto.id, "up")}
                className="disabled:opacity-30"
                aria-label="Mover produto para cima"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === produtos.length - 1}
                onClick={() => store.moveProduto(produto.id, "down")}
                className="disabled:opacity-30"
                aria-label="Mover produto para baixo"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => setEditando(produto)}
                className="text-[#AC1214]"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${produto.nome}"?`)) {
                    store.removeProduto(produto.id);
                  }
                }}
                className="text-red-600"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setCriandoProduto(true)}
        className="mt-3 w-full rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-sm text-neutral-600"
      >
        + Adicionar produto
      </button>

      {criandoProduto && (
        <AdminProdutoModal
          categoriaId={categoria.id}
          onClose={() => setCriandoProduto(false)}
          onSubmit={(novo) => {
            store.addProduto(novo);
            setCriandoProduto(false);
          }}
        />
      )}

      {editando && (
        <AdminProdutoModal
          categoriaId={categoria.id}
          produto={editando}
          onClose={() => setEditando(null)}
          onSubmit={(changes) => {
            store.updateProduto(editando.id, changes);
            setEditando(null);
          }}
        />
      )}
    </section>
  );
}
