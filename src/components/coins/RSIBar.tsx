"use client";

import useSWR from "swr";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import type { RSIResponse } from "@/app/api/rsi/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function rsiStatus(v: number | null, locale: string) {
  if (v === null) return { label: "—", color: "text-[var(--fg-muted)]", fillColor: "#6b7280" };
  const ko = locale === "ko", zh = locale === "zh";
  if (v >= 70) return { label: ko ? "과매수" : zh ? "超买" : "Overbought", color: "text-red-400",    fillColor: "#ef4444" };
  if (v <= 30) return { label: ko ? "과매도" : zh ? "超卖" : "Oversold",   color: "text-blue-400",   fillColor: "#3b82f6" };
  return       { label: ko ? "중립"   : zh ? "中性" : "Neutral",            color: "text-[var(--fg)]",   fillColor: "#94a3b8" };
}

function RSICard({
  label, sublabel, value, locale, tooltip,
}: {
  label: string; sublabel: string; value: number | null;
  locale: string; tooltip: { ko: string; en: string; zh: string };
}) {
  const status = rsiStatus(value, locale);
  const pct = value !== null ? Math.min(100, Math.max(0, value)) : null;
  const isOverbought = pct !== null && pct >= 70;
  const isOversold   = pct !== null && pct <= 30;

  return (
    <div className={cn(
      "glass glass-hover rounded-lg p-4 transition-all duration-500",
      isOverbought && "border-red-500/20",
      isOversold   && "border-blue-500/20",
    )}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <span className="text-xs text-[var(--fg-secondary)]">{label}</span>
          <InfoTooltip text={tooltip} locale={locale} />
        </div>
        {value !== null && (
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-md border",
            status.color,
            isOverbought ? "bg-red-500/10 border-red-500/20" :
            isOversold   ? "bg-blue-500/10 border-blue-500/20" :
                           "bg-white/4 border-white/10"
          )}>
            {status.label}
          </span>
        )}
      </div>

      {/* 큰 숫자 */}
      <div className={cn("font-number text-2xl font-bold leading-none mb-4", status.color)}>
        {value !== null ? value.toFixed(1) : "—"}
      </div>

      {/* RSI 트랙 — 컬러 존 배경 + 채워진 바 + 포인터 */}
      <div className="relative">
        {/* 트랙 배경 (3개 존) */}
        <div className="relative h-3 rounded-full overflow-hidden">
          {/* 전체 배경 */}
          <div className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
          {/* 과매도 존 배경 (0~30%) */}
          <div className="absolute left-0 top-0 h-full" style={{ width: "30%", background: "rgba(59,130,246,0.15)" }} />
          {/* 과매수 존 배경 (70~100%) */}
          <div className="absolute right-0 top-0 h-full" style={{ width: "30%", background: "rgba(239,68,68,0.12)" }} />

          {/* 채워진 바 */}
          {pct !== null && (
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(to right, ${
                  pct <= 30 ? "#3b82f6" :
                  pct >= 70 ? `#94a3b8, #ef4444` :
                  "#94a3b8"
                })`,
                boxShadow: isOverbought ? "0 0 6px 1px rgba(239,68,68,0.4)" :
                           isOversold   ? "0 0 6px 1px rgba(59,130,246,0.4)" : "none",
              }}
            />
          )}

          {/* 30 / 70 구분선 */}
          <div className="absolute left-[30%] top-0 h-full w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
          <div className="absolute left-[70%] top-0 h-full w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* 포인터 삼각형 */}
        {pct !== null && (
          <div
            className="absolute -top-1 -translate-x-1/2 transition-all duration-700"
            style={{ left: `${pct}%` }}
          >
            <div
              className="w-2 h-2 rounded-full border border-gray-900 transition-all duration-700"
              style={{
                background: status.fillColor,
                boxShadow: `0 0 4px ${status.fillColor}`,
              }}
            />
          </div>
        )}
      </div>

      {/* 존 레이블 */}
      <div className="flex justify-between mt-2 text-[10px]">
        <span className="text-blue-500">{locale === "ko" ? "과매도" : locale === "zh" ? "超卖" : "Oversold"}</span>
        <span className="text-[var(--fg-muted)]">{sublabel}</span>
        <span className="text-red-500">{locale === "ko" ? "과매수" : locale === "zh" ? "超买" : "Overbought"}</span>
      </div>
    </div>
  );
}

export function RSIBar() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const isZh = locale === "zh";

  const { data } = useSWR<RSIResponse>("/api/rsi", fetcher, { refreshInterval: 300_000 });

  const cards = [
    {
      label: isKo ? "일봉 RSI" : isZh ? "日线 RSI" : "Daily RSI",
      sublabel: isKo ? "14일" : isZh ? "14日" : "14D",
      value: data?.daily ?? null,
      tooltip: {
        ko: "BTC 일봉 RSI(14). 단기 과열/과매도 판단.\n\n🔵 30 이하: 과매도 — 반등 가능성\n⬜ 30~70: 중립\n🔴 70 이상: 과매수 — 조정 가능성",
        en: "BTC daily RSI(14). Short-term signal.\n\n🔵 Below 30: Oversold — potential bounce\n⬜ 30–70: Neutral\n🔴 Above 70: Overbought — potential pullback",
        zh: "BTC日线RSI(14)。\n\n🔵 低于30：超卖\n⬜ 30-70：中性\n🔴 高于70：超买",
      },
    },
    {
      label: isKo ? "주봉 RSI" : isZh ? "周线 RSI" : "Weekly RSI",
      sublabel: isKo ? "14주" : isZh ? "14周" : "14W",
      value: data?.weekly ?? null,
      tooltip: {
        ko: "BTC 주봉 RSI(14). 중기 추세 판단.\n\n🔵 30 이하: 중기 저점 신호\n⬜ 30~70: 중립\n🔴 70 이상: 중기 고점 가능",
        en: "BTC weekly RSI(14). Medium-term signal.\n\n🔵 Below 30: Medium-term bottom signal\n⬜ 30–70: Neutral\n🔴 Above 70: Medium-term top risk",
        zh: "BTC周线RSI(14)。中期趋势信号。\n\n🔵 低于30：中期底部\n⬜ 30-70：中性\n🔴 高于70：中期顶部风险",
      },
    },
    {
      label: isKo ? "월봉 RSI" : isZh ? "月线 RSI" : "Monthly RSI",
      sublabel: isKo ? "14개월" : isZh ? "14月" : "14M",
      value: data?.monthly ?? null,
      tooltip: {
        ko: "BTC 월봉 RSI(14). 장기 사이클 판단.\n\n🔵 30 이하: 역대급 저점 (2015·2018·2022)\n⬜ 30~70: 중립\n🔴 70 이상: 장기 과열 — 사이클 고점 경고",
        en: "BTC monthly RSI(14). Long-term cycle.\n\n🔵 Below 30: Historic low (2015·2018·2022)\n⬜ 30–70: Neutral\n🔴 Above 70: Cycle top warning",
        zh: "BTC月线RSI(14)。长期周期指标。\n\n🔵 低于30：历史性低点（2015·2018·2022）\n⬜ 30-70：中性\n🔴 高于70：周期顶部警告",
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
