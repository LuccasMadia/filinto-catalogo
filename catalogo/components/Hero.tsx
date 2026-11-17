"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { WHATSAPP } from "@/lib/contato";

const HOLD_UNTIL_MS = 2000;
const TROCA_MS = 5000;

// Cada slide: cor de fundo + foto da casquinha (public/hero-<sabor>.webp).
const SLIDES = [
  { fundo: "#AC1214", foto: "/hero-morango.webp" },
  { fundo: "#6B3A0A", foto: "/hero-chocolate.webp" },
  { fundo: "#F3DFC1", foto: "/hero-baunilha.webp" },
];

function Casquinha({ src, className }: { src: string; className: string }) {
  return <Image src={src} alt="" width={540} height={900} sizes="(min-width: 640px) 360px, 45vw" className={`w-auto ${className}`} />;
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
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), TROCA_MS);
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
      style={{ backgroundColor: SLIDES[slide].fundo }}
      className="relative flex min-h-svh flex-col items-center overflow-hidden transition-colors duration-700"
    >
      <Image src="/logo-filinto.png" alt="Filinto Sorvetes" width={72} height={72} className="absolute left-4 top-4 z-10 h-14 w-14 rounded-full sm:h-[72px] sm:w-[72px]" />

      <motion.div
        initial={reducedMotion ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 13 }}
        className="absolute bottom-[28%] z-0 flex w-full justify-center"
      >
        {SLIDES.map(({ foto }, i) => (
          <div
            key={foto}
            className={`absolute inset-x-0 bottom-0 flex items-end justify-center gap-[3vw] transition-opacity duration-700 sm:gap-10 ${i === slide ? "opacity-100" : "opacity-0"}`}
          >
            <Casquinha src={foto} className="mb-[-2svh] h-[30svh] max-h-72 -rotate-6" />
            <Casquinha src={foto} className="h-[48svh] max-h-[32rem]" />
            <Casquinha src={foto} className="mb-[-2svh] h-[30svh] max-h-72 rotate-6" />
          </div>
        ))}
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
