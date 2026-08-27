import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PostCard from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#FAFAF9]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">Blog</p>
          <h1 className="mt-2 font-display text-4xl text-navy">Artigos sobre saúde emocional</h1>
          <p className="mt-3 max-w-2xl text-[#3F3E3E]/75">
            Reflexões e conteúdos sobre ansiedade, autoestima, relacionamentos e outros temas do
            dia a dia da terapia.
          </p>

          {posts.length === 0 ? (
            <p className="mt-16 text-[#3F3E3E]/60">Nenhum artigo publicado ainda.</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
