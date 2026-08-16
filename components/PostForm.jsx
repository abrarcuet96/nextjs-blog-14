"use client";

import { createPost, updatePost } from "@/lib/api";
import { splitTagsInput } from "@/lib/post-utils.mjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const emptyPost = { title: "", body: "", tags: "", published: true };

export default function PostForm({ post }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: emptyPost });

  useEffect(() => {
    if (post) {
      reset({ ...post, tags: post.tags.join(", ") });
    }
  }, [post, reset]);

  const mutation = useMutation({
    mutationFn: (values) => {
      const cleanPost = {
        ...values,
        tags: splitTagsInput(values.tags),
      };
      return post ? updatePost(post._id, cleanPost) : createPost(cleanPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/dashboard");
      router.refresh();
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-5" noValidate>
      <div>
        <label htmlFor="title" className="label font-medium">Title</label>
        <input id="title" {...register("title", { required: "Title is required", maxLength: { value: 120, message: "Keep the title under 120 characters" } })} className="input input-bordered w-full" placeholder="A clear, helpful title" />
        {errors.title ? <p className="mt-1 text-sm text-error">{errors.title.message}</p> : null}
      </div>
      <div>
        <label htmlFor="body" className="label font-medium">Article</label>
        <textarea id="body" {...register("body", { required: "Article content is required", minLength: { value: 20, message: "Write at least 20 characters" } })} className="textarea textarea-bordered min-h-64 w-full leading-relaxed" placeholder="Share what you learned..." />
        {errors.body ? <p className="mt-1 text-sm text-error">{errors.body.message}</p> : null}
      </div>
      <div>
        <label htmlFor="tags" className="label font-medium">Tags <span className="font-normal text-base-content/50">(optional)</span></label>
        <input id="tags" {...register("tags")} className="input input-bordered w-full" placeholder="nextjs, mongodb, learning" />
        <p className="mt-1 text-xs text-base-content/50">Separate up to five tags with commas.</p>
      </div>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-base-300 p-4">
        <input type="checkbox" {...register("published")} className="toggle toggle-primary" />
        <span><strong className="block">Publish now</strong><span className="text-sm text-base-content/60">Turn this off to save a private draft.</span></span>
      </label>
      {mutation.error ? <div role="alert" className="alert alert-error">{mutation.error.message}</div> : null}
      <div className="flex justify-end gap-3">
        <Link href="/dashboard" className="btn btn-ghost">Cancel</Link>
        <button type="submit" disabled={mutation.isPending} className="btn btn-primary">{mutation.isPending ? "Saving..." : post ? "Update post" : "Create post"}</button>
      </div>
    </form>
  );
}
