"use client";

import { useLocale } from "next-intl";
import { useAppStore } from "@/store";
import { formatPremium, cn } from "@/lib/utils";
import useSWR from "swr";
import type { IndicatorsResponse } from "@/app/api/indicators/route";
import type { RSIResponse } from "@/app/api/rsi/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ── 상태 라벨 ─────────────────────────────────────────────────────────────

function premiumState(v: number, locale: string) {
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  if (v >= 7)  return isKo ? "극과열" : isZh ? "极过热" : "Extreme";
  if (v >= 3)  return isKo ? "고점"   : isZh ? "高位"   : "Hot";
  if (v >= 0)  return isKo ? "보통"   : isZh ? "正常"   : "Normal";
  if (v >= -3) return isKo ? "무관심" : isZh ? "冷淡"   : "Cool";
  return         isKo ? "공포"   : isZh ? "恐慌"   : "Fear";
}

function premiumColor(v: number | null) {
  if (v === null) return "text-[var(--fg-muted)]";
  if (v >= 7)  return "text-red-400";
  if (v >= 3)  return "text-orange-400";
  if (v >= 0)  return "text-emerald-400";
  return "text-blue-400";
}

function fngState(v: number, locale: string) {
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  if (v >= 75) return isKo ? "극탐욕" : isZh ? "极贪婪" : "Greed+";
  if (v >= 55) return isKo ? "탐욕"   : isZh ? "贪婪"   : "Greedy";
  if (v >= 45) return isKo ? "중립"   : isZh ? "中立"   : "Neutral";
  if (v >= 25) return isKo ? "공포"   : isZh ? "恐惧"   : "Fear";
  return         isKo ? "극공포" : isZh ? "极恐惧" : "Fear+";
}

function fngColor(v: number) {
  if (v >= 75) return "text-red-400";
  if (v >= 55) return "text-orange-400";
  if (v >= 45) return "text-yellow-400";
  if (v >= 25) return "text-sky-400";
  return "text-blue-500";
}

function vixState(v: number, locale: string) {
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  if (v >= 30) return isKo ? "공포"   : isZh ? "恐慌" : "Fear";
  if (v >= 20) return isKo ? "주의"   : isZh ? "警惕" : "Caution";
  return         isKo ? "안정"   : isZh ? "稳定" : "Stable";
}

function vixColor(v: number) {
  if (v >= 30) return "text-red-400";
  if (v >= 20) return "text-orange-400";
  return "text-emerald-400";
}

function rsiState(v: number, locale: string) {
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  if (v >= 70) return isKo ? "과매수" : isZh ? "超买" : "OB";
  if (v >= 30) return isKo ? "중립"   : isZh ? "中立" : "Neutral";
  return         isKo ? "과매도" : isZh ? "超卖" : "OS";
}

function rsiColor(v: number) {
  if (v >= 70) return "text-red-400";
  if (v >= 30) return "text-[var(--fg-secondary)]";
  return "text-blue-400";
}

// ── 개별 셀 ───────────────────────────────────────────────────────────────

interface CellProps {
  label: string;
  value: string | null;
  state?: string;
  valueClass?: string;
  stateClass?: string;
}

