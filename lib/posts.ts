import slugify from "slugify";
import { prisma } from "./db";

export function slugFromTitle(title: string): string {
  return slugify(title, { lower: true, strict: true, locale: "pt" });
}

export async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = base || "post";
  let counter = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getAllPostsForAdmin() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}
