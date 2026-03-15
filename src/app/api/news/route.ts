import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: number;
  tags: string[];
}

const RSS_SOURCES = [
  { name: "CoinTelegraph", url: "https://cointelegraph.com/rss", lang: "en" },
  { name: "CoinDesk",      url: "https://feeds.feedburner.com/CoinDesk", lang: "en" },
  { name: "Decrypt",       url: "https://decrypt.co/feed", lang: "en" },
  { name: "Bitcoin.com",   url: "https://news.bitcoin.com/feed/", lang: "en" },
];

function extractText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

function extractCdata(raw: string): string {
  const m = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1].trim() : extractText(raw);
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? extractCdata(m[1]) : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`, "i");
  const m = xml.match(re);
  return m ? m[1] : "";
}

async function parseRSS(source: { name: string; url: string }): Promise<NewsItem[]> {
  const res = await fetch(source.url, {
    next: { revalidate: 300 },
    headers: { "User-Agent": "KimchiPremium/1.0" },
  });
  if (!res.ok) return [];

  const xml = await res.text();

  // <item>...</item> 블록 추출
  const itemRe = /<item[\s>][\s\S]*?<\/item>/gi;
  const items = xml.match(itemRe) ?? [];

  return items.slice(0, 15).map((item, i) => {
    const title = extractTag(item, "title");
    const link  = extractCdata(extractTag(item, "link") || extractAttr(item, "link", "href") || "");
    const desc  = extractTag(item, "description");
    const body  = extractText(desc);
    const pubDate = extractTag(item, "pubDate") || extractTag(item, "dc:date");
    const publishedAt = pubDate ? new Date(pubDate).getTime() : Date.now();

    // 이미지: media:content, enclosure, 또는 description 내 img src
    let imageUrl =
      extractAttr(item, "media:content", "url") ||
      extractAttr(item, "enclosure", "url") ||
      "";
    if (!imageUrl) {
      const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) imageUrl = imgMatch[1];
    }

    // 카테고리 태그
    const catRe = /<category[^>]*>([^<]+)<\/category>/gi;
    const tags: string[] = [];
    let cat;
    while ((cat = catRe.exec(item)) !== null) {
      const t = extractCdata(cat[1]).trim();
      if (t && t.length < 30) tags.push(t);
    }

    return {
      id: `${source.name}-${i}-${publishedAt}`,
      title,
      body,
      url: link,
      imageUrl,
      source: source.name,
      publishedAt,
      tags: tags.slice(0, 4),
    };
  }).filter((n) => n.title && n.url);
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      RSS_SOURCES.map((s) => parseRSS(s))
    );

    const allNews: NewsItem[] = results
      .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, 40);

    return NextResponse.json({ news: allNews }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json({ news: [] }, { status: 500 });
  }
}
