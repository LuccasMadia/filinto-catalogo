"use client";

import { useCallback, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/useCart";

export function CartBar() {
  const { quantidade, total, soConsulta } = useCart();
  const [aberto, setAberto] = useState(false);
  const fechar = useCallback(() => setAberto(false), []);

  return (
    <>
      {quantidade > 0 && !aberto && (
        // right-20 leaves room for the floating WhatsApp button on mobile
        <div className="fixed bottom-4 left-4 right-20 z-40 sm:left-auto sm:right-24 sm:w-80">
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-brand-dark active:scale-[0.97]"
          >
            Ver carrinho ({quantidade} · {soConsulta ? "Sob consulta" : formatPrice(total)})
          </button>
        </div>
      )}
      {/* Drawer stays mounted-by-state so the confirmation survives the cart being emptied */}
      <CartDrawer aberto={aberto} onFechar={fechar} />
    </>
  );
}
