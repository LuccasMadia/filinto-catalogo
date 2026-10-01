"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const HOLD_UNTIL_MS = 2000;

export function Hero() {
  const [phase, setPhase] = useState<"intro" | "done">("intro");

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
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
      initial={isIntro ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{
        default: { duration: 0.3 },
        layout: { duration: 0.5, ease: "easeInOut" },
      }}
      className={
        isIntro
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#AC1214] px-4 text-center text-white"
          : "bg-[#AC1214] px-4 py-16 text-center text-white"
      }
    >
      <motion.div
        layout
        initial={isIntro ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          default: { delay: isIntro ? 0.3 : 0, duration: 0.4 },
          layout: { duration: 0.5, ease: "easeInOut" },
        }}
        className="mx-auto mb-4 h-[140px] w-[140px]"
      >
        <Image
          src="/logo-filinto.png"
          alt="Filinto Sorvetes"
          width={140}
          height={140}
          className="rounded-full"
          preload
        />
      </motion.div>
      <motion.div
        initial={isIntro ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: isIntro ? 0.7 : 0, duration: 0.3 }}
      >
        <h1 className="font-[family-name:var(--font-dancing-script)] text-4xl">
          Filinto Sorvetes
        </h1>
        <p className="mt-2 text-white/90">O sabor que refresca o seu dia</p>
      </motion.div>
    </motion.header>
  );
}
