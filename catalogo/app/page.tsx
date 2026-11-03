import { CatalogoHome } from "@/components/CatalogoHome";
import { apenasVisiveis, getCatalogoOuPadrao } from "@/lib/catalogo-db";

// Lê o banco a cada request para que edições do admin apareçam no reload seguinte.
export const dynamic = "force-dynamic";

export default async function Home() {
  const catalogo = apenasVisiveis(await getCatalogoOuPadrao());
  return <CatalogoHome {...catalogo} />;
}
