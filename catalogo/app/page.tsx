"use client";

import { Hero } from "@/components/Hero";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { useCatalogStore } from "@/lib/useCatalogStore";

export default function Home() {
  const { categorias, produtos } = useCatalogStore();

  return (
    <main>
      <Hero />
      {categorias.map((categoria) => (
        <CategorySection
          key={categoria.id}
          titulo={categoria.nome}
          produtos={produtos.filter((p) => p.categoriaId === categoria.id)}
        />
      ))}
      <Footer />
      <FloatingWhatsAppButton />
    </main>
  );
}
