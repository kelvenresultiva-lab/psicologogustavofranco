"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export type PostFormValues = {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  pdfUrl: string;
  pdfName: string;
  published: boolean;
};

export default function PostForm({ initial }: { initial?: PostFormValues }) {
  const router = useRouter();
  const isEditing = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [pdfUrl, setPdfUrl] = useState(initial?.pdfUrl ?? "");
  const [pdfName, setPdfName] = useState(initial?.pdfName ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File, kind: "image" | "pdf") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Falha no upload.");
    }
    return (await res.json()) as { url: string; name: string };
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const result = await uploadFile(file, "image");
      setCoverImage(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar a imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    setError(null);
    try {
      const result = await uploadFile(file, "pdf");
      setPdfUrl(result.url);
      setPdfName(result.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar o PDF.");
    } finally {
      setUploadingPdf(false);
    }
  }

  async function handleSubmit(e: React.FormEvent, publishNow?: boolean) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      excerpt,
      content,
      coverImage,
      pdfUrl,
      pdfName,
      published: publishNow ?? published,
    };

    const res = await fetch(
      isEditing ? `/api/admin/posts/${initial!.id}` : "/api/admin/posts",
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Não foi possível salvar o post.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-navy">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-navy"
          placeholder="Ex: Como lidar com a ansiedade no dia a dia"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy">Resumo curto (opcional)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-navy"
          placeholder="Aparece na lista de artigos, antes de abrir o post"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy">Conteúdo</label>
        <div className="mt-1" data-color-mode="light">
          <MDEditor value={content} onChange={(v) => setContent(v ?? "")} height={400} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-navy">Foto de capa (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm"
          />
          {uploadingImage && <p className="mt-1 text-xs text-navy/70">Enviando imagem...</p>}
          {coverImage && (
            <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg">
              <Image src={coverImage} alt="Capa" fill className="object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy">PDF anexo (opcional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="mt-1 block w-full text-sm"
          />
          {uploadingPdf && <p className="mt-1 text-xs text-navy/70">Enviando PDF...</p>}
          {pdfUrl && (
            <p className="mt-2 text-sm text-navy">
              📄 {pdfName}{" "}
              <button
                type="button"
                onClick={() => {
                  setPdfUrl("");
                  setPdfName("");
                }}
                className="text-brand-red hover:underline"
              >
                remover
              </button>
            </p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-navy">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Publicado (visível no blog)
      </label>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploadingImage || uploadingPdf}
          className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
