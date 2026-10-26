import Image from "next/image";

export function HeroNav() {
  return (
    <nav className="relative z-20 flex items-center gap-3 px-6 py-5">
      <Image src="/logo-filinto.png" alt="" width={44} height={44} className="rounded-full" />
      <span className="font-[family-name:var(--font-dancing-script)] text-2xl text-white">
        Filinto
      </span>
    </nav>
  );
}
