"use client";

import { useState, type FormEvent } from "react";
import { useCatalogStore } from "@/lib/useCatalogStore";
import { logout } from "@/app/admin/login/actions";
import { AdminCategoriaCard } from "./AdminCategoriaCard";

export function AdminPanel() {
  const store = useCatalogStore();
  const [novaCategoria, setNovaCategoria] = useState("");
  const [exportando, setExportando] = useState(false);
  const [erroPdf, setErroPdf] = useState(false);

  function handleAddCategoria(event: FormEvent) {
    event.preventDefault();
    if (!novaCategoria.trim()) return;
    store.addCategoria(novaCategoria.trim());
    setNovaCategoria("");
  }

  async function handleExportarPdf() {
    setExportando(true);
    setErroPdf(false);
    try {
      const { buildCatalogoPdfBlob } = await import("@/lib/pdf/catalogo-pdf");
      const blob = await buildCatalogoPdfBlob({
        categorias: store.categorias,
        produtos: store.produtos,
      });
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-dancing-script)] text-3xl text-brand">
          Painel Filinto
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportarPdf}
            disabled={exportando}
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {exportando ? "Gerando..." : "Exportar PDF"}
          </button>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700"
            >
              Sair
            </button>
          </form>
        </div>
      </div>

      {erroPdf ? (
        <p role="alert" className="mb-4 text-sm text-red-700">
          Não foi possível gerar o PDF. Tente novamente.
        </p>
      ) : null}
      <p className="mb-4 text-sm text-neutral-600">
        As edições ficam salvas só neste navegador.
      </p>

      <form onSubmit={handleAddCategoria} className="mb-6 flex gap-2">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
        >
          Adicionar
        </button>
      </form>

      <div className="flex flex-col gap-6">
        {store.categorias.map((categoria, index) => (
          <AdminCategoriaCard
            key={categoria.id}
            store={store}
            categoria={categoria}
            produtos={store.produtos.filter((p) => p.categoriaId === categoria.id)}
            isFirst={index === 0}
            isLast={index === store.categorias.length - 1}
          />
        ))}
      </div>
    </main>
  );
}
