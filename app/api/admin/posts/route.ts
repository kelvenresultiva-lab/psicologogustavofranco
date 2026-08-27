import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureUniqueSlug, slugFromTitle } from "@/lib/posts";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, excerpt, content, coverImage, pdfUrl, pdfName, published } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Conteúdo é obrigatório." }, { status: 400 });
  }

  const baseSlug = slugFromTitle(title);
  const slug = await ensureUniqueSlug(baseSlug);

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || null,
      content,
      coverImage: coverImage || null,
      pdfUrl: pdfUrl || null,
      pdfName: pdfName || null,
      published: Boolean(published),
    },
  });

  return NextResponse.json({ post });
}
