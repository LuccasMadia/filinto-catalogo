"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { WHATSAPP } from "@/lib/contato";

const HOLD_UNTIL_MS = 2000;
const TROCA_MS = 5000;

// Um fundo por slide (vermelho Filinto, chocolate, morango); a casquinha abaixo é ilustração fictícia.
const FUNDOS = ["#AC1214", "#6B3A0A", "#EFA0BC"];

// Casquinha de ilustração FICTÍCIA: substituir por <Image> com a foto real quando o cliente enviar.
function Casquinha({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 240" aria-hidden="true" className={className}>
      <path d="M30 108h60L60 236z" fill="#E8A23B" />
      <path d="M45 128l30 0M52 148h16M40 112l32 110M80 112L48 222" stroke="#C97F1E" strokeWidth="2.5" />
      <path d="M22 100c0-16 16-26 38-26s38 10 38 26c0 6-4 10-8 10l-6 14c-1 3-5 3-6 0l-4-10-6 14c-1 3-5 3-6 0l-4-12-8 12c-2 3-6 2-6-1l-1-14c-6 0-9-4-9-9z" fill="#FBEBB5" />
      <path d="M26 66c0-26 15-44 34-44s34 18 34 44c0 4-3 8-6 8l-4 14c-1 3-5 3-6 0l-3-10-6 12c-1 3-5 3-6 0l-3-12-8 14c-2 3-6 2-6-1l-1-15c-5 0-9-3-9-9z" fill="#F2A0B5" />
      <ellipse cx="44" cy="42" rx="7" ry="13" fill="#fff" opacity=".35" transform="rotate(20 44 42)" />
    </svg>
  );
}

export function Hero() {
  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [slide, setSlide] = useState(0);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      setPhase("done");
    }
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setPhase("done"), HOLD_UNTIL_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  useEffect(() => {
    if (phase !== "done" || reducedMotion) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % FUNDOS.length), TROCA_MS);
    return () => clearInterval(id);
  }, [phase, reducedMotion]);

  if (phase === "intro") {
    return (
      // Sem fade inicial: o fundo vermelho do splash cobre o catálogo já no HTML do servidor.
      <header className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#AC1214] px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="h-[min(72vw,340px)] w-[min(72vw,340px)]"
        >
          <Image src="/logo-filinto.png" alt="Filinto Sorvetes" width={340} height={340} className="h-full w-full rounded-full" preload />
        </motion.div>
      </header>
    );
  }

  return (
    <header
      style={{ backgroundColor: FUNDOS[slide] }}
      className="relative flex min-h-svh flex-col items-center overflow-hidden transition-colors duration-700"
    >
      <Image src="/logo-filinto.png" alt="Filinto Sorvetes" width={72} height={72} className="absolute left-4 top-4 z-10 h-14 w-14 rounded-full sm:h-[72px] sm:w-[72px]" />

      <motion.div
        initial={reducedMotion ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 13 }}
        className="absolute bottom-[28%] z-0 flex w-full items-end justify-center gap-[3vw] sm:gap-10"
      >
        <Casquinha className="mb-[-2svh] h-[30svh] max-h-72 -rotate-6" />
        <Casquinha className="h-[48svh] max-h-[32rem]" />
        <Casquinha className="mb-[-2svh] h-[30svh] max-h-72 rotate-6" />
      </motion.div>

      <div className="absolute bottom-0 left-1/2 z-10 flex h-[36%] w-[150%] -translate-x-1/2 flex-col items-center justify-center rounded-t-[50%] bg-background px-6 pt-6 text-center shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
        <h1 className="font-[family-name:var(--font-dancing-script)] text-5xl leading-none text-brand sm:text-6xl">
          Filinto Sorvetes
        </h1>
        <p className="mt-2 text-neutral-700">O sabor que refresca o seu dia</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={WHATSAPP.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center rounded-full bg-brand px-7 font-bold text-white shadow-md transition hover:bg-brand-dark active:scale-[0.97]"
          >
            Pedir no WhatsApp
          </a>
          <a
            href="#cardapio"
            className="inline-flex min-h-12 items-center rounded-full border-2 border-brand px-7 font-bold text-brand transition hover:bg-brand hover:text-white active:scale-[0.97]"
          >
            Ver cardápio
          </a>
        </div>
      </div>
    </header>
  );
}
