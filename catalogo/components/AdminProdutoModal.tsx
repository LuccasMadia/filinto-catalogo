"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { NovoProduto, Produto } from "@/lib/catalogo-store";

// Guarda a foto como data URL no localStorage (~5 MB no total), então reduz antes.
async function reduzirImagem(file: File, lado = 600): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, lado / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}

type AdminProdutoModalProps = {
  categoriaId: string;
  produto?: Produto;
  onClose: () => void;
  onSubmit: (dados: NovoProduto) => void;
};

export function AdminProdutoModal({
  categoriaId,
  produto,
  onClose,
  onSubmit,
}: AdminProdutoModalProps) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [imagem, setImagem] = useState(produto?.imagem);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }

    onSubmit({
      categoriaId,
      nome: nome.trim(),
      imagem,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={produto ? "Editar produto" : "Novo produto"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          {produto ? "Editar produto" : "Novo produto"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-neutral-700">
            Nome
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              autoFocus
            />
          </label>
          <label className="text-sm text-neutral-700">
            Foto
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  setImagem(await reduzirImagem(file));
                  setErro(null);
                } catch {
                  setErro("Não foi possível ler essa imagem.");
                }
              }}
              className="mt-1 w-full text-sm"
            />
          </label>
          {imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagem} alt="" className="h-24 w-24 rounded-lg object-cover" />
          ) : null}
          {erro ? <p className="text-sm text-red-600">{erro}</p> : null}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm text-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
