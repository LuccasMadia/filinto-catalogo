import { WhatsAppButton } from "./WhatsAppButton";

export function FloatingWhatsAppButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <WhatsAppButton
        message="Olá! Quero ver o cardápio do Filinto."
        className="shadow-lg"
      >
        Pedir no WhatsApp
      </WhatsAppButton>
    </div>
  );
}
