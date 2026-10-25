import type { Produto } from "@/lib/catalogo-store";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ produto, atraso = 0 }: { produto: Produto; atraso?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.5, delay: atraso, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col gap-2 rounded-2xl border border-brand/15 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10"
    >
      {produto.imagem ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition duration-500 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <ProductImagePlaceholder nome={produto.nome} />
      )}
      <h3 className="font-semibold text-neutral-900">{produto.nome}</h3>
      {produto.descricao ? (
        <p className="text-sm text-neutral-600">{produto.descricao}</p>
      ) : null}
      <span className="mt-auto font-bold text-brand">{formatPrice(produto.preco)}</span>
      <AddToCartButton produto={produto} />
    </motion.div>
  );
}
