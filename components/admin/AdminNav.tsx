"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-navy">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="font-display text-lg text-white">
          Painel do blog
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/blog" target="_blank" className="text-white/80 hover:text-white">
            Ver blog ↗
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/30 px-3 py-1.5 font-semibold text-white hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
