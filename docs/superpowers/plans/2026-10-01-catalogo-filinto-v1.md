# Catálogo Filinto Sorvetes v1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, mobile-first Next.js catalog page for Filinto Sorvetes that Lucca can open on a phone and present to the client for visual approval — no backend, no real product photos yet.

**Architecture:** Single Next.js App Router page (`catalogo/app/page.tsx`) assembled from small presentational components (Hero, CategorySection, ProductCard, Footer, floating WhatsApp button), backed by a local typed product array shaped like the future Supabase table. Two pure utility functions (price formatting, WhatsApp link building) are the only logic, and are the only pieces covered by automated tests — everything else is verified visually in the browser, per the design spec's "static mockup" goal.

**Tech Stack:** Next.js (App Router, TypeScript) + Tailwind CSS (utility classes with arbitrary values — no `tailwind.config` edits needed), `next/font/google` (Dancing Script), Vitest for unit tests, npm.

## Global Constraints

- Brand color (exact, extracted from `logo filinto.png`): `#AC1214`. Use this literal hex everywhere a brand color is needed — do not approximate.
- Script font: Dancing Script (Google Font), used only for the logo/title area and category headings.
- Mobile-first: components must read correctly at a 375px-wide viewport before desktop is considered.
- No backend, no Supabase, no real product photos in this plan — product images use a neutral gray placeholder with a simple icon.
- WhatsApp CTA format: tapping "Pedir no WhatsApp" opens `https://wa.me/<numero>?text=<mensagem>` with the message `Olá! Quero pedir: [Nome do produto]` (product-level) or `Olá! Quero ver o cardápio do Filinto.` (hero/floating button).
- The Next.js app lives in `catalogo/` at the repo root (repo root also holds `docs/`, `Referencias pinterest/`, `logo filinto.png` — keep those separate from app code).
- The repo root already has its own git repo (initialized during brainstorming) — the Next.js scaffold must NOT create a nested `.git`.

---

### Task 1: Scaffold the Next.js app

**Files:**
- Create: `catalogo/` (entire Next.js project, via `create-next-app`)
- Create: `catalogo/vitest.config.ts`
- Modify: `catalogo/package.json` (add `test` script, add `vitest` devDependency)

**Interfaces:**
- Produces: a working `catalogo/` Next.js app with `npm run dev`, `npm run build`, and `npm run test` all functional. Later tasks assume `catalogo/app`, `catalogo/lib`, `catalogo/components` exist as standard Next.js App Router locations (the latter two are created fresh in Task 2+).

- [ ] **Step 1: Run create-next-app**

Run from the repo root:

```bash
npx --yes create-next-app@latest catalogo --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --no-turbopack --use-npm --disable-git
```

Expected: a new `catalogo/` directory is created with `app/`, `public/`, `package.json`, `tailwind.config.ts` or equivalent, `tsconfig.json`. No `.git` directory is created inside `catalogo/` (because of `--disable-git`).

- [ ] **Step 2: Verify the dev server boots**

```bash
cd catalogo && npm run build
```

Expected: build completes with `✓ Compiled successfully` and no type errors (the default `create-next-app` starter page builds cleanly out of the box).

- [ ] **Step 3: Install Vitest**

```bash
cd catalogo && npm install -D vitest
```

Expected: `vitest` added to `package.json` devDependencies.

- [ ] **Step 4: Add Vitest config**

Create `catalogo/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 5: Add the test script**

Edit `catalogo/package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 6: Copy the brand logo into the app**

```bash
cp "logo filinto.png" catalogo/public/logo-filinto.png
```

Expected: `catalogo/public/logo-filinto.png` exists.

- [ ] **Step 7: Commit**

```bash
git add catalogo package.json 2>/dev/null; git add catalogo
git commit -m "chore: scaffold Next.js app with Tailwind and Vitest"
```

---

### Task 2: Price formatting utility (TDD)

**Files:**
- Create: `catalogo/lib/format.ts`
- Test: `catalogo/lib/format.test.ts`

**Interfaces:**
- Produces: `formatPrice(value: number): string` — e.g. `formatPrice(12.5) === "R$ 12,50"`. Used by `ProductCard` (Task 6).

- [ ] **Step 1: Write the failing test**

