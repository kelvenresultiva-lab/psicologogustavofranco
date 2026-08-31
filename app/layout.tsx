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

const title = "Blog | Gustavo Franco Psicólogo";
const description =
  "Artigos sobre ansiedade, autoestima, relacionamentos e saúde mental por Gustavo Franco, psicólogo.";

export const metadata: Metadata = {
  metadataBase: new URL("https://psicologogustavofranco.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: "/social-share.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/social-share.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#3F3E3E]">{children}</body>
    </html>
  );
}
