const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig = {
  name: "NextBlog",
  description: "A friendly place to learn, write, and share useful ideas.",
  url: configuredUrl.replace(/\/$/, ""),
};
