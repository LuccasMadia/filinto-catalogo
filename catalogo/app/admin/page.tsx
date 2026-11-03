import { AdminPanel } from "@/components/AdminPanel";
import { getCatalogo } from "@/lib/catalogo-db";

// Lê o banco a cada request para que edições do admin apareçam no reload seguinte.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Sem fallback: se o banco falhar, o admin estoura em vez de editar dados que não são os reais.
  const catalogo = await getCatalogo();
  return <AdminPanel {...catalogo} />;
}
