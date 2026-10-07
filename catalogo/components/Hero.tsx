"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HeroNav } from "./HeroNav";
import { HeroDripEdge } from "./HeroDripEdge";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/config";

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
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    "Olá! Quero ver o cardápio do Filinto."
  );

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
          : "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#C81619_0%,#8A0F11_100%)] px-4 py-16 text-center text-white"
      }
    >
      {!isIntro && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0"
        >
          <HeroNav />
          <HeroDripEdge />
        </motion.div>
      )}
      <motion.div
        layout
        initial={isIntro ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          default: { delay: isIntro ? 0.3 : 0, duration: 0.4 },
          layout: { duration: 0.5, ease: "easeInOut" },
        }}
        className={
          isIntro
            ? "relative z-10 mx-auto mb-4 h-[140px] w-[140px]"
            : "relative z-10 mx-auto mb-0 h-0 w-0 overflow-hidden opacity-0"
        }
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
        className="relative z-10"
      >
        <h1 className="font-[family-name:var(--font-dancing-script)] text-5xl sm:text-6xl">
          Filinto Sorvetes
        </h1>
        <p className="mt-2 text-white/90">O sabor que refresca o seu dia</p>
      </motion.div>
      {!isIntro && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-20 mt-4"
        >
          <div className="relative mx-auto -mb-6 w-[220px] sm:w-[280px]">
            <Image
              src="/hero-sorvete.png"
              alt="Casquinha de sorvete Filinto"
              width={1086}
              height={1448}
              className="h-auto w-full drop-shadow-2xl"
            />
            <div className="absolute -right-4 top-10 flex h-20 w-20 rotate-12 flex-col items-center justify-center rounded-full bg-white text-center shadow-lg sm:-right-8 sm:top-14 sm:h-24 sm:w-24">
              <span className="text-xl leading-none font-extrabold text-[#AC1214] sm:text-2xl">
                100%
              </span>
              <span className="mt-0.5 text-[10px] font-semibold tracking-wide text-[#AC1214] uppercase sm:text-xs">
                artesanal
              </span>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#AC1214] shadow-lg transition hover:brightness-95"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
            </svg>
            Pedir no WhatsApp
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