function Cell({ label, value, state, valueClass, stateClass }: CellProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 px-3.5 py-2.5 min-w-[72px]">
      <span className="text-[10px] text-[var(--fg-muted)] whitespace-nowrap">{label}</span>
      <span className={cn("font-number text-base font-bold leading-none whitespace-nowrap", valueClass ?? "text-white")}>
        {value ?? "—"}
      </span>
      {state && (
        <span className={cn("text-[10px] font-medium whitespace-nowrap", stateClass ?? "text-[var(--fg-muted)]")}>
          {state}
        </span>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────

export function DashboardStrip() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const coins = useAppStore((s) => s.coins);

  const { data: indicators } = useSWR<IndicatorsResponse>("/api/indicators", fetcher, {
    refreshInterval: 60_000,
  });
  const { data: rsi } = useSWR<RSIResponse>("/api/rsi", fetcher, {
    refreshInterval: 300_000,
  });

  // BTC / ETH 프리미엄
  const btc = coins.find((c) => c.symbol === "BTC");
  const eth = coins.find((c) => c.symbol === "ETH");
  const btcPremium = btc?.premium ?? null;
  const ethPremium = eth?.premium ?? null;

  // 알트 평균 프리미엄 (상위 20개 non-null)
  const altPremiums = coins
    .filter((c) => c.symbol !== "BTC" && c.premium !== null)
    .slice(0, 20)
    .map((c) => c.premium as number);
  const altAvg = altPremiums.length
    ? altPremiums.reduce((a, b) => a + b, 0) / altPremiums.length
    : null;

  // FNG / VIX
  const fng = indicators?.fearGreed?.value ?? null;
  const vix = indicators?.vix?.value ?? null;
  const dominance = indicators?.globalMarket?.btcDominance ?? null;

  // RSI
  const rsiD = rsi?.daily ?? null;
  const rsiW = rsi?.weekly ?? null;
  const rsiM = rsi?.monthly ?? null;

  const labels = {
    btcPremium: isKo ? "BTC 김프"   : isZh ? "BTC溢价"   : "BTC Premium",
    ethPremium: isKo ? "ETH 김프"   : isZh ? "ETH溢价"   : "ETH Premium",
    altPremium: isKo ? "알트 김프"  : isZh ? "山寨溢价"  : "Alt Premium",
    fng:        isKo ? "공포탐욕"   : isZh ? "恐贪指数"  : "Fear/Greed",
    vix:        isKo ? "VIX"        : isZh ? "VIX"       : "VIX",
    rsiD:       isKo ? "RSI 일봉"   : isZh ? "RSI 日"    : "RSI 1D",
    rsiW:       isKo ? "RSI 주봉"   : isZh ? "RSI 周"    : "RSI 1W",
    rsiM:       isKo ? "RSI 월봉"   : isZh ? "RSI 月"    : "RSI 1M",
    dom:        isKo ? "BTC 도미"   : isZh ? "BTC占比"   : "BTC Dom.",
  };

  return (
    <div className="rounded-2xl border border-white/6 bg-[var(--bg-raised)] overflow-hidden">
      {/* 상단: BTC 김프 강조 */}
      <div className="flex items-stretch border-b border-white/6">
        {/* BTC 김프 — 가장 중요한 지표 */}
        <div className={cn(
          "flex flex-col items-center justify-center px-5 py-3 border-r border-white/6 min-w-[100px]",
          btcPremium !== null && btcPremium >= 3 ? "bg-orange-500/5" :
          btcPremium !== null && btcPremium < 0  ? "bg-blue-500/5"   : "bg-emerald-500/5"
        )}>
          <span className="text-[10px] text-[var(--fg-muted)] mb-0.5">{labels.btcPremium}</span>
          <span className={cn("font-number text-2xl font-black leading-none", premiumColor(btcPremium))}>
            {btcPremium !== null ? formatPremium(btcPremium) : "—"}
          </span>
          {btcPremium !== null && (
            <span className={cn("text-[10px] font-semibold mt-0.5", premiumColor(btcPremium))}>
              {premiumState(btcPremium, locale)}
            </span>
          )}
        </div>

        {/* 나머지 지표들 — 가로 스크롤 */}
        <div className="flex-1 overflow-x-auto scrollbar-none">
          <div className="flex divide-x divide-white/6 min-w-max">
            <Cell
              label={labels.ethPremium}
              value={ethPremium !== null ? formatPremium(ethPremium) : null}
              state={ethPremium !== null ? premiumState(ethPremium, locale) : undefined}
              valueClass={premiumColor(ethPremium)}
              stateClass={premiumColor(ethPremium)}
            />
            <Cell
              label={labels.altPremium}
              value={altAvg !== null ? formatPremium(altAvg) : null}
              state={altAvg !== null ? premiumState(altAvg, locale) : undefined}
              valueClass={premiumColor(altAvg)}
              stateClass={premiumColor(altAvg)}
            />
            <Cell
              label={labels.fng}
              value={fng !== null ? String(fng) : null}
              state={fng !== null ? fngState(fng, locale) : undefined}
              valueClass={fng !== null ? fngColor(fng) : undefined}
              stateClass={fng !== null ? fngColor(fng) : undefined}
            />
            <Cell
              label={labels.vix}
              value={vix !== null ? vix.toFixed(1) : null}
              state={vix !== null ? vixState(vix, locale) : undefined}
              valueClass={vix !== null ? vixColor(vix) : undefined}
              stateClass={vix !== null ? vixColor(vix) : undefined}
            />
            <Cell
              label={labels.rsiD}
              value={rsiD !== null ? rsiD.toFixed(1) : null}
              state={rsiD !== null ? rsiState(rsiD, locale) : undefined}
              valueClass={rsiD !== null ? rsiColor(rsiD) : undefined}
              stateClass={rsiD !== null ? rsiColor(rsiD) : undefined}
            />
            <Cell
              label={labels.rsiW}
              value={rsiW !== null ? rsiW.toFixed(1) : null}
              state={rsiW !== null ? rsiState(rsiW, locale) : undefined}
              valueClass={rsiW !== null ? rsiColor(rsiW) : undefined}
              stateClass={rsiW !== null ? rsiColor(rsiW) : undefined}
            />
            <Cell
              label={labels.rsiM}
              value={rsiM !== null ? rsiM.toFixed(1) : null}
              state={rsiM !== null ? rsiState(rsiM, locale) : undefined}
              valueClass={rsiM !== null ? rsiColor(rsiM) : undefined}
              stateClass={rsiM !== null ? rsiColor(rsiM) : undefined}
            />
            <Cell
              label={labels.dom}
              value={dominance !== null ? `${dominance.toFixed(1)}%` : null}
              valueClass="text-white"
            />
          </div>
        </div>
      </div>

      {/* 하단: Why Kimchi Premium 한 줄 */}
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="text-sm">🌶️</span>
        <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">
          {isKo
            ? "한국인은 세계 최고의 투자 민족 — 전체 인구의 30%가 암호화폐를 보유, 글로벌 거래량의 10%가 원화에서 나온다."
            : isZh
            ? "韩国人是全球最活跃的加密投资者 — 30%人口持有加密货币，原币交易占全球10%。"
            : "Koreans are the world's most passionate crypto investors — 30% own crypto, Korean Won drives 10% of global volume."}
        </p>
        <span className="ml-auto shrink-0 inline-flex items-center gap-1 text-[10px] text-[var(--fg-muted)] bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isKo ? "5초 갱신" : isZh ? "5秒更新" : "5s live"}
        </span>
      </div>
    </div>
  );
}
