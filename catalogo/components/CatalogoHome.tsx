"use client";

import { MotionConfig } from "framer-motion";
import { Hero } from "@/components/Hero";
import { CategoryNav } from "@/components/CategoryNav";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import type { CatalogoState } from "@/lib/catalogo-store";

// Categorias mostradas como lista de nomes ao lado de uma imagem única (placeholder se não houver).
const CATEGORIAS_EM_LISTA: Record<string, { imagem?: string; largura?: number; altura?: number }> = {
  picoles: { imagem: "/produtos/picoles.webp", largura: 900, altura: 593 },
  caixa: { imagem: "/produtos/caixa.webp", largura: 600, altura: 600 },
  sundaes: { imagem: "/produtos/sundaes.webp", largura: 900, altura: 813 },
};

export function CatalogoHome({ categorias, produtos }: CatalogoState) {
  // Nas categorias em lista a imagem alterna: esquerda na primeira, direita na segunda, e assim por diante.
  const imagemADireita: Record<string, boolean> = {};
  categorias
    .filter((c) => CATEGORIAS_EM_LISTA[c.id])
    .forEach((c, i) => {
      imagemADireita[c.id] = i % 2 === 1;
    });

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Hero categorias={categorias} />
        <CategoryNav categorias={categorias} />
        {categorias.map((categoria) => (
          <CategorySection
            key={categoria.id}
            id={categoria.id}
            lista={CATEGORIAS_EM_LISTA[categoria.id]}
            imagemADireita={imagemADireita[categoria.id]}
            titulo={categoria.nome}
            produtos={produtos.filter((p) => p.categoriaId === categoria.id)}
          />
        ))}
        <Footer />
      </main>
    </MotionConfig>
  );
}
