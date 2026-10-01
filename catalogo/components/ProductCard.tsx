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
