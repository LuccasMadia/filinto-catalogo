import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isValidAdminPassword } from "./auth";

describe("isValidAdminPassword", () => {
  const originalValue = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "senha-correta";
  });

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalValue;
  });

  it("returns true when the password matches ADMIN_PASSWORD", () => {
    expect(isValidAdminPassword("senha-correta")).toBe(true);
  });

  it("returns false when the password does not match", () => {
    expect(isValidAdminPassword("errada")).toBe(false);
  });

  it("returns false when ADMIN_PASSWORD is not set", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(isValidAdminPassword("qualquer")).toBe(false);
  });
});
