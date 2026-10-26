"use client";

import { useEffect, useRef, useState } from "react";
import type { Categoria } from "@/lib/catalogo-store";

export function CategoryNav({ categorias }: { categorias: Categoria[] }) {
  const [ativa, setAtiva] = useState<string | null>(null);
  const chips = useRef(new Map<string, HTMLAnchorElement>());

  // A seção que cruza uma linha perto do topo é a ativa.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setAtiva(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    for (const { id } of categorias) {
      const secao = document.getElementById(id);
      if (secao) observer.observe(secao);
    }
    return () => observer.disconnect();
  }, [categorias]);

  useEffect(() => {
    if (!ativa) return;
    chips.current
      .get(ativa)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [ativa]);

  return (
    <nav
      id="cardapio"
      aria-label="Categorias"
      className="sticky top-0 z-40 flex gap-2 overflow-x-auto border-b border-brand/15 bg-background/95 px-4 py-3 backdrop-blur [&>:first-child]:ml-auto [&>:last-child]:mr-auto"
    >
      {categorias.map((categoria) => (
        <a
          key={categoria.id}
          ref={(el) => {
            if (el) chips.current.set(categoria.id, el);
            else chips.current.delete(categoria.id);
          }}
          href={`#${categoria.id}`}
          aria-current={ativa === categoria.id ? "true" : undefined}
          className={`shrink-0 rounded-full border border-brand px-4 py-2 text-sm font-semibold transition duration-300 active:scale-95 ${
            ativa === categoria.id ? "bg-brand text-white" : "text-brand hover:bg-brand/10"
          }`}
        >
          {categoria.nome}
        </a>
      ))}
    </nav>
  );
}
