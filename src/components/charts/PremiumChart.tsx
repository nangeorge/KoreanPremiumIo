"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { TVCandlePoint } from "./TVChart";
import type { Time } from "lightweight-charts";
import type { OHLCCandle } from "@/app/api/candles/route";

const TVChart = dynamic(() => import("./TVChart").then((m) => m.TVChart), {
  ssr: false,
  loading: () => <div className="skeleton w-full rounded-lg" style={{ height: 220 }} />,
});

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const INTERVALS = ["1h", "4h", "1d", "1w"] as const;
type Interval = (typeof INTERVALS)[number];

export function PremiumChart() {
  const t = useTranslations("chart");
  const locale = useLocale();
  const isKo = locale === "ko";
  const [interval, setInterval] = useState<Interval>("1h");

  const { data, isLoading } = useSWR<{ candles: OHLCCandle[] }>(
    `/api/candles?interval=${interval}&type=premium`,
    fetcher,
    { refreshInterval: 60_000 }
  );

  const candleData: TVCandlePoint[] = (data?.candles ?? []).map((c) => ({
    time: c.time as unknown as Time,
    open:  c.open,
    high:  c.high,
    low:   c.low,
    close: c.close,
  }));

  const last = candleData.at(-1);
  const currentPremium = last?.close ?? 0;
  const isPositive = currentPremium >= 0;

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">{t("title")}</h2>
          {last && (
            <div className={cn("font-number text-xl sm:text-2xl font-bold mt-0.5", isPositive ? "text-emerald-400" : "text-rose-400")}>
              {isPositive ? "+" : ""}{currentPremium.toFixed(3)}%
            </div>
          )}
        </div>

        <div className="flex items-center rounded-lg border border-white/8 bg-white/3 p-0.5 self-start sm:self-auto">
          {INTERVALS.map((iv) => (
            <button
              key={iv}
              onClick={() => setInterval(iv)}
              className={cn(
                "rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200 min-w-[2.5rem]",
                interval === iv ? "bg-[var(--fg)] text-[var(--bg-base)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              )}
            >
              {iv.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="skeleton w-full rounded-lg" style={{ height: 220 }} />
      ) : candleData.length < 2 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2">
          <div className="text-2xl">📊</div>
          <div className="text-sm text-[var(--fg-muted)]">{isKo ? "데이터 없음" : "No data"}</div>
        </div>
      ) : (
        <TVChart
          type="candlestick"
          candleData={candleData}
          height={220}
          bandLines={[{ value: 0, color: "rgba(255,255,255,0.15)", style: "dashed" }]}
          priceFormat={{ type: "price", precision: 3, minMove: 0.001 }}
        />
      )}
      <div className="mt-2 text-right text-xs text-[var(--fg-muted)]">Data: Upbit / OKX</div>
    </div>
  );
}
