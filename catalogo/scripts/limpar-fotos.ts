// Uso: npx tsx --env-file=.env.local scripts/limpar-fotos.ts
// Zera imagem_url de tudo que não é foto real (pote18-*).
import { createServiceClient } from "../lib/supabase";

async function main() {
  const { data, error } = await createServiceClient()
    .from("produtos")
    .update({ imagem_url: null })
    .not("imagem_url", "like", "/produtos/pote18-%")
    .select("id");
  if (error) throw error;
  console.log(`${data.length} produtos sem foto`);
}
main().catch((e) => { console.error(e); process.exit(1); });
