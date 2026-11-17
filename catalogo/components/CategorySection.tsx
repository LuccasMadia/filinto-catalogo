"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Produto } from "@/lib/catalogo-store";
import Image from "next/image";
import { ProductCard } from "./ProductCard";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";

const LINHAS_INICIAIS = 2;
const LINHAS_POR_CLIQUE = 2;

// A grade se ajusta sozinha à largura (auto-fill); aqui só lemos quantas colunas ela formou.
function useColunasGrid(ref: RefObject<HTMLElement | null>) {
  const [colunas, setColunas] = useState(2);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () =>
      setColunas(Math.max(1, getComputedStyle(el).gridTemplateColumns.split(" ").length));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return colunas;
}

type CategorySectionProps = {
  id: string;
  titulo: string;
  produtos: Produto[];
  imagemADireita?: boolean;
  lista?: { imagem?: string; largura?: number; altura?: number };
};

export function CategorySection({ id, titulo, produtos, lista, imagemADireita }: CategorySectionProps) {
  const gradeRef = useRef<HTMLDivElement>(null);
  const colunas = useColunasGrid(gradeRef);
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
      {lista ? (
        <div
          className={`flex items-center gap-5 sm:gap-8 ${imagemADireita ? "flex-row-reverse" : ""}`}
        >
        <div className="w-32 shrink-0 sm:w-60">
          {lista.imagem ? (
            <Image
              src={lista.imagem}
              alt=""
              width={lista.largura ?? 600}
              height={lista.altura ?? 600}
              className="h-auto w-full transition duration-500 ease-out hover:scale-110"
            />
          ) : (
            <ProductImagePlaceholder nome={titulo} />
          )}
        </div>
        <ul className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {produtos.map((produto) => (
            <li
              key={produto.id}
              className={`font-semibold ${
                produto.esgotado ? "text-neutral-400 line-through" : "text-neutral-900"
              }`}
            >
              <span aria-hidden="true" className="mr-2 text-brand no-underline">
                •
              </span>
              {produto.nome}
              {produto.esgotado ? (
                <span className="ml-2 text-xs font-bold uppercase tracking-widest no-underline">
                  Esgotado
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        </div>
      ) : (
        <div
          ref={gradeRef}
          className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,10rem),1fr))] gap-4"
        >
          {produtosVisiveis.map((produto, index) => (
            <ProductCard key={produto.id} produto={produto} atraso={(index % colunas) * 0.05} />
          ))}
        </div>
      )}
      {temMaisProdutos && !lista ? (
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
