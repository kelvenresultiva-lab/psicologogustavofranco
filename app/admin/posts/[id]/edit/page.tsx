import { notFound } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import PostForm from "@/components/admin/PostForm";
import { getPostById } from "@/lib/posts";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <AdminNav />
      <main className="flex-1 bg-[#FAFAF9] px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-2xl text-navy">Editar post</h1>
          <div className="mt-6">
            <PostForm
              initial={{
                id: post.id,
                title: post.title,
                excerpt: post.excerpt ?? "",
                content: post.content,
                coverImage: post.coverImage ?? "",
                pdfUrl: post.pdfUrl ?? "",
                pdfName: post.pdfName ?? "",
                published: post.published,
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
