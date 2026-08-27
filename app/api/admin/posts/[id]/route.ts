import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureUniqueSlug, slugFromTitle } from "@/lib/posts";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { title, excerpt, content, coverImage, pdfUrl, pdfName, published } = body;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
  }

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Conteúdo é obrigatório." }, { status: 400 });
  }

  let slug = existing.slug;
  if (slugFromTitle(title) !== slugFromTitle(existing.title)) {
    slug = await ensureUniqueSlug(slugFromTitle(title), id);
  }

  const post = await prisma.post.update({
    where: { id },
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

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
  }
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
