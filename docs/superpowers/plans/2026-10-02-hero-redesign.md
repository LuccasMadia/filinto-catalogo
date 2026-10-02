# Redesign do Hero (referência Cafe & Creamery) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aproximar visualmente o Hero do catálogo Filinto Sorvetes da referência "Cafe and Creamery", adicionando uma nav bar superior (logo + botão de WhatsApp), decoração de frutas nos cantos, e uma borda "derretendo" na transição pro resto da página — mantendo a intro splash existente intacta.

**Architecture:** Três componentes novos e independentes (`HeroNav`, `HeroFruitDecor`, `HeroDripEdge`), cada um puramente presentacional e sem estado próprio, depois compostos dentro de `Hero.tsx` (que já tem a máquina de estados `"intro" | "done"` da intro splash). Os três só renderizam quando `phase === "done"`, envoltos num único `motion.div` que faz fade-in (opacity 0→1) assim que a splash termina.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS v4 (classes utilitárias, valores arbitrários), Framer Motion (`motion.div`, já instalado).

## Global Constraints

- Cor de marca (exata): `#AC1214` — usar esse hex literal em qualquer elemento novo que precise da cor da marca (inclui o preenchimento do SVG do `HeroDripEdge`).
- Mobile-first: todo elemento novo precisa ler bem a partir de 375px de largura antes de considerar desktop.
- Sem fotos reais de produto nesta rodada — `HeroFruitDecor` renderiza um SVG flat por padrão, mas aceita uma prop `src?: string` opcional que, se fornecida, troca o SVG por um `next/image` com esse asset (preparação para quando houver uma imagem de alta qualidade).
- Projeto não tem jsdom/testing-library configurado — `lib/*.test.ts` só cobre funções puras. Componentes visuais (incluindo os três novos) são verificados manualmente via `npm run dev` + navegador, não por teste automatizado.
- Durante a fase `"intro"` da splash (tela cheia vermelha), `HeroNav`, `HeroFruitDecor` e `HeroDripEdge` não devem renderizar — só aparecem (com fade) depois que `phase` vira `"done"`, sem alterar o timing/comportamento da splash em si (`HOLD_UNTIL_MS`, `prefers-reduced-motion`, trava de scroll).
- Nav bar não é `fixed`/`sticky` — rola junto com a página; `FloatingWhatsAppButton` (já existente) continua sendo o CTA persistente durante o scroll.
- Mensagem padrão do WhatsApp para CTAs de "ver cardápio" (já usada em `FloatingWhatsAppButton`): `"Olá! Quero ver o cardápio do Filinto."` — reaproveitar `buildWhatsAppUrl` (`catalogo/lib/whatsapp.ts`) e `WHATSAPP_NUMBER` (`catalogo/lib/config.ts`) em vez de duplicar lógica.

---

### Task 1: Criar `HeroDripEdge`

**Files:**
- Create: `catalogo/components/HeroDripEdge.tsx`

**Interfaces:**
- Produces: `<HeroDripEdge />`, componente sem props, SVG absoluto que a Task 4 vai montar dentro de `Hero.tsx`.

- [ ] **Step 1: Criar o componente**

Criar `catalogo/components/HeroDripEdge.tsx`:

