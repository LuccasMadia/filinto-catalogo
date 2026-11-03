import { describe, it, expect } from "vitest";
import { validarNome } from "./validar-nome";

describe("validarNome", () => {
  it("trims the name", () => {
    expect(validarNome("  Creme 1,8L  ")).toBe("Creme 1,8L");
  });
  it("rejects empty or blank names", () => {
    expect(() => validarNome("")).toThrow();
    expect(() => validarNome("   ")).toThrow();
  });
  it("rejects names over 80 characters", () => {
    expect(() => validarNome("a".repeat(81))).toThrow();
  });
  it("accepts exactly 80 characters", () => {
    expect(validarNome("a".repeat(80))).toHaveLength(80);
  });
});
