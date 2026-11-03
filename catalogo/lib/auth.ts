export const ADMIN_SESSION_COOKIE = "admin_session";

export function isValidAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}

export function assertAdmin(session: string | undefined): void {
  if (!session || !isValidAdminPassword(session)) {
    throw new Error("Não autorizado");
  }
}
