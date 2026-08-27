import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Post } from "@prisma/client";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-2xl text-navy/30">
            {post.title.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-red">
          {format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <h2 className="mt-2 font-display text-xl text-navy">{post.title}</h2>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-[#3F3E3E]/75">{post.excerpt}</p>
        )}
        <span className="mt-4 text-sm font-semibold text-navy group-hover:underline">
          Ler artigo →
        </span>
      </div>
    </Link>
  );
}
