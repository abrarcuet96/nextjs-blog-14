import { siteConfig } from "@/lib/site";

export default function robots() {
  const privatePaths = ["/dashboard/", "/api/auth/"];

  return {
    rules: [
      {
        // Google-Extended controls Gemini use without affecting Google Search.
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: ["OAI-SearchBot", "GPTBot", "ChatGPT-User"],
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: ["Claude-SearchBot", "ClaudeBot", "Claude-User"],
        allow: "/",
        disallow: privatePaths,
      },
      {
        // Googlebot and other normal search crawlers keep the existing SEO rules.
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
