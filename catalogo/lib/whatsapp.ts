export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildPedidoMessage(id: number): string {
  return `Olá! Meu pedido é o #${id}.`;
}
