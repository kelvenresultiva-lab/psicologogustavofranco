import { writeFile, mkdir } from "fs/promises";
import path from "path";

export type UploadResult = {
  url: string;
  name: string;
};

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

/**
 * Salva um arquivo enviado pelo painel de admin.
 * Em produção (com BLOB_READ_WRITE_TOKEN configurado) usa o Vercel Blob.
 * Em dev local, grava direto em public/uploads.
 */
export async function saveUploadedFile(file: File): Promise<UploadResult> {
  const safeName = `${Date.now()}-${sanitizeFilename(file.name)}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(safeName, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, name: file.name };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { url: `/uploads/${safeName}`, name: file.name };
}
