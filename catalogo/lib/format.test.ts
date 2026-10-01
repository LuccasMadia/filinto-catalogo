import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats a value with two decimal places and a comma", () => {
    expect(formatPrice(12.5)).toBe("R$ 12,50");
  });

  it("formats a whole number with trailing zeros", () => {
    expect(formatPrice(7)).toBe("R$ 7,00");
  });

  it("rounds to two decimal places", () => {
    expect(formatPrice(9.999)).toBe("R$ 10,00");
  });
});
