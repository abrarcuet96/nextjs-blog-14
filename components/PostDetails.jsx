"use client";

import { getPost } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function PostDetails({ id }) {
  const { data, error, isPending } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  if (isPending) return <div className="skeleton mx-auto h-96 max-w-3xl" />;
  if (error) return <div role="alert" className="alert alert-error mx-auto max-w-3xl">{error.message}</div>;

  const { post } = data;
  return (
    <article className="mx-auto max-w-3xl rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-10">
      <div className="flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="badge badge-primary badge-outline">{tag}</span>)}</div>
      <h1 className="mt-4 text-4xl font-bold leading-tight">{post.title}</h1>
      <p className="mt-4 border-b border-base-200 pb-6 text-sm text-base-content/60">By {post.author?.name || "NextBlog writer"} · {new Date(post.createdAt).toLocaleDateString("en", { dateStyle: "long" })}</p>
      {!post.published ? <div className="alert alert-info mt-6">This is a private draft. Only you can see it.</div> : null}
      <div className="mt-8 whitespace-pre-wrap text-lg leading-8">{post.body}</div>
      <div className="mt-10 border-t border-base-200 pt-6"><Link href="/" className="link link-primary">← Back to all articles</Link></div>
    </article>
  );
}
