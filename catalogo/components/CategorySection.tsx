"use client";

import { useEffect, useState } from "react";
import type { Produto } from "@/lib/catalogo-store";
import { ProductCard } from "./ProductCard";

const LINHAS_INICIAIS = 2;
const LINHAS_POR_CLIQUE = 2;

function useColunasGrid() {
  const [colunas, setColunas] = useState(2);

  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");

    const atualizar = () => {
      if (mqLg.matches) setColunas(4);
      else if (mqSm.matches) setColunas(3);
      else setColunas(2);
    };

    atualizar();
    mqSm.addEventListener("change", atualizar);
    mqLg.addEventListener("change", atualizar);
    return () => {
      mqSm.removeEventListener("change", atualizar);
      mqLg.removeEventListener("change", atualizar);
    };
  }, []);

  return colunas;
}

type CategorySectionProps = {
  id: string;
  titulo: string;
  produtos: Produto[];
};

export function CategorySection({ id, titulo, produtos }: CategorySectionProps) {
  const colunas = useColunasGrid();
  const [linhasVisiveis, setLinhasVisiveis] = useState(LINHAS_INICIAIS);
  const [mostrarTudo, setMostrarTudo] = useState(false);

  const quantidadeVisivel = mostrarTudo
    ? produtos.length
    : Math.min(linhasVisiveis * colunas, produtos.length);
  const produtosVisiveis = produtos.slice(0, quantidadeVisivel);
  const temMaisProdutos = !mostrarTudo && quantidadeVisivel < produtos.length;

  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-14 px-4 py-10">
      <h2 className="mb-6 font-[family-name:var(--font-dancing-script)] text-4xl text-brand">
        {titulo}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {produtosVisiveis.map((produto, index) => (
          <ProductCard key={produto.id} produto={produto} atraso={(index % colunas) * 0.05} />
        ))}
      </div>
      {temMaisProdutos ? (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setLinhasVisiveis((linhas) => linhas + LINHAS_POR_CLIQUE)}
            className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            Ver mais produtos
          </button>
          <button
            type="button"
            onClick={() => setMostrarTudo(true)}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Mostrar todos ({produtos.length})
          </button>
        </div>
      ) : null}
    </section>
  );
}
