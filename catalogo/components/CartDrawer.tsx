"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { validarCliente } from "@/lib/pedidos-store";
import { useCart } from "@/lib/useCart";
import { usePedidos } from "@/lib/usePedidos";
import { buildPedidoMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = { aberto: boolean; onFechar: () => void };

const MAX_QUANTIDADE = 99;
const campo =
  "min-h-11 w-full rounded-xl border border-black/20 px-3 py-2 text-base focus:border-brand focus:outline-none";
const passo =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg font-semibold text-white transition duration-200 hover:bg-brand-dark active:scale-[0.97] disabled:opacity-40 disabled:hover:bg-transparent";

export function CartDrawer({ aberto, onFechar }: Props) {
  return (
    <AnimatePresence>{aberto && <Gaveta key="gaveta" onFechar={onFechar} />}</AnimatePresence>
  );
}

function Gaveta({ onFechar }: { onFechar: () => void }) {
  const { itens, setQuantidade, limpar, total, soConsulta } = useCart();
  const { criar } = usePedidos();
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacao, setObservacao] = useState("");
  const [erros, setErros] = useState<{ nome?: string; telefone?: string }>({});
  const [erroEnvio, setErroEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const painel = useRef<HTMLDivElement>(null);

  // onFechar must be stable (CartBar uses useCallback) or focus would be re-stolen each render.
  useEffect(() => {
    painel.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onFechar]);

  // Cart emptied on step 1 (e.g. via stepper): nothing left to show.
  const vazio = etapa !== 3 && itens.length === 0;
  useEffect(() => {
    if (vazio) onFechar();
  }, [vazio, onFechar]);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    const v = validarCliente({ nome, telefone });
    if (!v.ok) {
      setErros(v.erros);
      return;
    }
    setErros({});
    setEnviando(true);
    try {
      const pedido = criar(itens, v.cliente, observacao.trim() || undefined);
      limpar();
      setPedidoId(pedido.id);
      setEtapa(3);
    } catch {
      setErroEnvio("Não foi possível enviar o pedido. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onFechar}
    >
      <motion.div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        tabIndex={-1}
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl outline-none sm:rounded-3xl"
      >
        {etapa === 1 && (
          <>
            <h2 className="text-lg font-bold">Seu carrinho</h2>
            <ul className="flex flex-col gap-3">
              {itens.map((i) => (
                <li key={i.produtoId} className="flex flex-col gap-2 border-b border-black/10 pb-3">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="font-medium">{i.nome}</span>
                    <span className="shrink-0">
                      {formatPrice(i.preco * i.quantidade)}
                    </span>
                  </div>
                  <div className="flex w-36 items-center justify-between rounded-full bg-brand">
                    <button
                      type="button"
                      aria-label={`Diminuir quantidade de ${i.nome}`}
                      onClick={() => setQuantidade(i.produtoId, i.quantidade - 1)}
                      className={passo}
                    >
                      −
                    </button>
                    <span aria-live="polite" className="text-sm font-semibold text-white">
                      {i.quantidade}
                    </span>
                    <button
                      type="button"
                      aria-label={`Aumentar quantidade de ${i.nome}`}
                      disabled={i.quantidade >= MAX_QUANTIDADE}
                      onClick={() => setQuantidade(i.produtoId, i.quantidade + 1)}
                      className={passo}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="flex justify-between font-bold">
              <span>Total</span>
              <span>{soConsulta ? "Sob consulta" : formatPrice(total)}</span>
            </p>
            <button
              type="button"
              onClick={() => setEtapa(2)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark active:scale-[0.97]"
            >
              Finalizar pedido
            </button>
          </>
        )}

        {etapa === 2 && (
          <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Seus dados</h2>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Nome
              <input
                className={campo}
                value={nome}
                autoComplete="name"
                aria-invalid={!!erros.nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {erros.nome && <span className="text-sm text-red-700">{erros.nome}</span>}
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Telefone
              <input
                className={campo}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={telefone}
                aria-invalid={!!erros.telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              {erros.telefone && <span className="text-sm text-red-700">{erros.telefone}</span>}
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Observação (opcional)
              <textarea
                className={campo}
                rows={3}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </label>
            {erroEnvio && (
              <p role="alert" className="text-sm text-red-700">
                {erroEnvio}
              </p>
            )}
            <button
              type="submit"
              disabled={enviando}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark active:scale-[0.97] disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Enviar pedido"}
            </button>
            <button
              type="button"
              onClick={() => setEtapa(1)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-black/20 px-4 py-3 text-sm font-semibold"
            >
              Voltar
            </button>
          </form>
        )}

        {etapa === 3 && pedidoId !== null && (
          <>
            <h2 className="text-lg font-bold">Pedido #{pedidoId} enviado</h2>
            <p className="text-sm">Recebemos seu pedido. Acompanhe pelo WhatsApp.</p>
            <a
              href={buildWhatsAppUrl(WHATSAPP_NUMBER, buildPedidoMessage(pedidoId))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark active:scale-[0.97]"
            >
              Acompanhar pelo WhatsApp
            </a>
            <button
              type="button"
              onClick={onFechar}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-black/20 px-4 py-3 text-sm font-semibold"
            >
              Fechar
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
