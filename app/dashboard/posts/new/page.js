import PostForm from "@/components/PostForm";

export const metadata = { title: "Create a post" };

export default function NewPostPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Create a new post</h1>
      <p className="mt-2 text-base-content/60">Keep it focused, clear, and useful for your reader.</p>
      <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"><PostForm /></div>
    </section>
  );
}
