"use client";

import { deletePost, getMyPosts } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import DeletePostModal from "@/components/DeletePostModal";

export default function DashboardPage() {
  const [postToDelete, setPostToDelete] = useState(null);
  const queryClient = useQueryClient();
  const { data, error, isPending } = useQuery({
    queryKey: ["my-posts"],
    queryFn: getMyPosts,
  });
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setPostToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  function handleDelete() {
    if (postToDelete) deleteMutation.mutate(postToDelete._id);
  }

  function openDeleteModal(post) {
    deleteMutation.reset();
    setPostToDelete(post);
  }

  function closeDeleteModal() {
    if (deleteMutation.isPending) return;
    deleteMutation.reset();
    setPostToDelete(null);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Writer area</p>
          <h1 className="mt-1 text-3xl font-bold">Your dashboard</h1>
          <p className="mt-2 text-base-content/60">Create, edit, and publish your articles.</p>
        </div>
        <Link href="/dashboard/posts/new" className="btn btn-primary">New post</Link>
      </div>

      {isPending ? (
        <div className="skeleton h-48 rounded-2xl" />
      ) : error ? (
        <div role="alert" className="alert alert-error">{error.message}</div>
      ) : data.posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold">Your story starts here</h2>
          <p className="mt-2 text-base-content/60">Create your first post in a few simple steps.</p>
          <Link href="/dashboard/posts/new" className="btn btn-primary btn-sm mt-5">Create a post</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
          <table className="table">
            <thead><tr><th>Post</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {data.posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <Link href={`/posts/${post._id}`} className="font-semibold hover:text-primary">{post.title}</Link>
                    <p className="mt-1 text-xs text-base-content/50">Updated {new Date(post.updatedAt).toLocaleDateString("en")}</p>
                  </td>
                  <td><span className={`badge badge-sm ${post.published ? "badge-success" : "badge-ghost"}`}>{post.published ? "Published" : "Draft"}</span></td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/posts/${post._id}/edit`} className="btn btn-ghost btn-xs">Edit</Link>
                      <button type="button" onClick={() => openDeleteModal(post)} className="btn btn-error btn-outline btn-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeletePostModal
        post={postToDelete}
        error={deleteMutation.error}
        isPending={deleteMutation.isPending}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </section>
  );
}
