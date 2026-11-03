import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isValidAdminPassword, assertAdmin } from "./auth";

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

describe("assertAdmin", () => {
  const originalValue = process.env.ADMIN_PASSWORD;
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "senha-correta";
  });
  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalValue;
  });

  it("throws when the cookie is missing", () => {
    expect(() => assertAdmin(undefined)).toThrow("Não autorizado");
  });
  it("throws when the password is wrong", () => {
    expect(() => assertAdmin("errada")).toThrow("Não autorizado");
  });
  it("does not throw with the correct password", () => {
    expect(() => assertAdmin(process.env.ADMIN_PASSWORD)).not.toThrow();
  });
});
