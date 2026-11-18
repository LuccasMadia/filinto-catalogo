"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { WHATSAPP } from "@/lib/contato";

const HOLD_UNTIL_MS = 2000;
const TROCA_MS = 4000;


// Roleta: [esquerda, meio, direita]. Clicar numa casquinha lateral a traz para o meio e o fundo ganha a cor do sabor.
const SABORES = {
  chocolate: { fundo: "#6B3A0A", foto: "/hero-chocolate.webp", nome: "chocolate" },
  morango: { fundo: "#AC1214", foto: "/hero-morango.webp", nome: "morango" },
  baunilha: { fundo: "#F3DFC1", foto: "/hero-baunilha.webp", nome: "baunilha" },
};
type Sabor = keyof typeof SABORES;
const POSICOES = [
  { x: "-70%", y: "4%", scale: 0.6, rotate: -6 },
  { x: "0%", y: "0%", scale: 1, rotate: 0 },
  { x: "70%", y: "4%", scale: 0.6, rotate: 6 },
];

function girar(ordem: Sabor[], posicao: number): Sabor[] {
  // Esquerda: tudo gira para a direita; direita: tudo gira para a esquerda.
  if (posicao === 0) return [ordem[2], ordem[0], ordem[1]];
  if (posicao === 2) return [ordem[1], ordem[2], ordem[0]];
  return ordem;
}

export function Hero() {
  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ordem, setOrdem] = useState<Sabor[]>(["chocolate", "morango", "baunilha"]);

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

  // Gira sozinha; o relógio reinicia a cada troca (inclusive após um clique), e não roda com movimento reduzido.
  useEffect(() => {
    if (phase !== "done" || reducedMotion) return;
    const id = setTimeout(() => setOrdem((o) => girar(o, 2)), TROCA_MS);
    return () => clearTimeout(id);
  }, [phase, reducedMotion, ordem]);

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
      style={{ backgroundColor: SABORES[ordem[1]].fundo }}
      className="relative flex min-h-svh flex-col items-center overflow-hidden transition-colors duration-700"
    >
      <Image src="/logo-filinto.png" alt="Filinto Sorvetes" width={72} height={72} className="absolute left-4 top-4 z-10 h-14 w-14 rounded-full sm:h-[72px] sm:w-[72px]" />

      <motion.div
        initial={reducedMotion ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 13 }}
        className="absolute bottom-[28%] z-0 flex w-full justify-center"
      >
        <div className="relative h-[min(48svh,80vw)] max-h-[32rem] w-full">
          {(Object.keys(SABORES) as Sabor[]).map((sabor) => {
            const posicao = ordem.indexOf(sabor);
            return (
              <div key={sabor} className="absolute bottom-0 left-1/2 flex h-full w-0 justify-center" style={{ zIndex: posicao === 1 ? 1 : 0 }}>
                <motion.button
                  type="button"
                  aria-label={`Fundo ${SABORES[sabor].nome}`}
                  onClick={() => setOrdem((o) => girar(o, posicao))}
                  initial={false}
                  animate={POSICOES[posicao]}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  style={{ transformOrigin: "50% 100%" }}
                  className="h-full"
                >
                  <Image src={SABORES[sabor].foto} alt="" width={540} height={900} sizes="(min-width: 640px) 360px, 45vw" className="h-full w-auto max-w-none" />
                </motion.button>
              </div>
            );
          })}
        </div>
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
