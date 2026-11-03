import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function env(nome: string): string {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Variável de ambiente ausente: ${nome}`);
  return valor;
}

const semSessao = { auth: { persistSession: false, autoRefreshToken: false } };

export function createPublicClient(): SupabaseClient {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    semSessao
  );
}

// Server-only: nunca importar em componente de cliente.
export function createServiceClient(): SupabaseClient {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    semSessao
  );
}
