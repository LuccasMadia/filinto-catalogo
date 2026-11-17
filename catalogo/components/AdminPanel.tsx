"use client";

import { useState } from "react";
import type { CatalogoState } from "@/lib/catalogo-store";
import { apenasVisiveis } from "@/lib/catalogo-store";
import { logout } from "@/app/admin/login/actions";
import { AdminCategoriaCard } from "./AdminCategoriaCard";

export function AdminPanel({ categorias, produtos }: CatalogoState) {
  const [exportando, setExportando] = useState(false);
  const [erroPdf, setErroPdf] = useState(false);

  async function handleExportarPdf() {
    setExportando(true);
    setErroPdf(false);
    try {
      const { buildCatalogoPdfBlob } = await import("@/lib/pdf/catalogo-pdf");
      const blob = await buildCatalogoPdfBlob(apenasVisiveis({ categorias, produtos }));
      const url = URL.createObjectURL(blob);
      const data = new Date().toISOString().slice(0, 10);
      const link = document.createElement("a");
      link.href = url;
      link.download = `catalogo-filinto-${data}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setErroPdf(true);
    } finally {
      setExportando(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-dancing-script)] text-4xl leading-none text-brand">
            Painel Filinto
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Marque o que está esgotado, corrija nomes e oculte categorias.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center rounded-lg border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Ver o site
          </a>
          <button
            type="button"
            onClick={handleExportarPdf}
            disabled={exportando}
            className="min-h-10 rounded-lg bg-brand px-3 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {exportando ? "Gerando..." : "Exportar PDF"}
          </button>
          <form action={logout}>
            <button
              type="submit"
              className="min-h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      {erroPdf ? (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          Não foi possível gerar o PDF. Tente novamente.
        </p>
      ) : null}
      <div className="flex flex-col gap-6">
        {categorias.map((categoria) => (
          <AdminCategoriaCard
            key={categoria.id}
            categoria={categoria}
            produtos={produtos.filter((p) => p.categoriaId === categoria.id)}
          />
        ))}
      </div>
    </main>
  );
}
