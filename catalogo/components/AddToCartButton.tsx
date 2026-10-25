"use client";

import type { Produto } from "@/lib/catalogo-store";
import { useCart } from "@/lib/useCart";

const MAX_QUANTIDADE = 99;

export function AddToCartButton({ produto }: { produto: Produto }) {
  const { itens, add, setQuantidade } = useCart();
  const qtd = itens.find((i) => i.produtoId === produto.id)?.quantidade ?? 0;

  if (qtd === 0) {
    return (
      <button
        type="button"
        onClick={() => add({ id: produto.id, nome: produto.nome, preco: produto.preco })}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark active:scale-[0.97]"
      >
        Adicionar
      </button>
    );
  }

  const passo =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg font-semibold text-white transition duration-200 hover:bg-brand-dark active:scale-[0.97] disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div className="flex w-full items-center justify-between rounded-full bg-brand">
      <button
        type="button"
        aria-label={`Diminuir quantidade de ${produto.nome}`}
        onClick={() => setQuantidade(produto.id, qtd - 1)}
        className={passo}
      >
        −
      </button>
      <span aria-live="polite" className="text-sm font-semibold text-white">
        {qtd}
      </span>
      <button
        type="button"
        aria-label={`Aumentar quantidade de ${produto.nome}`}
        disabled={qtd >= MAX_QUANTIDADE}
        onClick={() => setQuantidade(produto.id, qtd + 1)}
        className={passo}
      >
        +
      </button>
    </div>
  );
}
