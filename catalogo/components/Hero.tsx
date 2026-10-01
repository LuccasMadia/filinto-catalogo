import Image from "next/image";

export function Hero() {
  return (
    <header className="bg-[#AC1214] px-4 py-16 text-center text-white">
      <Image
        src="/logo-filinto.png"
        alt="Filinto Sorvetes"
        width={140}
        height={140}
        className="mx-auto mb-4 rounded-full"
        preload
      />
      <h1 className="font-[family-name:var(--font-dancing-script)] text-4xl">
        Filinto Sorvetes
      </h1>
      <p className="mt-2 text-white/90">O sabor que refresca o seu dia</p>
    </header>
  );
}
