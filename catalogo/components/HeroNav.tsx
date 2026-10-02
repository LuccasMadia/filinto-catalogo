import Image from "next/image";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/config";

export function HeroNav() {
  const url = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    "Olá! Quero ver o cardápio do Filinto."
  );

  return (
    <nav className="pointer-events-auto relative z-20 flex items-center justify-between px-4 py-3">
      <Image
        src="/logo-filinto.png"
        alt="Filinto Sorvetes"
        width={36}
        height={36}
        className="rounded-full"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/25 sm:px-4"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
        </svg>
        <span className="hidden sm:inline">Pedir no WhatsApp</span>
      </a>
    </nav>
  );
}
