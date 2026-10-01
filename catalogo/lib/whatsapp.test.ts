import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl } from "./whatsapp";

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me URL with the message URL-encoded", () => {
    const url = buildWhatsAppUrl(
      "5511999999999",
      "Olá! Quero pedir: Casquinha de Chocolate"
    );
    expect(url).toBe(
      "https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20pedir%3A%20Casquinha%20de%20Chocolate"
    );
  });

  it("works with a simple ASCII message", () => {
    const url = buildWhatsAppUrl("5511999999999", "Hello world");
    expect(url).toBe("https://wa.me/5511999999999?text=Hello%20world");
  });
});
