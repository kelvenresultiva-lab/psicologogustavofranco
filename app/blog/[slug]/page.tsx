import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MarkdownContent from "@/components/MarkdownContent";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <article className="mx-auto max-w-3xl px-6 py-14">
          <Link href="/blog" className="text-sm font-semibold text-navy hover:underline">
            ← Todos os artigos
          </Link>

          <span className="mt-6 block text-xs font-semibold uppercase tracking-wide text-brand-red">
            {format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy">{post.title}</h1>

          {post.coverImage && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-cream">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div className="mt-8">
            <MarkdownContent content={post.content} />
          </div>

          {post.pdfUrl && (
            <a
              href={post.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-xl border-2 border-navy px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              📄 Baixar {post.pdfName || "material em PDF"}
            </a>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
