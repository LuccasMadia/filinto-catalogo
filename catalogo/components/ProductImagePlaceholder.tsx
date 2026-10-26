// Cores por sabor enquanto não há fotos; o tom vem do nome, então é estável entre renders.
const TONS = [
  { bg: "#FADADD", fg: "#8A0F11" },
  { bg: "#F3DCC4", fg: "#5C3317" },
  { bg: "#E4EFD3", fg: "#3F5A1E" },
  { bg: "#FBEBB5", fg: "#7A5A00" },
  { bg: "#E6DCF2", fg: "#4B2F73" },
  { bg: "#D6ECEA", fg: "#1E5A55" },
];

// Palavras de formato do produto; o sabor é o que sobra.
const FORMATO = new Set(["pote", "picolé", "picole", "sundae", "caixa", "paleta", "de", "da", "do", "premium"]);

export function ProductImagePlaceholder({ nome }: { nome: string }) {
  const sabor = nome.split(" ").find((w) => !FORMATO.has(w.toLowerCase())) ?? nome;
  const hash = [...sabor].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const tom = TONS[hash % TONS.length];
  return (
    <div
      aria-hidden="true"
      className="flex aspect-square w-full items-center justify-center rounded-xl"
      style={{ backgroundColor: tom.bg, color: tom.fg }}
    >
      <span className="font-[family-name:var(--font-dancing-script)] text-6xl leading-none">
        {sabor.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
