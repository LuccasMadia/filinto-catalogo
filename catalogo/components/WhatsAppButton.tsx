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
