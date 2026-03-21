"use client";

import useSWR from "swr";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { IndicatorsResponse } from "@/app/api/indicators/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TrendingBanner() {
  const locale = useLocale();
  const { data } = useSWR<IndicatorsResponse>("/api/indicators", fetcher, { refreshInterval: 600_000 });
  const coins = data?.trending ?? [];

  if (coins.length === 0) return null;

  const label = locale === "ko" ? "🔥 트렌딩" : locale === "zh" ? "🔥 热门" : "🔥 Trending";

  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide rounded-lg border border-white/5 bg-white/2 px-3 py-2">
      <span className="shrink-0 text-xs font-semibold text-white">{label}</span>
      <div className="w-px h-4 bg-white/10 shrink-0" />
      <div className="flex items-center gap-2">
        {coins.map((coin, i) => (
          <a
            key={coin.id}
            href={`https://www.coingecko.com/en/coins/${coin.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-2.5 py-1 hover:bg-white/8 transition-colors shrink-0"
          >
            <span className="text-[10px] text-[var(--fg-muted)]">#{i + 1}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coin.thumb} alt={coin.name} width={14} height={14} className="rounded-full" />
            <span className="text-xs font-medium text-white">{coin.symbol.toUpperCase()}</span>
            {coin.priceChangePercent !== null && (
              <span className={cn("text-[10px] font-number", coin.priceChangePercent >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {coin.priceChangePercent >= 0 ? "+" : ""}{coin.priceChangePercent.toFixed(1)}%
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
