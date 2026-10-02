import Image from "next/image";

type HeroFruitDecorProps = {
  side: "left" | "right";
  src?: string;
};

export function HeroFruitDecor({ side, src }: HeroFruitDecorProps) {
  return (
    <div
      aria-hidden="true"
      className={
        side === "left"
          ? "absolute top-48 left-2 z-0 h-12 w-12 opacity-80 sm:top-20 sm:left-6 sm:h-20 sm:w-20"
          : "absolute top-48 right-2 z-0 h-12 w-12 opacity-80 sm:top-20 sm:right-6 sm:h-20 sm:w-20"
      }
    >
      {src ? (
        <Image src={src} alt="" fill className="object-contain" />
      ) : (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path
            d="M32 20c10 0 18 8 18 20 0 12-8 20-18 20S14 52 14 40c0-12 8-20 18-20Z"
            fill="#E63946"
          />
          <path
            d="M32 20c-2-6 0-10 4-12"
            stroke="#2D6A4F"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="24" cy="34" r="2" fill="#FFE5E5" />
          <circle cx="34" cy="30" r="2" fill="#FFE5E5" />
          <circle cx="40" cy="42" r="2" fill="#FFE5E5" />
          <circle cx="26" cy="46" r="2" fill="#FFE5E5" />
        </svg>
      )}
    </div>
  );
}