Create `catalogo/lib/format.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats a value with two decimal places and a comma", () => {
    expect(formatPrice(12.5)).toBe("R$ 12,50");
  });

  it("formats a whole number with trailing zeros", () => {
    expect(formatPrice(7)).toBe("R$ 7,00");
  });

  it("rounds to two decimal places", () => {
    expect(formatPrice(9.999)).toBe("R$ 10,00");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd catalogo && npx vitest run lib/format.test.ts
```

Expected: FAIL — `Cannot find module './format'` (file doesn't exist yet).

- [ ] **Step 3: Write minimal implementation**

Create `catalogo/lib/format.ts`:

```ts
export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd catalogo && npx vitest run lib/format.test.ts
```

Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add catalogo/lib/format.ts catalogo/lib/format.test.ts
git commit -m "feat: add formatPrice utility"
```

---

### Task 3: WhatsApp link builder (TDD)

**Files:**
- Create: `catalogo/lib/whatsapp.ts`
- Test: `catalogo/lib/whatsapp.test.ts`

**Interfaces:**
- Produces: `buildWhatsAppUrl(phone: string, message: string): string`. Used by `WhatsAppButton` (Task 5).

- [ ] **Step 1: Write the failing test**

Create `catalogo/lib/whatsapp.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl } from "./whatsapp";

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me URL with the message URL-encoded", () => {
    const url = buildWhatsAppUrl(
      "5511999999999",
      "Olá! Quero pedir: Casquinha de Chocolate"
    );
    expect(url).toBe(
      "https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20pedir%3A%20Casquinha%20de%20Chocolate"
    );
  });

  it("works with a simple ASCII message", () => {
    const url = buildWhatsAppUrl("5511999999999", "Hello world");
    expect(url).toBe("https://wa.me/5511999999999?text=Hello%20world");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd catalogo && npx vitest run lib/whatsapp.test.ts
```

Expected: FAIL — `Cannot find module './whatsapp'`.

- [ ] **Step 3: Write minimal implementation**

Create `catalogo/lib/whatsapp.ts`:

```ts
export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd catalogo && npx vitest run lib/whatsapp.test.ts
```

Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add catalogo/lib/whatsapp.ts catalogo/lib/whatsapp.test.ts
git commit -m "feat: add buildWhatsAppUrl utility"
```

---

### Task 4: Product data model and seed data (TDD)

**Files:**
- Create: `catalogo/lib/produtos.ts`
- Test: `catalogo/lib/produtos.test.ts`

**Interfaces:**
- Produces:
  - `type Categoria = "sorvetes" | "acai" | "milkshakes"`
  - `type Produto = { id: string; nome: string; categoria: Categoria; preco: number; descricao?: string; imagem?: string }`
  - `CATEGORIAS: { id: Categoria; titulo: string }[]`
  - `produtos: Produto[]`
  - Consumed by `CategorySection` and `ProductCard` (Tasks 6-7) and the homepage (Task 10).

- [ ] **Step 1: Write the failing test**

Create `catalogo/lib/produtos.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { produtos, CATEGORIAS } from "./produtos";

describe("produtos", () => {
  it("has no duplicate ids", () => {
    const ids = produtos.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least 4 products in every declared category", () => {
    for (const categoria of CATEGORIAS) {
      const count = produtos.filter((p) => p.categoria === categoria.id).length;
      expect(count).toBeGreaterThanOrEqual(4);
    }
  });

  it("has a positive price for every product", () => {
    for (const produto of produtos) {
      expect(produto.preco).toBeGreaterThan(0);
    }
  });

  it("only uses categories declared in CATEGORIAS", () => {
    const validIds = CATEGORIAS.map((c) => c.id);
    for (const produto of produtos) {
      expect(validIds).toContain(produto.categoria);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd catalogo && npx vitest run lib/produtos.test.ts
```

Expected: FAIL — `Cannot find module './produtos'`.

- [ ] **Step 3: Write minimal implementation**

Create `catalogo/lib/produtos.ts`:

```ts
export type Categoria = "sorvetes" | "acai" | "milkshakes";

export type Produto = {
  id: string;
  nome: string;
  categoria: Categoria;
  preco: number;
  descricao?: string;
  imagem?: string;
};

export const CATEGORIAS: { id: Categoria; titulo: string }[] = [
  { id: "sorvetes", titulo: "Sorvetes" },
  { id: "acai", titulo: "Açaí" },
  { id: "milkshakes", titulo: "Milkshakes" },
];

export const produtos: Produto[] = [
  { id: "sorv-chocolate", nome: "Casquinha de Chocolate", categoria: "sorvetes", preco: 8 },
  { id: "sorv-morango", nome: "Casquinha de Morango", categoria: "sorvetes", preco: 8 },
  { id: "sorv-creme", nome: "Casquinha de Creme", categoria: "sorvetes", preco: 8 },
  { id: "sorv-flocos", nome: "Casquinha de Flocos", categoria: "sorvetes", preco: 8 },
  { id: "sorv-napolitano", nome: "Pote Napolitano 500ml", categoria: "sorvetes", preco: 22 },

  { id: "acai-300", nome: "Açaí 300ml", categoria: "acai", preco: 14, descricao: "Com granola e banana" },
  { id: "acai-500", nome: "Açaí 500ml", categoria: "acai", preco: 19, descricao: "Com granola e banana" },
  { id: "acai-700", nome: "Açaí 700ml", categoria: "acai", preco: 24, descricao: "Com granola e banana" },
  { id: "acai-combo", nome: "Combo Açaí + Leite em pó", categoria: "acai", preco: 21 },

  { id: "milk-chocolate", nome: "Milkshake de Chocolate", categoria: "milkshakes", preco: 16 },
  { id: "milk-morango", nome: "Milkshake de Morango", categoria: "milkshakes", preco: 16 },
  { id: "milk-ovomaltine", nome: "Milkshake de Ovomaltine", categoria: "milkshakes", preco: 18 },
  { id: "milk-baunilha", nome: "Milkshake de Baunilha", categoria: "milkshakes", preco: 15 },
];
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd catalogo && npx vitest run lib/produtos.test.ts
```

Expected: PASS — all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add catalogo/lib/produtos.ts catalogo/lib/produtos.test.ts
git commit -m "feat: add product data model and seed data"
```

---

### Task 5: WhatsApp number placeholder config

**Files:**
- Create: `catalogo/lib/config.ts`

**Interfaces:**
- Produces: `WHATSAPP_NUMBER: string`. Consumed by `WhatsAppButton` (Task 6).

- [ ] **Step 1: Create the config file**

Create `catalogo/lib/config.ts`:

```ts
// Número de WhatsApp placeholder — trocar pelo número real do Filinto
// (formato: código do país + DDD + número, só dígitos, ex: "5511999999999")
// antes de apresentar/publicar para o cliente.
export const WHATSAPP_NUMBER = "5500000000000";
```

- [ ] **Step 2: Commit**

```bash
git add catalogo/lib/config.ts
git commit -m "feat: add WhatsApp number placeholder config"
```

---

### Task 6: WhatsAppButton component

**Files:**
- Create: `catalogo/components/WhatsAppButton.tsx`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` (Task 3, `catalogo/lib/whatsapp.ts`), `WHATSAPP_NUMBER` (Task 5, `catalogo/lib/config.ts`)
- Produces: `WhatsAppButton({ message, children, className? })` — a React component rendering an `<a>` styled as a pill button. Consumed by `ProductCard` (Task 7) and `FloatingWhatsAppButton` (Task 9).

- [ ] **Step 1: Create the component**

Create `catalogo/components/WhatsAppButton.tsx`:

```tsx
import type { ReactNode } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/config";

type WhatsAppButtonProps = {
  message: string;
  children: ReactNode;
  className?: string;
};

export function WhatsAppButton({ message, children, className = "" }: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(WHATSAPP_NUMBER, message);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block rounded-full bg-[#AC1214] px-4 py-2 text-center text-sm font-semibold text-white transition hover:brightness-110 ${className}`}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd catalogo && npm run build
```

Expected: build fails with "module not found" for `@/components/WhatsAppButton` only if something already imports it (nothing does yet) — otherwise it should build clean since an unused component file doesn't break the build. Confirm: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add catalogo/components/WhatsAppButton.tsx
git commit -m "feat: add WhatsAppButton component"
```

---

### Task 7: ProductImagePlaceholder and ProductCard components

**Files:**
- Create: `catalogo/components/ProductImagePlaceholder.tsx`
- Create: `catalogo/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `Produto` type (Task 4), `formatPrice` (Task 2), `WhatsAppButton` (Task 6)
- Produces: `ProductCard({ produto: Produto })`. Consumed by `CategorySection` (Task 8).

- [ ] **Step 1: Create the placeholder image component**

Create `catalogo/components/ProductImagePlaceholder.tsx`:

```tsx
export function ProductImagePlaceholder() {
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-neutral-200">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-10 w-10 text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10a4 4 0 1 1 8 0c1.5 0 2.5 1 2.5 2.3 0 1.2-.9 2.2-2.1 2.3L12 21l-4.4-6.4C6.4 14.5 5.5 13.5 5.5 12.3 5.5 11 6.5 10 8 10Z"
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Create the product card component**

Create `catalogo/components/ProductCard.tsx`:

```tsx
import type { Produto } from "@/lib/produtos";
import { formatPrice } from "@/lib/format";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { WhatsAppButton } from "./WhatsAppButton";

export function ProductCard({ produto }: { produto: Produto }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 p-3">
      <ProductImagePlaceholder />
      <h3 className="font-semibold text-neutral-900">{produto.nome}</h3>
      {produto.descricao ? (
        <p className="text-sm text-neutral-500">{produto.descricao}</p>
      ) : null}
      <span className="font-bold text-[#AC1214]">{formatPrice(produto.preco)}</span>
      <WhatsAppButton
        message={`Olá! Quero pedir: ${produto.nome}`}
        className="mt-1"
      >
        Pedir no WhatsApp
      </WhatsAppButton>
    </div>
  );
}
```

- [ ] **Step 3: Verify it compiles**

```bash
cd catalogo && npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add catalogo/components/ProductImagePlaceholder.tsx catalogo/components/ProductCard.tsx
git commit -m "feat: add ProductCard and ProductImagePlaceholder components"
```

---

### Task 8: CategorySection component

**Files:**
- Create: `catalogo/components/CategorySection.tsx`

**Interfaces:**
- Consumes: `Produto` type (Task 4), `ProductCard` (Task 7)
- Produces: `CategorySection({ titulo: string, produtos: Produto[] })`. Consumed by the homepage (Task 10).

- [ ] **Step 1: Create the component**

Create `catalogo/components/CategorySection.tsx`:

```tsx
import type { Produto } from "@/lib/produtos";
import { ProductCard } from "./ProductCard";

type CategorySectionProps = {
  titulo: string;
  produtos: Produto[];
};

export function CategorySection({ titulo, produtos }: CategorySectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="mb-6 font-[family-name:var(--font-dancing-script)] text-3xl text-[#AC1214]">
        {titulo}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd catalogo && npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add catalogo/components/CategorySection.tsx
git commit -m "feat: add CategorySection component"
```

---

### Task 9: Hero, Footer, and FloatingWhatsAppButton components

**Files:**
- Create: `catalogo/components/Hero.tsx`
- Create: `catalogo/components/Footer.tsx`
- Create: `catalogo/components/FloatingWhatsAppButton.tsx`

**Interfaces:**
- Consumes: `WhatsAppButton` (Task 6). `Hero` and `Footer` reference `/logo-filinto.png` (Task 1, `catalogo/public/logo-filinto.png`) and the CSS variable `--font-dancing-script` (set up in Task 10's `layout.tsx`).
- Produces: `Hero()`, `Footer()`, `FloatingWhatsAppButton()`. All consumed by the homepage (Task 10).

- [ ] **Step 1: Create the Hero component**

Create `catalogo/components/Hero.tsx`:

```tsx
import Image from "next/image";

export function Hero() {
  return (
    <header className="bg-[#AC1214] px-4 py-16 text-center text-white">
      <Image
        src="/logo-filinto.png"
        alt="Filinto Sorvetes"
        width={140}
        height={140}
        className="mx-auto mb-4 rounded-full"
        priority
      />
      <h1 className="font-[family-name:var(--font-dancing-script)] text-4xl">
        Filinto Sorvetes
      </h1>
      <p className="mt-2 text-white/90">O sabor que refresca o seu dia</p>
    </header>
  );
}
```

- [ ] **Step 2: Create the Footer component**

Create `catalogo/components/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="bg-neutral-900 px-4 py-8 text-center text-sm text-neutral-300">
      <p className="font-[family-name:var(--font-dancing-script)] text-xl text-white">
        Filinto Sorvetes
      </p>
      <p className="mt-2">Endereço e horário: em breve</p>
      <p className="mt-1">WhatsApp · Instagram</p>
    </footer>
  );
}
```

- [ ] **Step 3: Create the FloatingWhatsAppButton component**

Create `catalogo/components/FloatingWhatsAppButton.tsx`:

```tsx
import { WhatsAppButton } from "./WhatsAppButton";

export function FloatingWhatsAppButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <WhatsAppButton
        message="Olá! Quero ver o cardápio do Filinto."
        className="shadow-lg"
      >
        Pedir no WhatsApp
      </WhatsAppButton>
    </div>
  );
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd catalogo && npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
git add catalogo/components/Hero.tsx catalogo/components/Footer.tsx catalogo/components/FloatingWhatsAppButton.tsx
git commit -m "feat: add Hero, Footer, and FloatingWhatsAppButton components"
```

---

### Task 10: Assemble the homepage and verify in the browser

**Files:**
- Modify: `catalogo/app/layout.tsx`
- Modify: `catalogo/app/page.tsx`

**Interfaces:**
- Consumes: everything from Tasks 1-9 (`Hero`, `CategorySection`, `Footer`, `FloatingWhatsAppButton`, `produtos`, `CATEGORIAS`).
- Produces: the finished page at `/`. Nothing downstream depends on this task — it's the final assembly.

- [ ] **Step 1: Wire up the Dancing Script font in the root layout**

Replace the contents of `catalogo/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

export const metadata: Metadata = {
  title: "Filinto Sorvetes — Cardápio",
  description: "Catálogo digital do Filinto Sorvetes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${dancingScript.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Replace the homepage**

Replace the contents of `catalogo/app/page.tsx`:

```tsx
import { Hero } from "@/components/Hero";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { produtos, CATEGORIAS } from "@/lib/produtos";

export default function Home() {
  return (
    <main>
      <Hero />
      {CATEGORIAS.map((categoria) => (
        <CategorySection
          key={categoria.id}
          titulo={categoria.titulo}
          produtos={produtos.filter((p) => p.categoria === categoria.id)}
        />
      ))}
      <Footer />
      <FloatingWhatsAppButton />
    </main>
  );
}
```

- [ ] **Step 3: Run the full test suite**

```bash
cd catalogo && npm run test
```

Expected: PASS — all tests from Tasks 2-4 (9 tests total) green.

- [ ] **Step 4: Build and start the app**

```bash
cd catalogo && npm run build && npm run start
```

Expected: `✓ Compiled successfully`, server starts on `http://localhost:3000`.

- [ ] **Step 5: Visually verify in the browser**

Open `http://localhost:3000` in a browser (use the claude-in-chrome tools if available, otherwise ask Lucca to check). Confirm, at a 375px-wide (mobile) viewport first, then desktop:
- Hero shows the red (`#AC1214`) background, the Filinto logo, and the Dancing Script title/slogan.
- Three category sections render in order: Sorvetes, Açaí, Milkshakes, each with its own Dancing Script heading.
- Each product card shows a gray placeholder image, product name, price in `R$ X,XX` format, and a red "Pedir no WhatsApp" button.
- A floating "Pedir no WhatsApp" button stays fixed in the bottom-right corner while scrolling through all sections.
- Clicking any WhatsApp button opens (or attempts to open) `https://wa.me/...` with the expected pre-filled message.
- Footer shows the Filinto name, placeholder address/hours text, and WhatsApp/Instagram labels.

Fix any visual issues found before proceeding.

- [ ] **Step 6: Stop the server and commit**

```bash
cd catalogo && git add app/layout.tsx app/page.tsx 2>/dev/null
git add catalogo/app/layout.tsx catalogo/app/page.tsx
git commit -m "feat: assemble Filinto catalog homepage"
```

---

## Self-Review Notes

- **Spec coverage:** hero+brand (Task 9/10), category sections (Task 8/10), product cards with placeholder image/price/WhatsApp CTA (Task 7), footer (Task 9), floating WhatsApp button (Task 9), local typed product data shaped for future Supabase swap (Task 4), brand red `#AC1214` and Dancing Script (Tasks 7-10), mobile-first grid (Task 8), out-of-scope items (no real photos, no Supabase, no cart) — none of the tasks introduce them. All spec sections are covered.
- **Placeholder scan:** no TBD/TODO left in code; the only intentional placeholder is `WHATSAPP_NUMBER` (Task 5), which is explicitly documented as needing a real number before client presentation — flagged, not forgotten.
- **Type consistency:** `Produto`/`Categoria` (Task 4) are used identically in `ProductCard` (Task 7) and `CategorySection` (Task 8); `WhatsAppButton`'s `{ message, children, className? }` signature (Task 6) matches every call site in Tasks 7 and 9.
