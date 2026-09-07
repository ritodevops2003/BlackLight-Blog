import { NextResponse } from "next/server";
import { getBlogs } from "@/lib/db";

export const dynamic = "force-dynamic";

const SITE_URL = "https://black-light-blog.vercel.app";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const blogs = await getBlogs(); // already sorted newest first

  const items = blogs
    .map((blog) => {
      const url = `${SITE_URL}/blogs/${blog.id}`;
      return `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(blog.excerpt)}</description>
      <category>${escapeXml(blog.category)}</category>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blacklight Blog</title>
    <link>${SITE_URL}/blogs</link>
    <description>Insights on marketing, AI, and creative strategy from Blacklight Group.</description>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
