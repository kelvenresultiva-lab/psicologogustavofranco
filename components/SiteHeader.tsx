import Link from "next/link";
import { MAIN_SITE_URL, SITE_NAME } from "@/lib/config";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-navy">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/blog" className="font-display text-lg text-white">
          {SITE_NAME} <span className="text-white/60 text-sm font-sans">/ blog</span>
        </Link>
        <a
          href={MAIN_SITE_URL}
          className="text-sm font-semibold text-white/85 hover:text-white transition-colors"
        >
          ← Voltar ao site
        </a>
      </div>
    </header>
  );
}
