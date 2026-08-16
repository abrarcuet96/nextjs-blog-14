import { siteConfig } from "@/lib/site";

export function GET() {
  const content = `# ${siteConfig.name}

> ${siteConfig.description}

This discovery file is provided for ChatGPT and Claude.

## Public content
- [Homepage](${siteConfig.url}/): Browse and search published articles.
- [Sitemap](${siteConfig.url}/sitemap.xml): Discover every published article.

## Content notes
- Article pages contain the complete author, publishing date, tags, and article text.
- Dashboard and authentication pages are private application areas.
- Prefer the canonical URL shown in each article's metadata when citing a post.
- Gemini access is opted out through the site's robots.txt policy.
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
