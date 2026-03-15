"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useLocale } from "next-intl";
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

type BtcExchange = "upbit" | "binance" | "coinbase";

const EXCHANGE_LABELS: Record<BtcExchange, { ko: string; en: string }> = {
  upbit:    { ko: "업비트",    en: "Upbit"    },
  binance:  { ko: "바이낸스",  en: "Binance"  },
  coinbase: { ko: "코인베이스", en: "Coinbase" },
};
const EXCHANGE_CURRENCY: Record<BtcExchange, string> = {
  upbit: "KRW", binance: "USD", coinbase: "USD",
};

// 4H is shown as "6H" when Coinbase is selected (Coinbase doesn't support 4H)
function getIntervalLabel(iv: Interval, exchange: BtcExchange) {
  if (iv === "4h" && exchange === "coinbase") return "6H";
  return iv.toUpperCase();
}

function formatPrice(v: number, currency: string, locale = "ko"): string {
  if (currency === "KRW") {
    if (locale === "ko") {
      if (v >= 100_000_000) return `₩${(v / 100_000_000).toFixed(2)}억`;
      if (v >= 10_000)      return `₩${v.toLocaleString("ko-KR")}`;
      return `₩${v.toFixed(0)}`;
    }
    // English: show full number with commas
    return `₩${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  // USD
  if (v >= 1_000) return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `$${v.toFixed(2)}`;
}

export function BTCChart() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const [interval, setInterval] = useState<Interval>("1h");
  const [exchange, setExchange] = useState<BtcExchange>("upbit");

  const currency = EXCHANGE_CURRENCY[exchange];

  const { data, isLoading } = useSWR<{ candles: OHLCCandle[] }>(
    `/api/candles?interval=${interval}&type=btc&exchange=${exchange}`,
    fetcher,
    { refreshInterval: 60_000 }
  );

  const candleData: TVCandlePoint[] = (data?.candles ?? []).map((c) => ({
    time:  c.time as unknown as Time,
    open:  c.open,
    high:  c.high,
    low:   c.low,
    close: c.close,
  }));

  const last = candleData.at(-1);
  const prev = candleData.at(-2);
  const pct = last && prev && prev.close !== 0
    ? ((last.close - prev.close) / prev.close) * 100
    : 0;
  const isUp = pct >= 0;

  const priceFormat = currency === "KRW"
    ? { type: "price" as const, precision: 0, minMove: 1 }
    : { type: "price" as const, precision: 0, minMove: 1 };

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      {/* 헤더: 모바일에서 세로 스택 */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="text-orange-400">₿</span> {isKo ? "비트코인" : "Bitcoin"}
            <span className="text-xs text-gray-500 font-normal">({currency})</span>
          </h2>
          {last && (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-number text-xl sm:text-2xl font-bold text-white">
                {formatPrice(last.close, currency, locale)}
              </span>
              <span className={cn("font-number text-sm font-medium", isUp ? "text-emerald-400" : "text-rose-400")}>
                {isUp ? "+" : ""}{pct.toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* 인터벌 버튼 */}
        <div className="flex items-center rounded-lg border border-white/8 bg-white/3 p-0.5 self-start sm:self-auto">
          {INTERVALS.map((iv) => (
            <button
              key={iv}
              onClick={() => setInterval(iv)}
              className={cn(
                "rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-200 min-w-[2.5rem]",
                interval === iv ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-300"
              )}
            >
              {getIntervalLabel(iv, exchange)}
            </button>
          ))}
        </div>
      </div>

      {/* 거래소 선택 — 모바일에서 줄바꿈 허용 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(Object.keys(EXCHANGE_LABELS) as BtcExchange[]).map((id) => (
          <button
            key={id}
            onClick={() => setExchange(id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 border",
              exchange === id
                ? "bg-orange-500/15 border-orange-500/30 text-orange-300"
                : "border-white/8 bg-white/3 text-gray-500 hover:text-gray-300 hover:border-white/15"
            )}
          >
            {isKo ? EXCHANGE_LABELS[id].ko : EXCHANGE_LABELS[id].en} · {EXCHANGE_CURRENCY[id]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="skeleton w-full rounded-lg" style={{ height: 200 }} />
      ) : candleData.length < 2 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2">
          <div className="text-2xl">📊</div>
          <div className="text-sm text-gray-500">{isKo ? "데이터 없음" : "No data"}</div>
        </div>
      ) : (
        <TVChart
          type="candlestick"
          candleData={candleData}
          height={200}
          priceFormat={priceFormat}
        />
      )}
    </div>
  );
}
