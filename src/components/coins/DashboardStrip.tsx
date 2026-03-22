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
  tooltip?: string;
  link?: string;
}

function Cell({ label, value, state, valueClass, stateClass, tooltip, link }: CellProps) {
  const inner = (
    <div className="relative group flex flex-col items-center justify-center gap-0.5 px-3.5 py-2.5 min-w-[72px] cursor-default">
      <span className={cn(
        "text-[10px] whitespace-nowrap",
        tooltip ? "text-[var(--fg-muted)] underline decoration-dotted underline-offset-2 decoration-white/20 group-hover:decoration-white/50 transition-colors" : "text-[var(--fg-muted)]"
      )}>
        {label}
      </span>
      <span className={cn("font-number text-base font-bold leading-none whitespace-nowrap", valueClass ?? "text-white")}>
        {value ?? "—"}
      </span>
      {state && (
        <span className={cn("text-[10px] font-medium whitespace-nowrap", stateClass ?? "text-[var(--fg-muted)]")}>
          {state}
        </span>
      )}

      {/* 툴팁 */}
      {tooltip && (
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl border border-white/10 bg-[var(--bg-raised)] p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 text-left">
          <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">{tooltip}</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mt-1.5 inline-block text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
            >
              Learn more ↗
            </a>
          )}
        </div>
      )}
    </div>
  );

  return inner;
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

  const tooltips = {
    ethPremium: isKo
      ? "이더리움의 업비트 vs Bybit 가격 차이. BTC 김프와 함께 한국 시장 전반의 과열도를 측정하는 보조 지표."
      : isZh ? "ETH在Upbit与Bybit之间的价差，辅助判断韩国市场整体热度。"
      : "ETH price spread between Upbit and Bybit. A secondary signal for overall Korean market heat.",
    altPremium: isKo
      ? "상위 20개 알트코인의 평균 김치 프리미엄. BTC보다 높으면 알트 시즌 과열 신호."
      : isZh ? "前20种山寨币的平均泡菜溢价。高于BTC时表示山寨币季节过热。"
      : "Average kimchi premium of the top 20 altcoins. Higher than BTC signals altcoin season overheating.",
    fng: isKo
      ? "크립토 시장 참여자들의 탐욕·공포 심리를 0~100으로 수치화. 75 이상은 극탐욕, 25 이하는 극공포."
      : isZh ? "将加密市场情绪量化为0~100。75以上为极度贪婪，25以下为极度恐惧。"
      : "Crypto market sentiment from 0 (extreme fear) to 100 (extreme greed). Above 75 signals overheating.",
    vix: isKo
      ? "S&P 500 변동성 지수. 30 이상이면 글로벌 금융 공포 구간 — 위험자산 전반에 하락 압력이 커진다."
      : isZh ? "标普500波动率指数。超过30表示全球金融恐慌，风险资产承压。"
      : "S&P 500 volatility index. Above 30 signals global financial fear and broad risk-off pressure.",
    rsiD: isKo
      ? "비트코인 일봉 RSI(14). 70 이상은 과매수(단기 조정 가능), 30 이하는 과매도(반등 가능성)."
      : isZh ? "比特币日线RSI(14)。70以上超买，30以下超卖。"
      : "Bitcoin daily RSI(14). Above 70 = overbought, below 30 = oversold.",
    rsiW: isKo
      ? "비트코인 주봉 RSI(14). 중장기 추세 강도를 측정. 일봉보다 신뢰도가 높다."
      : isZh ? "比特币周线RSI(14)。衡量中长期趋势强度，比日线更可靠。"
      : "Bitcoin weekly RSI(14). Measures mid-term trend strength — more reliable than daily.",
    rsiM: isKo
      ? "비트코인 월봉 RSI(14). 강세장·약세장 사이클 판단에 사용. 70 돌파 시 역대 고점 신호."
      : isZh ? "比特币月线RSI(14)。用于判断牛熊周期。突破70是历史顶部信号。"
      : "Bitcoin monthly RSI(14). Used to identify bull/bear cycles. Above 70 has historically signaled major tops.",
    dom: isKo
      ? "전체 암호화폐 시총 중 비트코인의 비중. 50% 이상이면 BTC 시즌, 40% 이하면 알트 시즌."
      : isZh ? "比特币占总加密市值的比例。50%以上为BTC季节，40%以下为山寨季节。"
      : "Bitcoin's share of total crypto market cap. Above 50% = BTC season, below 40% = altcoin season.",
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
              tooltip={tooltips.ethPremium}
            />
            <Cell
              label={labels.altPremium}
              value={altAvg !== null ? formatPremium(altAvg) : null}
              state={altAvg !== null ? premiumState(altAvg, locale) : undefined}
              valueClass={premiumColor(altAvg)}
              stateClass={premiumColor(altAvg)}
              tooltip={tooltips.altPremium}
            />
            <Cell
              label={labels.fng}
              value={fng !== null ? String(fng) : null}
              state={fng !== null ? fngState(fng, locale) : undefined}
              valueClass={fng !== null ? fngColor(fng) : undefined}
              stateClass={fng !== null ? fngColor(fng) : undefined}
              tooltip={tooltips.fng}
              link="https://alternative.me/crypto/fear-and-greed-index/"
            />
            <Cell
              label={labels.vix}
              value={vix !== null ? vix.toFixed(1) : null}
              state={vix !== null ? vixState(vix, locale) : undefined}
              valueClass={vix !== null ? vixColor(vix) : undefined}
              stateClass={vix !== null ? vixColor(vix) : undefined}
              tooltip={tooltips.vix}
              link="https://finance.yahoo.com/quote/%5EVIX/"
            />
            <Cell
              label={labels.rsiD}
              value={rsiD !== null ? rsiD.toFixed(1) : null}
              state={rsiD !== null ? rsiState(rsiD, locale) : undefined}
              valueClass={rsiD !== null ? rsiColor(rsiD) : undefined}
              stateClass={rsiD !== null ? rsiColor(rsiD) : undefined}
              tooltip={tooltips.rsiD}
              link="https://www.investopedia.com/terms/r/rsi.asp"
            />
            <Cell
              label={labels.rsiW}
              value={rsiW !== null ? rsiW.toFixed(1) : null}
              state={rsiW !== null ? rsiState(rsiW, locale) : undefined}
              valueClass={rsiW !== null ? rsiColor(rsiW) : undefined}
              stateClass={rsiW !== null ? rsiColor(rsiW) : undefined}
              tooltip={tooltips.rsiW}
              link="https://www.investopedia.com/terms/r/rsi.asp"
            />
            <Cell
              label={labels.rsiM}
              value={rsiM !== null ? rsiM.toFixed(1) : null}
              state={rsiM !== null ? rsiState(rsiM, locale) : undefined}
              valueClass={rsiM !== null ? rsiColor(rsiM) : undefined}
              stateClass={rsiM !== null ? rsiColor(rsiM) : undefined}
              tooltip={tooltips.rsiM}
              link="https://www.investopedia.com/terms/r/rsi.asp"
            />
            <Cell
              label={labels.dom}
              value={dominance !== null ? `${dominance.toFixed(1)}%` : null}
              valueClass="text-white"
              tooltip={tooltips.dom}
              link="https://coinmarketcap.com/charts/bitcoin-dominance/"
            />
          </div>
        </div>
      </div>

      {/* 하단: Why Kimchi Premium? + 설명 텍스트 */}
      <div className="flex items-start gap-3 px-4 py-2.5">
        <span className="text-sm mt-0.5">🌶️</span>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-white">
            {isKo ? "왜 김치 프리미엄인가?" : isZh ? "为什么关注泡菜溢价？" : "Why Kimchi Premium?"}
          </span>
          <span className="ml-2 text-[11px] text-[var(--fg-muted)]">
            {isKo
              ? "한국인은 세계 최고의 투자 민족 — 전체 인구의 30%가 암호화폐를 보유, 글로벌 거래량의 10%가 원화에서 나온다. 그들이 공포에 팔고 탐욕에 살 때, 전 세계가 뒤따른다."
              : isZh
              ? "韩国人是全球最活跃的加密投资者 — 30%人口持有加密货币，原币交易占全球10%。当他们恐慌抛售或贪婪买入时，全球市场随之波动。"
              : "Koreans are the world's most passionate crypto investors — 30% own crypto, Korean Won drives 10% of global volume. When they panic-sell or FOMO-buy, the rest of the world follows."}
          </span>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] text-[var(--fg-muted)] bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isKo ? "5초 갱신" : isZh ? "5秒更新" : "5s live"}
        </span>
      </div>
    </div>
  );
}
