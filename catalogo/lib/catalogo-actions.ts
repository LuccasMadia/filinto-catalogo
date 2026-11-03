"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, assertAdmin } from "./auth";
import { createServiceClient } from "./supabase";
import { validarNome } from "./validar-nome";

type Result = { error?: string };

async function atualizar(
  tabela: "produtos" | "categorias",
  id: string,
  campos: Record<string, unknown>,
): Promise<Result> {
  const { data, error } = await createServiceClient()
    .from(tabela)
    .update(campos)
    .eq("id", id)
    .select("id");
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: "Item não encontrado" };
  revalidatePath("/");
  revalidatePath("/admin");
  return {};
}

async function exigirAdmin() {
  assertAdmin((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
}

export async function setProdutoEsgotado(id: string, esgotado: boolean): Promise<Result> {
  await exigirAdmin();
  return atualizar("produtos", id, { esgotado });
}

export async function setProdutoNome(id: string, nome: string): Promise<Result> {
  await exigirAdmin();
  let limpo: string;
  try {
    limpo = validarNome(nome);
  } catch (e) {
    return { error: (e as Error).message };
  }
  return atualizar("produtos", id, { nome: limpo });
}

export async function setCategoriaOculta(id: string, oculta: boolean): Promise<Result> {
  await exigirAdmin();
  return atualizar("categorias", id, { oculta });
}