```tsx
export function HeroDripEdge() {
  return (
    <svg
      viewBox="0 0 400 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-10 w-full translate-y-1/2 sm:h-14"
    >
      <path
        d="M0,0 C25,0 25,50 50,50 C75,50 75,0 100,0 C125,0 125,70 150,70 C175,70 175,0 200,0 C225,0 225,40 250,40 C275,40 275,0 300,0 C325,0 325,60 350,60 C375,60 375,0 400,0 L400,80 L0,80 Z"
        fill="#AC1214"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Verificar que o projeto builda**

Run (dentro de `catalogo/`): `npm run build`
Expected: build termina sem erro de tipo/compilação (o componente ainda não é usado em nenhuma página, mas precisa compilar sozinho).

- [ ] **Step 3: Verificar que os testes existentes continuam passando**

Run: `npm run test`
Expected: PASS (os 3 arquivos de teste existentes em `lib/*.test.ts` não têm relação com este componente).

- [ ] **Step 4: Commit**

```bash
git add catalogo/components/HeroDripEdge.tsx
git commit -m "feat: add HeroDripEdge component"
```

---

### Task 2: Criar `HeroFruitDecor`

**Files:**
- Create: `catalogo/components/HeroFruitDecor.tsx`

**Interfaces:**
- Produces: `<HeroFruitDecor side="left" | "right" src={string}? />`. Sem `src`, renderiza um SVG flat de morango embutido. Com `src`, renderiza `next/image` com esse caminho no lugar do SVG, preservando o mesmo tamanho/posicionamento — ponto de extensão para quando houver um asset de alta qualidade.

- [ ] **Step 1: Criar o componente**

Criar `catalogo/components/HeroFruitDecor.tsx`:

```tsx
import Image from "next/image";

type HeroFruitDecorProps = {
  side: "left" | "right";
  src?: string;
};

export function HeroFruitDecor({ side, src }: HeroFruitDecorProps) {
  return (
    <div
      aria-hidden="true"
      className={
        side === "left"
          ? "absolute top-2 left-2 z-0 h-12 w-12 opacity-80 sm:top-4 sm:left-6 sm:h-20 sm:w-20"
          : "absolute top-2 right-2 z-0 h-12 w-12 opacity-80 sm:top-4 sm:right-6 sm:h-20 sm:w-20"
      }
    >
      {src ? (
        <Image src={src} alt="" fill className="object-contain" />
      ) : (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path
            d="M32 20c10 0 18 8 18 20 0 12-8 20-18 20S14 52 14 40c0-12 8-20 18-20Z"
            fill="#E63946"
          />
          <path
            d="M32 20c-2-6 0-10 4-12"
            stroke="#2D6A4F"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="24" cy="34" r="2" fill="#FFE5E5" />
          <circle cx="34" cy="30" r="2" fill="#FFE5E5" />
          <circle cx="40" cy="42" r="2" fill="#FFE5E5" />
          <circle cx="26" cy="46" r="2" fill="#FFE5E5" />
        </svg>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar que o projeto builda**

Run: `npm run build`
Expected: PASS, sem erro de tipo (a prop `src` opcional e o branch do `next/image` precisam compilar mesmo sem uso ainda).

- [ ] **Step 3: Verificar que os testes existentes continuam passando**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add catalogo/components/HeroFruitDecor.tsx
git commit -m "feat: add HeroFruitDecor component"
```

---

### Task 3: Criar `HeroNav`

**Files:**
- Create: `catalogo/components/HeroNav.tsx`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` (`catalogo/lib/whatsapp.ts`), `WHATSAPP_NUMBER` (`catalogo/lib/config.ts`).
- Produces: `<HeroNav />`, componente sem props.

- [ ] **Step 1: Criar o componente**

Criar `catalogo/components/HeroNav.tsx`:

```tsx
import Image from "next/image";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/config";

export function HeroNav() {
  const url = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    "Olá! Quero ver o cardápio do Filinto."
  );

  return (
    <nav className="pointer-events-auto relative z-20 flex items-center justify-between px-4 py-3">
      <Image
        src="/logo-filinto.png"
        alt="Filinto Sorvetes"
        width={36}
        height={36}
        className="rounded-full"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/25 sm:px-4"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
        </svg>
        <span className="hidden sm:inline">Pedir no WhatsApp</span>
      </a>
    </nav>
  );
}
```

- [ ] **Step 2: Verificar que o projeto builda**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Verificar que os testes existentes continuam passando**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add catalogo/components/HeroNav.tsx
git commit -m "feat: add HeroNav component"
```

---

### Task 4: Compor os três componentes dentro de `Hero.tsx`

**Files:**
- Modify: `catalogo/components/Hero.tsx`

**Interfaces:**
- Consumes: `<HeroNav />` (Task 3), `<HeroFruitDecor side="left" | "right" />` (Task 2), `<HeroDripEdge />` (Task 1).
- Produces: `<Hero />` com a aparência final — splash intacta na fase `"intro"`, nav + frutas + borda derretendo aparecendo com fade assim que `phase` vira `"done"`.

- [ ] **Step 1: Reescrever o componente**

Substituir todo o conteúdo de `catalogo/components/Hero.tsx`:

```tsx
"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HeroNav } from "./HeroNav";
import { HeroFruitDecor } from "./HeroFruitDecor";
import { HeroDripEdge } from "./HeroDripEdge";

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
          : "relative bg-[#AC1214] px-4 py-16 text-center text-white"
      }
    >
      {!isIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0"
        >
          <HeroNav />
          <HeroFruitDecor side="left" />
          <HeroFruitDecor side="right" />
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
        className="relative z-10 mx-auto mb-4 h-[140px] w-[140px]"
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
        <h1 className="font-[family-name:var(--font-dancing-script)] text-4xl">
          Filinto Sorvetes
        </h1>
        <p className="mt-2 text-white/90">O sabor que refresca o seu dia</p>
      </motion.div>
    </motion.header>
  );
}
```

- [ ] **Step 2: Verificar que o projeto builda**

Run: `npm run build`
Expected: build termina sem erro de tipo/compilação.

- [ ] **Step 3: Verificar que os testes existentes continuam passando**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 4: Verificação manual no navegador**

Run: `npm run dev`, abrir `http://localhost:3000`.

Checklist em 375px de largura (DevTools → device toolbar):
- Ao carregar, a splash toca normalmente (tela vermelha → logo → texto → encolhe), sem nav/frutas/borda visíveis durante essa fase.
- Assim que a splash termina, nav bar (logo pequeno + botão de WhatsApp) aparece no topo do Hero com fade, sem quebrar linha nem cortar o botão.
- As duas decorações de fruta aparecem nos cantos superiores, sem cobrir o logo/título central.
- A borda "derretendo" aparece na base do Hero, fazendo a transição pro fundo branco da primeira seção de categoria.
- Clicar no botão "Pedir no WhatsApp" da nav abre o WhatsApp com a mensagem "Olá! Quero ver o cardápio do Filinto." para o número configurado.

Checklist em desktop (largura ampla):
- Nav, frutas e borda escalam proporcionalmente, sem elementos desproporcionais ou cortados.

Checklist adicional:
- Recarregar a página: splash toca de novo (não é pulada), comportamento idêntico ao de antes desta mudança.
- Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → "reduce", recarregar: Hero já nasce em `"done"` (sem splash), nav/frutas/borda aparecem direto, sem fade.

- [ ] **Step 5: Commit**

```bash
git add catalogo/components/Hero.tsx
git commit -m "feat: compose HeroNav, HeroFruitDecor and HeroDripEdge into Hero"
```
