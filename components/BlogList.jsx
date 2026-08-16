"use client";

import { getPosts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PostCard from "./PostCard";

export default function BlogList() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const { data, error, isPending } = useQuery({
    queryKey: ["posts", search],
    queryFn: () => getPosts(search),
  });

  function handleSearch(event) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-8 flex max-w-xl gap-2">
        <label className="input input-bordered flex flex-1 items-center gap-2 bg-base-100">
          <span className="sr-only">Search articles</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 opacity-50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search articles..."
            className="grow"
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {isPending ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton h-64 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div role="alert" className="alert alert-error">
          <span>{error.message}</span>
        </div>
      ) : data.posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <h3 className="text-xl font-semibold">No articles found</h3>
          <p className="mt-2 text-base-content/60">
            {search
              ? "Try a different search term."
              : "Be the first writer to publish an article."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
