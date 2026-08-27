import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blog | Gustavo Franco Psicólogo",
  description: "Artigos sobre ansiedade, autoestima, relacionamentos e saúde mental por Gustavo Franco, psicólogo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#3F3E3E]">{children}</body>
    </html>
  );
}
