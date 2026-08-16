import Link from "next/link";

const formatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function PostCard({ post }) {
  const preview =
    post.body.length > 150 ? `${post.body.slice(0, 150)}…` : post.body;

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="card-body">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge badge-ghost badge-sm">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="card-title mt-2 text-xl">
          <Link href={`/posts/${post._id}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="text-base-content/70">{preview}</p>
        <div className="card-actions mt-4 items-center justify-between border-t border-base-200 pt-4 text-sm text-base-content/60">
          <span>{post.author?.name || "NextBlog writer"}</span>
          <time dateTime={post.createdAt}>
            {formatter.format(new Date(post.createdAt))}
          </time>
        </div>
      </div>
    </article>
  );
}
