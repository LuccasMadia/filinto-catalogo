import type { Produto } from "@/lib/catalogo-store";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";

export function ProductCard({ produto, atraso = 0 }: { produto: Produto; atraso?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.5, delay: atraso, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col gap-2"
    >
      <div className="relative">
      <div className={produto.esgotado ? "grayscale" : undefined}>
      {produto.imagem ? (
        <div className="relative aspect-square w-full">
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
            className="object-contain transition duration-500 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <ProductImagePlaceholder nome={produto.nome} />
      )}
      </div>
      {produto.esgotado ? (
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/80 py-1.5 text-center text-sm font-bold uppercase tracking-widest text-white">
          Esgotado
        </span>
      ) : null}
      </div>
      <h3 className="text-center font-semibold text-neutral-900">{produto.nome}</h3>
    </motion.div>
  );
}
