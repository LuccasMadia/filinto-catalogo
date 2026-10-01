"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <motion.header
      layoutId="hero-bg"
      transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
      className="bg-[#AC1214] px-4 py-16 text-center text-white"
    >
      <motion.div
        layoutId="hero-logo"
        transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
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
      <h1 className="font-[family-name:var(--font-dancing-script)] text-4xl">
        Filinto Sorvetes
      </h1>
      <p className="mt-2 text-white/90">O sabor que refresca o seu dia</p>
    </motion.header>
  );
}
