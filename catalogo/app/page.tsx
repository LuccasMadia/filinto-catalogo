"use client";

import { MotionConfig } from "framer-motion";
import { Hero } from "@/components/Hero";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { CategoryNav } from "@/components/CategoryNav";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/useCart";
import { useCatalogStore } from "@/lib/useCatalogStore";

export default function Home() {
  const { categorias, produtos } = useCatalogStore();

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
      <main>
        <Hero />
        <CategoryNav categorias={categorias} />
        {categorias.map((categoria) => (
          <CategorySection
            key={categoria.id}
            id={categoria.id}
            titulo={categoria.nome}
            produtos={produtos.filter((p) => p.categoriaId === categoria.id)}
          />
        ))}
        <Footer />
        <FloatingWhatsAppButton />
      </main>
      </CartProvider>
    </MotionConfig>
  );
}
