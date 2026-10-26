"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HeroNav } from "./HeroNav";
import { HeroDripEdge } from "./HeroDripEdge";

const HOLD_UNTIL_MS = 2000;

export function Hero() {
  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
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
    if (phase === "done") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  const isIntro = phase === "intro";

  return (
    <motion.header
      layout
      // Sem fade inicial: o fundo vermelho do splash precisa cobrir o catálogo já no HTML do servidor.
      initial={false}
      transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
      className={
        isIntro
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#AC1214] px-4 text-center text-white"
          : "relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_70%_45%,#D01A1D_0%,#AC1214_45%,#7A0D0F_100%)] px-6 pt-24 pb-28 text-center text-white md:flex-row md:justify-start md:px-16 md:text-left lg:px-24"
      }
    >
      {!isIntro && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0"
        >
          <motion.div
            className="absolute inset-0"
            initial={reducedMotion ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/fachada-desktop.jpg"
              alt="Fachada da loja Filinto Sorvetes"
              fill
              sizes="100vw"
              className="hidden object-cover object-[50%_65%] md:block"
            />
            <Image
              src="/fachada-mobile.jpg"
              alt="Fachada da loja Filinto Sorvetes"
              fill
              sizes="100vw"
              className="object-cover object-[50%_70%] md:hidden"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(110,11,13,0.9),rgba(172,18,20,0.8))] md:bg-[linear-gradient(90deg,rgba(92,9,11,0.97)_0%,rgba(130,13,15,0.9)_48%,rgba(122,13,15,0.5)_100%)]" />
          <HeroNav />
          <HeroDripEdge />
        </motion.div>
      )}
      <motion.div
        layout
        initial={isIntro ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          default: { delay: isIntro ? 0.1 : 0, duration: 0.5 },
          layout: { duration: 0.5, ease: "easeInOut" },
        }}
        className={
          isIntro
            ? "relative z-10 mx-auto h-[min(72vw,340px)] w-[min(72vw,340px)]"
            : "relative z-10 h-0 w-0 overflow-hidden opacity-0"
        }
      >
        <Image
          src="/logo-filinto.png"
          alt="Filinto Sorvetes"
          width={340}
          height={340}
          className="h-full w-full rounded-full"
          preload
        />
      </motion.div>
      <motion.div
        initial={isIntro ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: isIntro ? 0.7 : 0, duration: 0.3 }}
        className={isIntro ? "hidden" : "relative z-10"}
      >
        <h1
          className={`font-[family-name:var(--font-dancing-script)] leading-none ${
            isIntro ? "text-5xl sm:text-6xl" : "text-6xl sm:text-7xl lg:text-8xl"
          }`}
        >
          Filinto Sorvetes
        </h1>
        <p className={`mt-3 text-white/90 ${isIntro ? "" : "text-lg sm:text-xl"}`}>
          O sabor que refresca o seu dia
        </p>
        {!isIntro && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            <a
              href="#cardapio"
              className="inline-flex min-h-12 items-center rounded-full bg-white px-7 text-base font-bold text-brand shadow-lg transition duration-200 hover:bg-neutral-100 active:scale-[0.97]"
            >
              Ver cardápio
            </a>
          </motion.div>
        )}
      </motion.div>
    </motion.header>
  );
}
