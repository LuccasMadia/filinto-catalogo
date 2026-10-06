import type { Produto } from "@/lib/catalogo-store";
import { ProductCard } from "./ProductCard";

type CategorySectionProps = {
  titulo: string;
  produtos: Produto[];
};

export function CategorySection({ titulo, produtos }: CategorySectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="mb-6 font-[family-name:var(--font-dancing-script)] text-3xl text-[#AC1214]">
        {titulo}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
  );
}
