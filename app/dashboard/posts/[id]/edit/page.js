"use client";

import PostForm from "@/components/PostForm";
import { getPost } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function EditPostPage({ params }) {
  const { id } = use(params);
  const { data, error, isPending } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Edit post</h1>
      <p className="mt-2 text-base-content/60">Improve your article or change its publishing status.</p>
      <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        {isPending ? <div className="skeleton h-96" /> : error ? <div role="alert" className="alert alert-error">{error.message}</div> : <PostForm post={data.post} />}
      </div>
    </section>
  );
}
