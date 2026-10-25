"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Cliente,
  ItemCarrinho,
  Pedido,
  StatusPedido,
  atualizarStatus as atualizarStatusPuro,
  criarPedido,
} from "./pedidos-store";

const STORAGE_KEY = "filinto-pedidos-v1";

function ler(): Pedido[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as Pedido[]) : [];
  } catch {
    return [];
  }
}

function gravar(pedidos: Pedido[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    setPedidos(ler());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setPedidos(ler());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Lê o storage atual antes de cada escrita: outra aba pode ter criado pedidos.
  const criar = useCallback((itens: ItemCarrinho[], cliente: Cliente, observacao?: string): Pedido => {
    const { pedidos: novos, pedido } = criarPedido(ler(), itens, cliente, observacao, new Date());
    gravar(novos);
    setPedidos(novos);
    return pedido;
  }, []);

  const atualizarStatus = useCallback((id: number, status: StatusPedido) => {
    const novos = atualizarStatusPuro(ler(), id, status);
    gravar(novos);
    setPedidos(novos);
  }, []);

  return { pedidos, criar, atualizarStatus };
}
