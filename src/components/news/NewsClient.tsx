"use client";

import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import type { NewsItem } from "@/app/api/news/route";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const LABELS = {
  ko: {
    title: "암호화폐 뉴스",
    subtitle: "글로벌 크립토 최신 뉴스",
    noNews: "뉴스를 불러오지 못했습니다.",
    timeAgo: (sec: number) => {
      if (sec < 60) return `${sec}초 전`;
      if (sec < 3600) return `${Math.floor(sec / 60)}분 전`;
      if (sec < 86400) return `${Math.floor(sec / 3600)}시간 전`;
      return `${Math.floor(sec / 86400)}일 전`;
    },
    filters: ["전체", "BTC", "ETH", "알트코인", "규제", "DeFi", "NFT"],
    count: (n: number) => `${n}건`,
  },
  en: {
    title: "Crypto News",
    subtitle: "Latest global cryptocurrency news",
    noNews: "Failed to load news.",
    timeAgo: (sec: number) => {
      if (sec < 60) return `${sec}s ago`;
      if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
      if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
      return `${Math.floor(sec / 86400)}d ago`;
    },
    filters: ["All", "BTC", "ETH", "Altcoins", "Regulation", "DeFi", "NFT"],
    count: (n: number) => `${n} articles`,
  },
  zh: {
    title: "加密货币新闻",
    subtitle: "最新全球加密货币新闻",
    noNews: "无法加载新闻。",
    timeAgo: (sec: number) => {
      if (sec < 60) return `${sec}秒前`;
      if (sec < 3600) return `${Math.floor(sec / 60)}分钟前`;
      if (sec < 86400) return `${Math.floor(sec / 3600)}小时前`;
      return `${Math.floor(sec / 86400)}天前`;
    },
    filters: ["全部", "BTC", "ETH", "山寨币", "监管", "DeFi", "NFT"],
    count: (n: number) => `${n}条`,
  },
};

const FILTER_KEYWORDS: Record<string, string[]> = {
  BTC: ["bitcoin", "btc"],
  ETH: ["ethereum", "eth"],
  알트코인: ["altcoin", "xrp", "sol", "ada", "doge"],
  Altcoins: ["altcoin", "xrp", "sol", "ada", "doge"],
  山寨币: ["altcoin", "xrp", "sol", "ada", "doge"],
  규제: ["regulation", "sec", "법", "규제", "government"],
  Regulation: ["regulation", "sec", "government", "law"],
  监管: ["regulation", "sec", "government"],
  DeFi: ["defi", "decentralized"],
  NFT: ["nft", "nonfungible"],
};

function NewsCard({ item, t }: { item: NewsItem; t: typeof LABELS.ko }) {
  const ago = Math.floor((Date.now() - item.publishedAt) / 1000);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 glass rounded-2xl p-4 transition-all duration-200 hover:border-white/15 hover:bg-white/4"
    >
      <div className="flex gap-3">
        {item.imageUrl && (
          <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-white/5">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
             
              onError={(e) => {
                const parent = (e.currentTarget as HTMLImageElement).parentElement;
                if (parent) parent.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {item.title}
          </h3>
          {item.body && (
            <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {item.body}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-indigo-400">{item.source}</span>
          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-600">{t.timeAgo(ago)}</span>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[10px] text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex gap-3">
        <div className="skeleton h-20 w-28 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-4/5 rounded" />
          <div className="skeleton h-3 w-full rounded mt-2" />
          <div className="skeleton h-3 w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
}

export function NewsClient({ locale }: { locale: string }) {
  const t = LABELS[locale as keyof typeof LABELS] ?? LABELS.ko;
  const [activeFilter, setActiveFilter] = useState(t.filters[0]);

  const { data, isLoading } = useSWR<{ news: NewsItem[] }>(
    `/api/news`,
    fetcher,
    { refreshInterval: 300_000 }
  );

  const news = data?.news ?? [];
  const filtered =
    activeFilter === t.filters[0]
      ? news
      : news.filter((item) => {
          const kws = FILTER_KEYWORDS[activeFilter] ?? [];
          const text = (item.title + " " + item.body + " " + item.tags.join(" ")).toLowerCase();
          return kws.some((kw) => text.includes(kw));
        });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-2 flex-wrap">
        {t.filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
              activeFilter === f
                ? "bg-indigo-600 text-white"
                : "border border-white/8 bg-white/3 text-gray-400 hover:text-gray-200 hover:border-white/15"
            )}
          >
            {f}
          </button>
        ))}
        {!isLoading && (
          <span className="ml-auto text-xs text-gray-600">{t.count(filtered.length)}</span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-gray-500">{t.noNews}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <NewsCard key={item.id} item={item} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
