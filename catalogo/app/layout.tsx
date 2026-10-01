import type { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filinto Sorvetes — Cardápio",
  description: "Catálogo digital do Filinto Sorvetes",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${dancingScript.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
