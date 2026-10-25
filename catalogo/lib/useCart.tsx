"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ItemCarrinho,
  addItem,
  quantidadeTotal,
  setQuantidade as setQuantidadePuro,
  temSoConsulta,
  totalCarrinho,
} from "./pedidos-store";

const STORAGE_KEY = "filinto-carrinho-v1";

type CartValue = {
  itens: ItemCarrinho[];
  add(produto: { id: string; nome: string; preco: number }): void;
  setQuantidade(produtoId: string, q: number): void;
  limpar(): void;
  quantidade: number;
  total: number;
  soConsulta: boolean;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(parsed)) setItens(parsed as ItemCarrinho[]);
    } catch {
      // storage corrompido: começa vazio
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens, carregado]);

  const value: CartValue = {
    itens,
    add: (p) => setItens((s) => addItem(s, p)),
    setQuantidade: (id, q) => setItens((s) => setQuantidadePuro(s, id, q)),
    limpar: () => setItens([]),
    quantidade: quantidadeTotal(itens),
    total: totalCarrinho(itens),
    soConsulta: temSoConsulta(itens),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
