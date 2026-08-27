"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Excluir o post "${title}"? Essa ação não pode ser desfeita.`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Não foi possível excluir o post.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-semibold text-brand-red hover:underline disabled:opacity-50"
    >
      {loading ? "Excluindo..." : "Excluir"}
    </button>
  );
}
