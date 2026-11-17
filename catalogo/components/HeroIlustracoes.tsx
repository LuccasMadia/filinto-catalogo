// Ilustrações FICTÍCIAS (SVG chapado) usadas no quadro da hero. Substituir por fotos reais dos produtos:
// trocar o <Ilustracao> da linha em HeroQuadro por <Image src="/produtos/..." />.
const TAMPA = "#F2C230";

function Pote({ cor, faixa = TAMPA }: { cor: string; faixa?: string }) {
  return (
    <>
      <rect x="7" y="14" width="34" height="8" rx="3" fill={faixa} />
      <path d="M9 22h30l-3 20a3 3 0 0 1-3 2.6H15a3 3 0 0 1-3-2.6z" fill="#FFF8F0" />
      <path d="M11 27h26l-1.6 11H12.6z" fill={cor} />
      <circle cx="24" cy="32.5" r="3" fill="#FFF8F0" opacity=".85" />
    </>
  );
}

function Picole({ cor, capa }: { cor: string; capa?: string }) {
  return (
    <>
      <rect x="21" y="30" width="6" height="15" rx="2.5" fill="#E8C99B" />
      <rect x="13" y="4" width="22" height="30" rx="11" fill={capa ?? cor} />
      {capa ? <rect x="17" y="9" width="14" height="19" rx="7" fill={cor} /> : null}
      <rect x="17" y="9" width="4" height="12" rx="2" fill="#fff" opacity=".35" />
    </>
  );
}

const DESENHOS: Record<string, () => React.JSX.Element> = {
  pote: () => <Pote cor="#E8A0B4" />,
  potePremium: () => <Pote cor="#5C3317" faixa="#C9A24A" />,
  caixa: () => (
    <>
      <rect x="6" y="10" width="36" height="9" rx="2" fill="#8A0F11" />
      <rect x="9" y="19" width="30" height="23" rx="2" fill="#C42224" />
      <rect x="18" y="26" width="12" height="4" rx="2" fill="#FFF8F0" opacity=".9" />
    </>
  ),
  sundae: () => (
    <>
      <path d="M12 24h24l-3 19a3 3 0 0 1-3 2.5H18a3 3 0 0 1-3-2.5z" fill="#FFF8F0" opacity=".95" />
      <path d="M13 28h22l-1.2 8H14.2z" fill="#5C3317" />
      <path d="M14 24c0-7 5-13 10-13s10 6 10 13z" fill="#FBEBB5" />
      <path d="M17 19c3 3 11 3 14 0" stroke="#5C3317" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="9" r="3.2" fill="#C42224" />
    </>
  ),
  picole: () => <Picole cor="#F2778E" />,
  especial: () => <Picole cor="#FBEBB5" capa="#5C3317" />,
  paleta: () => <Picole cor="#F2C230" capa="#E8731C" />,
  acai: () => (
    <>
      <path d="M6 22h36a18 18 0 0 1-36 0z" fill="#6B2D8B" />
      <path d="M8 22h32" stroke="#4B2F73" strokeWidth="2" />
      <circle cx="17" cy="19" r="4" fill="#F2C230" />
      <circle cx="26" cy="17" r="4" fill="#E4EFD3" />
      <circle cx="32" cy="20" r="3" fill="#F2778E" />
    </>
  ),
};

const POR_CATEGORIA: Record<string, keyof typeof DESENHOS> = {
  "pote-1-8l": "pote",
  "pote-premium-1-8l": "potePremium",
  caixa: "caixa",
  sundaes: "sundae",
  picoles: "picole",
  "picoles-especiais": "especial",
  "paleta-mexicana": "paleta",
  acai: "acai",
};

export function Ilustracao({ categoriaId }: { categoriaId: string }) {
  const Desenho = DESENHOS[POR_CATEGORIA[categoriaId] ?? "pote"];
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-full w-full">
      <Desenho />
    </svg>
  );
}
