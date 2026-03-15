import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kimchipremium.com";
const locales = ["ko", "en", "zh"];
const routes = ["", "/indicators", "/news", "/about", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const routeMeta: Record<string, { changeFreq: "always" | "hourly" | "daily" | "monthly" | "yearly"; priority: number }> = {
    "":            { changeFreq: "always",  priority: 1.0 },
    "/indicators": { changeFreq: "hourly",  priority: 0.9 },
    "/news":       { changeFreq: "hourly",  priority: 0.8 },
    "/about":      { changeFreq: "monthly", priority: 0.6 },
    "/privacy":    { changeFreq: "yearly",  priority: 0.4 },
    "/terms":      { changeFreq: "yearly",  priority: 0.4 },
  };

  // en 먼저 (구글은 첫 번째 엔트리를 더 중요하게 봄)
  for (const locale of ["en", "ko", "zh"]) {
    for (const route of routes) {
      const meta = routeMeta[route];
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: meta.changeFreq,
        priority: locale === "en" ? meta.priority : meta.priority - 0.05,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${route}`])),
            "x-default": `${BASE_URL}/en${route}`,
          },
        },
      });
    }
  }

  return entries;
}
