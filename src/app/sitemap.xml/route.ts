import { NextResponse } from "next/server";

const BASE = "https://bicoai.com.br";

const PAGES = [
  { url: `${BASE}/`,        priority: "1.0", changefreq: "daily"   },
  { url: `${BASE}/login`,   priority: "0.8", changefreq: "monthly" },
  { url: `${BASE}/cadastro`,priority: "0.8", changefreq: "monthly" },
  { url: `${BASE}/feed`,    priority: "0.9", changefreq: "daily"   },
];

export function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = PAGES.map(
    ({ url, priority, changefreq }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
