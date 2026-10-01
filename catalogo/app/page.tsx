import { Hero } from "@/components/Hero";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { produtos, CATEGORIAS } from "@/lib/produtos";

export default function Home() {
  return (
    <main>
      <Hero />
      {CATEGORIAS.map((categoria) => (
        <CategorySection
          key={categoria.id}
          titulo={categoria.titulo}
          produtos={produtos.filter((p) => p.categoria === categoria.id)}
        />
      ))}
      <Footer />
      <FloatingWhatsAppButton />
    </main>
  );
}
