import { getPublishedPostLinks } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const pages = [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/signup`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const posts = await getPublishedPostLinks();
    const postPages = posts.map((post) => ({
      url: `${siteConfig.url}/posts/${post._id}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...pages, ...postPages];
  } catch (error) {
    console.error("Sitemap could not load posts:", error);
    return pages;
  }
}
