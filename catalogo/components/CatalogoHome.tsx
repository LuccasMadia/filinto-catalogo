"use client";

import { MotionConfig } from "framer-motion";
import { Hero } from "@/components/Hero";
import { CategoryNav } from "@/components/CategoryNav";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import type { CatalogoState } from "@/lib/catalogo-store";

// Categorias mostradas como lista de nomes ao lado de uma imagem única (placeholder se não houver).
const CATEGORIAS_EM_LISTA: Record<string, { imagem?: string }> = {
  picoles: {},
  caixa: { imagem: "/produtos/caixa.webp" },
};

export function CatalogoHome({ categorias, produtos }: CatalogoState) {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Hero />
        <CategoryNav categorias={categorias} />
        {categorias.map((categoria) => (
          <CategorySection
            key={categoria.id}
            id={categoria.id}
            lista={CATEGORIAS_EM_LISTA[categoria.id]}
            titulo={categoria.nome}
            produtos={produtos.filter((p) => p.categoriaId === categoria.id)}
          />
        ))}
        <Footer />
      </main>
    </MotionConfig>
  );
}
