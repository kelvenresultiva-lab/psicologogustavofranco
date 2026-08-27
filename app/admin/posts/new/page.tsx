import AdminNav from "@/components/admin/AdminNav";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <>
      <AdminNav />
      <main className="flex-1 bg-[#FAFAF9] px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-2xl text-navy">Novo post</h1>
          <div className="mt-6">
            <PostForm />
          </div>
        </div>
      </main>
    </>
  );
}
