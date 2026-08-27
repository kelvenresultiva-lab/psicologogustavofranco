import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AdminNav from "@/components/admin/AdminNav";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { getAllPostsForAdmin } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const posts = await getAllPostsForAdmin();

  return (
    <>
      <AdminNav />
      <main className="flex-1 bg-[#FAFAF9] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl text-navy">Seus posts</h1>
            <Link
              href="/admin/posts/new"
              className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Novo post
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="mt-10 text-[#3F3E3E]/60">
              Nenhum post ainda. Clique em &quot;Novo post&quot; para criar o primeiro.
            </p>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/[.03] text-xs uppercase tracking-wide text-[#3F3E3E]/60">
                  <tr>
                    <th className="px-4 py-3">Título</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Criado em</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-t border-black/5">
                      <td className="px-4 py-3 font-medium text-navy">{post.title}</td>
                      <td className="px-4 py-3">
                        {post.published ? (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            Publicado
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                            Rascunho
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#3F3E3E]/70">
                        {format(new Date(post.createdAt), "d MMM yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="text-sm font-semibold text-navy hover:underline"
                          >
                            Editar
                          </Link>
                          <DeletePostButton id={post.id} title={post.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
