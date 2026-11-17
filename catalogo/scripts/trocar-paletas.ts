// Uso: npx tsx --env-file=.env.local scripts/trocar-paletas.ts
// Troca as paletas antigas (sabores fictícios) pelas reais do DEFAULT_CATALOGO.
import { DEFAULT_CATALOGO } from "../lib/catalogo-store";
import { createServiceClient } from "../lib/supabase";

async function main() {
  const db = createServiceClient();
  const novas = DEFAULT_CATALOGO.produtos.filter((p) => p.categoriaId === "paleta-mexicana");
  const base = DEFAULT_CATALOGO.produtos.findIndex((p) => p.categoriaId === "paleta-mexicana");
  const del = await db.from("produtos").delete().eq("categoria_id", "paleta-mexicana");
  if (del.error) throw del.error;
  const ins = await db.from("produtos").insert(
    novas.map((p, i) => ({
      id: p.id,
      categoria_id: p.categoriaId,
      nome: p.nome,
      imagem_url: p.imagem ?? null,
      esgotado: false,
      ordem: base + i,
    })),
  );
  if (ins.error) throw ins.error;
  console.log(`${novas.length} paletas`);
}
main().catch((e) => { console.error(e); process.exit(1); });
