import ShareButton from "@/components/ShareButton";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { getPublicPost, getVisiblePost } from "@/lib/posts";
import { getReadingTime, makeExcerpt } from "@/lib/post-utils.mjs";
import { siteConfig } from "@/lib/site";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "long" });

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPublicPost(id);

  if (!post) return { title: "Post not found" };

  const description = makeExcerpt(post.body);
  const url = `/posts/${id}`;
  return {
    title: post.title,
    description,
    authors: [{ name: post.author?.name || siteConfig.name }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name || siteConfig.name],
      tags: post.tags,
    },
    twitter: { card: "summary", title: post.title, description },
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const user = verifyToken(cookieStore.get(AUTH_COOKIE)?.value);
  const post = await getVisiblePost(id, user?.id);

  if (!post) notFound();

  const articleUrl = `${siteConfig.url}/posts/${id}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: makeExcerpt(post.body),
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author?.name || "NextBlog writer" },
    mainEntityOfPage: articleUrl,
  };

  return (
    <section className="px-4 py-12 sm:px-6">
      {post.published ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <article className="mx-auto max-w-3xl rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="badge badge-primary badge-outline">{tag}</span>
          ))}
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-base-200 pb-6 text-sm text-base-content/60">
          <p>By {post.author?.name || "NextBlog writer"} · <time dateTime={post.createdAt}>{dateFormatter.format(new Date(post.createdAt))}</time> · {getReadingTime(post.body)} min read</p>
          <ShareButton title={post.title} url={articleUrl} />
        </div>
        {!post.published ? <div className="alert alert-info mt-6">This is a private draft. Only you can see it.</div> : null}
        <div className="mt-8 whitespace-pre-wrap text-lg leading-8">{post.body}</div>
        <div className="mt-10 border-t border-base-200 pt-6"><Link href="/" className="link link-primary">← Back to all articles</Link></div>
      </article>
    </section>
  );
}
