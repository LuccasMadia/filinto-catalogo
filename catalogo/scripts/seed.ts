// Uso: npx tsx --env-file=.env.local scripts/seed.ts
import { DEFAULT_CATALOGO } from "../lib/catalogo-store";
import { createServiceClient } from "../lib/supabase";

async function main() {
  const db = createServiceClient();

  const categorias = DEFAULT_CATALOGO.categorias.map((c, i) => ({
    id: c.id,
    nome: c.nome,
    ordem: i,
    oculta: c.oculta ?? false,
  }));
  const produtos = DEFAULT_CATALOGO.produtos.map((p, i) => ({
    id: p.id,
    categoria_id: p.categoriaId,
    nome: p.nome,
    imagem_url: p.imagem ?? null,
    esgotado: p.esgotado ?? false,
    ordem: i,
  }));

  const rc = await db.from("categorias").upsert(categorias, { ignoreDuplicates: true });
  if (rc.error) throw rc.error;
  const rp = await db.from("produtos").upsert(produtos, { ignoreDuplicates: true });
  if (rp.error) throw rp.error;

  console.log(`${categorias.length} categorias, ${produtos.length} produtos`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
