"use client";

import useSWR from "swr";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import type { RSIResponse } from "@/app/api/rsi/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function rsiStatus(v: number | null, locale: string): { label: string; color: string; bg: string } {
  if (v === null) return { label: "—", color: "text-gray-500", bg: "" };
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  if (v >= 70) return {
    label: isKo ? "과매수" : isZh ? "超买" : "Overbought",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  };
  if (v <= 30) return {
    label: isKo ? "과매도" : isZh ? "超卖" : "Oversold",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  };
  return {
    label: isKo ? "중립" : isZh ? "中性" : "Neutral",
    color: "text-gray-300",
    bg: "bg-white/4 border-white/10",
  };
}

function RSICard({
  label,
  sublabel,
  value,
  locale,
  tooltip,
}: {
  label: string;
  sublabel: string;
  value: number | null;
  locale: string;
  tooltip: { ko: string; en: string; zh: string };
}) {
  const status = rsiStatus(value, locale);
  const pct = value !== null ? Math.min(100, Math.max(0, value)) : null;

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs text-gray-500">{label}</span>
        <InfoTooltip text={tooltip} locale={locale} />
      </div>
      <div className="flex items-end justify-between gap-2 mb-2.5">
        <div className={cn("font-number text-2xl font-black leading-none", value === null ? "text-gray-600" : status.color)}>
          {value !== null ? value.toFixed(1) : "—"}
        </div>
        {value !== null && (
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", status.color, status.bg)}>
            {status.label}
          </span>
        )}
      </div>
      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full bg-white/8 overflow-hidden">
        {pct !== null && (
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
              pct >= 70 ? "bg-red-400" : pct <= 30 ? "bg-blue-400" : "bg-indigo-400"
            )}
            style={{ width: `${pct}%` }}
          />
        )}
        {/* 30 / 70 마커 */}
        <div className="absolute left-[30%] top-0 h-full w-px bg-white/20" />
        <div className="absolute left-[70%] top-0 h-full w-px bg-white/20" />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-600">0</span>
        <span className="text-[10px] text-gray-600">{sublabel}</span>
        <span className="text-[10px] text-gray-600">100</span>
      </div>
    </div>
  );
}

export function RSIBar() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const isZh = locale === "zh";

  const { data } = useSWR<RSIResponse>("/api/rsi", fetcher, {
    refreshInterval: 300_000, // 5분
  });

  const cards = [
    {
      label: isKo ? "일봉 RSI" : isZh ? "日线 RSI" : "Daily RSI",
      sublabel: isKo ? "14일" : isZh ? "14日" : "14D",
      value: data?.daily ?? null,
      tooltip: {
        ko: "BTC 일봉 기준 RSI(14). 단기 과열/과매도 판단.\n\n🔵 30 이하: 과매도 — 반등 가능성\n⬜ 30~70: 중립 — 추세 지속\n🔴 70 이상: 과매수 — 조정 가능성",
        en: "BTC daily RSI(14). Short-term overbought/oversold signal.\n\n🔵 Below 30: Oversold — potential bounce\n⬜ 30–70: Neutral\n🔴 Above 70: Overbought — potential pullback",
        zh: "BTC日线RSI(14)。短期超买/超卖信号。\n\n🔵 低于30：超卖—可能反弹\n⬜ 30-70：中性\n🔴 高于70：超买—可能回调",
      },
    },
    {
      label: isKo ? "주봉 RSI" : isZh ? "周线 RSI" : "Weekly RSI",
      sublabel: isKo ? "14주" : isZh ? "14周" : "14W",
      value: data?.weekly ?? null,
      tooltip: {
        ko: "BTC 주봉 기준 RSI(14). 중기 추세 판단.\n\n🔵 30 이하: 과매도 — 중기 저점 신호\n⬜ 30~70: 중립\n🔴 70 이상: 과매수 — 중기 고점 가능",
        en: "BTC weekly RSI(14). Medium-term trend signal.\n\n🔵 Below 30: Oversold — medium-term bottom signal\n⬜ 30–70: Neutral\n🔴 Above 70: Overbought — medium-term top risk",
        zh: "BTC周线RSI(14)。中期趋势信号。\n\n🔵 低于30：超卖—中期底部信号\n⬜ 30-70：中性\n🔴 高于70：超买—中期顶部风险",
      },
    },
    {
      label: isKo ? "월봉 RSI" : isZh ? "月线 RSI" : "Monthly RSI",
      sublabel: isKo ? "14개월" : isZh ? "14月" : "14M",
      value: data?.monthly ?? null,
      tooltip: {
        ko: "BTC 월봉 기준 RSI(14). 장기 사이클 판단.\n\n🔵 30 이하: 역대급 저점 — 강한 매수 신호 (2015, 2018, 2022)\n⬜ 30~70: 중립\n🔴 70 이상: 장기 과열 — 사이클 고점 경고",
        en: "BTC monthly RSI(14). Long-term cycle indicator.\n\n🔵 Below 30: Historic low — strong buy signal (2015, 2018, 2022)\n⬜ 30–70: Neutral\n🔴 Above 70: Long-term overheated — cycle top warning",
        zh: "BTC月线RSI(14)。长期周期指标。\n\n🔵 低于30：历史性低点—强买入信号（2015、2018、2022）\n⬜ 30-70：中性\n🔴 高于70：长期过热—周期顶部警告",
      },
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card) => (
        <RSICard key={card.label} {...card} locale={locale} />
      ))}
    </div>
  );
}
