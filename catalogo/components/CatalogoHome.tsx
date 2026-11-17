"use client";

import { MotionConfig } from "framer-motion";
import { Hero } from "@/components/Hero";
import { CategoryNav } from "@/components/CategoryNav";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import type { CatalogoState } from "@/lib/catalogo-store";

// Categorias mostradas só como lista de nomes, sem fotos.
const CATEGORIAS_EM_LISTA = new Set(["picoles"]);

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
            lista={CATEGORIAS_EM_LISTA.has(categoria.id)}
            titulo={categoria.nome}
            produtos={produtos.filter((p) => p.categoriaId === categoria.id)}
          />
        ))}
        <Footer />
      </main>
    </MotionConfig>
  );
}
