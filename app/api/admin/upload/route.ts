import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/upload";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20MB

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind"); // "image" | "pdf"

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
  }

  if (kind === "image") {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "O arquivo precisa ser uma imagem." }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Imagem maior que 8MB." }, { status: 400 });
    }
  } else if (kind === "pdf") {
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "O arquivo precisa ser um PDF." }, { status: 400 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: "PDF maior que 20MB." }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Tipo de upload inválido." }, { status: 400 });
  }

  try {
    const result = await saveUploadedFile(file);
    return NextResponse.json(result);
  } catch (err) {
    console.error("upload failed:", err);
    const message = err instanceof Error ? err.message : "Erro desconhecido no upload.";
    return NextResponse.json({ error: `Falha ao salvar o arquivo: ${message}` }, { status: 500 });
  }
}
