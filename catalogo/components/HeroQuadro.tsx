"use client";

import { motion } from "framer-motion";
import type { Categoria } from "@/lib/catalogo-store";
import { WHATSAPP } from "@/lib/contato";
import { Ilustracao } from "./HeroIlustracoes";

// Quadro de sabores da parede da loja: uma linha por categoria visível, cada uma leva à sua seção.
export function HeroQuadro({
  categorias,
  reducedMotion,
}: {
  categorias: Categoria[];
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: -2.5 }}
      animate={{ opacity: 1, y: 0, rotate: 1.2 }}
      transition={{ type: "spring", stiffness: 70, damping: 11, delay: 0.2 }}
      className="relative mx-auto w-full max-w-md origin-top pt-14 md:mx-0 md:max-w-lg"
    >
      <motion.a
        href={WHATSAPP.link}
        target="_blank"
        rel="noreferrer"
        initial={reducedMotion ? false : { rotate: -10 }}
        animate={{ rotate: -3 }}
        transition={{ type: "spring", stiffness: 60, damping: 5, delay: 0.7 }}
        className="absolute right-5 top-0 z-10 flex origin-top flex-col items-center"
      >
        <span aria-hidden="true" className="h-5 w-px bg-[#E8C99B]" />
        <span className="rounded-md bg-background px-3 py-1.5 text-center shadow-lg transition hover:-translate-y-0.5">
          <span className="block text-[11px] font-bold uppercase tracking-widest text-neutral-600">
            Pedidos
          </span>
          <span className="block text-base font-extrabold leading-tight text-brand">
            {WHATSAPP.texto}
          </span>
        </span>
      </motion.a>

      <div className="rounded-2xl border-[6px] border-[#5C3317] bg-[#2A1A14] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_46px,rgba(255,255,255,0.035)_46px,rgba(255,255,255,0.035)_48px)] px-3 pb-3 pt-4 text-left shadow-[0_24px_40px_-12px_rgba(0,0,0,0.55)] sm:px-4">
        <p className="px-2 pb-2 font-[family-name:var(--font-dancing-script)] text-3xl leading-none text-background md:text-4xl">
          Nossos sabores
        </p>
        <ul>
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <a
                href={`#${categoria.id}`}
                className="group flex min-h-12 items-center gap-3 rounded-lg px-2 py-1 md:min-h-14 text-background transition hover:bg-white/10"
              >
                <span className="h-10 w-10 shrink-0 md:h-12 md:w-12 transition duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Ilustracao categoriaId={categoria.id} />
                </span>
                <span className="flex-1 text-sm font-extrabold uppercase tracking-wide md:text-base">
                  {categoria.nome}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[#F2778E] transition group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
