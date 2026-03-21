"use client";

import { useState } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import type { IndicatorsResponse } from "@/app/api/indicators/route";
import type { TVDataPoint, TVBandLine } from "@/components/charts/TVChart";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { InfoTooltip, type InfoText } from "@/components/ui/InfoTooltip";

// SSR 비활성화 (lightweight-charts는 브라우저 전용)
const TVChart = dynamic(() => import("@/components/charts/TVChart").then((m) => m.TVChart), {
  ssr: false,
  loading: () => <div className="skeleton w-full rounded-lg" style={{ height: 180 }} />,
});

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ── MVRV 존 정의 (locale-aware) ──────────────────────────────────
function getMvrvBands(locale: string): TVBandLine[] {
  const ko = locale === "ko", zh = locale === "zh";
  return [
    { value: 3.7, color: "#ef4444", label: ko ? "과열" : zh ? "过热" : "Overheated", style: "dashed" },
    { value: 2.4, color: "#f97316", label: ko ? "주의" : zh ? "警惕" : "Caution", style: "dashed" },
    { value: 1.0, color: "#10b981", label: ko ? "적정" : zh ? "合理" : "Fair", style: "dashed" },
    { value: 0.6, color: "#60a5fa", label: ko ? "저평가" : zh ? "低估" : "Undervalued", style: "dashed" },
  ];
}

function getMvrvZone(v: number, locale = "ko"): { label: string; color: string; bg: string } {
  const ko = locale === "ko", zh = locale === "zh";
  if (v > 3.7) return { label: ko ? "과열 🔴" : zh ? "过热 🔴" : "Overheated 🔴", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };
  if (v > 2.4) return { label: ko ? "주의 🟠" : zh ? "警惕 🟠" : "Caution 🟠", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" };
  if (v > 1.0) return { label: ko ? "적정 🟢" : zh ? "合理 🟢" : "Fair 🟢", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
  return { label: ko ? "저평가 🔵" : zh ? "低估 🔵" : "Undervalued 🔵", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
}

// ── 공탐지수 색상 ────────────────────────────────────────────────
function getFngColor(v: number) {
  if (v <= 25) return "#ef4444";
  if (v <= 45) return "#f97316";
  if (v <= 55) return "#eab308";
  if (v <= 75) return "#84cc16";
  return "#10b981";
}

function getFngZone(v: number): { label: string; en: string; zh: string } {
  if (v <= 25) return { label: "극도의 공포", en: "Extreme Fear", zh: "极度恐慌" };
  if (v <= 45) return { label: "공포", en: "Fear", zh: "恐慌" };
  if (v <= 55) return { label: "중립", en: "Neutral", zh: "中性" };
  if (v <= 75) return { label: "탐욕", en: "Greed", zh: "贪婪" };
  return { label: "극도의 탐욕", en: "Extreme Greed", zh: "极度贪婪" };
}

function formatBigUsd(v: number) {
  if (v >= 1e12) return "$" + (v / 1e12).toFixed(2) + "T";
  if (v >= 1e9) return "$" + (v / 1e9).toFixed(1) + "B";
  return "$" + v.toLocaleString();
}

// ── Fear & Greed 계기판 (CNN 스타일 반원 SVG) ───────────────────
function FearGreedGauge({ value, prevValue, locale }: { value: number; prevValue: number; locale: string }) {
  const cx = 100, cy = 108;
  const R = 90, r = 60;
  const SEGS = 120; // 그라데이션 부드럽게

  // 색상 보간 (red → orange → yellow → yellow-green → green)
  const colorStops = [
    { t: 0,    r: 220, g: 38,  b: 38  },
    { t: 0.25, r: 234, g: 88,  b: 12  },
    { t: 0.45, r: 202, g: 138, b: 4   },
    { t: 0.55, r: 101, g: 163, b: 13  },
    { t: 0.75, r: 22,  g: 163, b: 74  },
    { t: 1,    r: 21,  g: 128, b: 61  },
  ];
  function lerpColor(t: number) {
    let i = 0;
    while (i < colorStops.length - 2 && colorStops[i + 1].t < t) i++;
    const s1 = colorStops[i], s2 = colorStops[i + 1];
    const f = Math.max(0, Math.min(1, (t - s1.t) / (s2.t - s1.t)));
    return `rgb(${Math.round(s1.r + f * (s2.r - s1.r))},${Math.round(s1.g + f * (s2.g - s1.g))},${Math.round(s1.b + f * (s2.b - s1.b))})`;
  }

  function ptAt(rad: number, v: number) {
    const θ = Math.PI * (1 - v / 100);
    return { x: cx + rad * Math.cos(θ), y: cy - rad * Math.sin(θ) };
  }

  function arcSeg(v1: number, v2: number, color: string) {
    const o1 = ptAt(R, v1), o2 = ptAt(R, v2);
    const i2 = ptAt(r, v2), i1 = ptAt(r, v1);
    const lg = v2 - v1 > 50 ? 1 : 0;
    const d = [
      `M${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
      `A${R} ${R} 0 ${lg} 0 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
      `L${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
      `A${r} ${r} 0 ${lg} 1 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}Z`,
    ].join(" ");
    return <path key={v1} d={d} fill={color} />;
  }

  // 그라데이션 세그먼트
  const gradSegs = Array.from({ length: SEGS }, (_, i) => {
    const v1 = (i / SEGS) * 100;
    const v2 = ((i + 1) / SEGS) * 100;
    return arcSeg(v1, v2, lerpColor((i + 0.5) / SEGS));
  });

  // 바늘 (CNN처럼 얇은 선 + 작은 뒷꼬리)
  const θn = Math.PI * (1 - value / 100);
  const tipPt  = ptAt(82, value);
  const backPt = { x: cx - 12 * Math.cos(θn), y: cy + 12 * Math.sin(θn) };

  // 존 구분 틱
  const ticks = [0, 25, 45, 55, 75, 100];

  const clr = lerpColor(value / 100);
  const zone = getFngZone(value);
  const prevZone = getFngZone(prevValue);
  const zoneLabel = locale === "en" ? zone.en : locale === "zh" ? zone.zh : zone.label;
  const prevLabel = locale === "en" ? prevZone.en : locale === "zh" ? prevZone.zh : prevZone.label;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 200 118" className="w-full max-w-[280px]">
        {/* 배경 트랙 (어두운 반원) */}
        {arcSeg(0, 100, "#1e2030")}

        {/* 그라데이션 호 */}
        {gradSegs}

        {/* 존 경계 틱 마크 */}
        {ticks.map((v) => {
          const outer = ptAt(R + 3, v);
          const inner = ptAt(r - 3, v);
          return (
            <line
              key={v}
              x1={outer.x.toFixed(2)} y1={outer.y.toFixed(2)}
              x2={inner.x.toFixed(2)} y2={inner.y.toFixed(2)}
              stroke="#0a0a14" strokeWidth="2"
            />
          );
        })}

        {/* 바늘 */}
        <line
          x1={backPt.x.toFixed(2)} y1={backPt.y.toFixed(2)}
          x2={tipPt.x.toFixed(2)}  y2={tipPt.y.toFixed(2)}
          stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.95"
        />

        {/* 허브 */}
        <circle cx={cx} cy={cy} r="9"   fill="#12121e" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="4.5" fill="white"   opacity="0.85" />

        {/* 레이블 */}
        <text x="9"   y="112" textAnchor="middle" fill="#dc2626" fontSize="6" fontWeight="700">EXTREME</text>
        <text x="9"   y="118" textAnchor="middle" fill="#dc2626" fontSize="6" fontWeight="700">FEAR</text>
        <text x="191" y="112" textAnchor="middle" fill="#22c55e" fontSize="6" fontWeight="700">EXTREME</text>
        <text x="191" y="118" textAnchor="middle" fill="#22c55e" fontSize="6" fontWeight="700">GREED</text>
      </svg>

      <div className="text-5xl font-black font-number -mt-2" style={{ color: clr }}>{value}</div>
      <div className="text-base font-bold mt-0.5" style={{ color: clr }}>{zoneLabel}</div>
      <div className="text-xs text-[var(--fg-muted)] mt-1">
        {locale === "ko" ? "어제" : locale === "zh" ? "昨天" : "Yesterday"}: {prevValue} · {prevLabel}
      </div>
    </div>
  );
}

// ── 작은 지표 카드 ───────────────────────────────────────────────
function MetricCard({
  label, value, subValue, color, badge, badgeBg, info, locale,
}: {
  label: string; value: string; subValue?: string;
  color?: string; badge?: string; badgeBg?: string; info?: InfoText; locale?: string;
}) {
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <div className="text-xs text-white">{label}</div>
        {info && <InfoTooltip text={info} locale={locale} />}
      </div>
      <div className={cn("font-number text-xl font-bold", color ?? "text-white")}>{value}</div>
      {subValue && <div className="text-xs text-[var(--fg-muted)]">{subValue}</div>}
      {badge && (
        <span className={cn("mt-1 self-start rounded-full border px-2 py-0.5 text-[10px] font-medium", badgeBg)}>
          {badge}
        </span>
      )}
    </div>
  );
}

// ── 차트 섹션 카드 ───────────────────────────────────────────────
function ChartCard({
  title, subtitle, badge, badgeBg, info, locale, source, children,
}: {
  title: string; subtitle?: string; badge?: string; badgeBg?: string; info?: InfoText; locale?: string; source?: string; children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {info && <InfoTooltip text={info} locale={locale} />}
          </div>
          {subtitle && <p className="text-xs text-[var(--fg-muted)] mt-0.5">{subtitle}</p>}
        </div>
        {badge && (
          <span className={cn("rounded-full border px-2.5 py-1 text-xs font-bold", badgeBg)}>{badge}</span>
        )}
      </div>
      {children}
      {source && <div className="mt-2 text-right text-xs text-[var(--fg-muted)]">Data: {source}</div>}
    </div>
  );
}

// ── 펀딩비 색상 ─────────────────────────────────────────────────
function FundingRateBadge({ value }: { value: number }) {
  const isPos = value > 0;
  const label = `${isPos ? "+" : ""}${value.toFixed(4)}%`;
  return (
    <span className={cn(
      "rounded-full border px-2.5 py-1 text-xs font-bold font-number",
      isPos ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
    )}>
      {label}
    </span>
  );
}

const LABELS = {
  ko: {
    title: "지표 분석", subtitle: "BTC 온체인 · 시장 · 파생상품 지표", tabs: ["온체인", "시장", "파생상품"],
    rsi1d: "RSI 1일봉", rsi1w: "RSI 주봉", rsi1m: "RSI 월봉",
    rsiOverbought: "과매수", rsiOversold: "과매도", rsiUptrend: "상승", rsiDowntrend: "하락",
    stablecoinLabel: "스테이블코인 공급", stablecoinChange: "24h 변동",
    btcOiLabel: "BTC 미결제약정", ethOiLabel: "ETH 미결제약정",
    btcLsLabel: "BTC 롱/숏 비율", ethLsLabel: "ETH 롱/숏 비율",
    longSide: "롱", shortSide: "숏",
    hashRateSub: "네트워크 채굴 능력", addrSub: "24h 활성 주소 수", txSub: "24h 트랜잭션 수",
    mvrvChartSub: "3.7 과열 · 2.4 주의 · 1.0 적정 · 0.6 저평가 기준선",
    hashChartSub: "네트워크 전체 채굴 해시파워 (EH/s)",
    addrChartSub: "일일 활성 지갑 수", txChartSub: "일일 온체인 트랜잭션 수",
    fearGreedTitle: "공포·탐욕 지수", globalTitle: "글로벌 시장 개요",
    coinPremiumTitle: "코인별 현재 김치 프리미엄",
    kimchiHistoryTitle: "평균 김치 프리미엄 히스토리", kimchiHistorySub: "전체 코인 평균 · 5초 갱신",
    collectingData: "실시간 데이터 수집 중...",
    btcFundingLabel: "BTC 펀딩비 (현재)", ethFundingLabel: "ETH 펀딩비 (현재)",
    fundingPeriod: "8시간 주기", annualFundingLabel: "BTC 연환산 펀딩비",
    sentimentLabel: "시장 심리", sentimentBasis: "펀딩비 기준",
    longOverheat: "롱 과열", shortOverheat: "숏 과열", neutral: "중립",
    btcFundingTitle: "BTC 펀딩비 히스토리", btcFundingSub: "양수(+): 롱 우세 · 음수(-): 숏 우세 · 8시간마다 정산",
    ethFundingTitle: "ETH 펀딩비 히스토리", ethFundingSub: "8시간 주기 펀딩비",
    fundingGuideTitle: "📖 펀딩비 해석 가이드",
    vixSub: "30↑ 공포 · 20~30 주의 · 20↓ 안정",
    globalStats: ["총 시가총액", "24h 거래량", "BTC 도미넌스", "ETH 도미넌스", "시총 24h 변동", "활성 코인 수"],
    fundingGuides: [
      { range: "+0.05% 이상", label: "롱 과열", desc: "청산 위험↑, 매도 신호 가능성" },
      { range: "-0.01% ~ +0.01%", label: "중립", desc: "시장 균형 상태, 추세 불명확" },
      { range: "-0.05% 이하", label: "숏 과열", desc: "청산 위험↑, 반등 가능성" },
    ],
  },
  en: {
    title: "Market Indicators", subtitle: "BTC On-chain · Market · Derivatives", tabs: ["On-chain", "Market", "Derivatives"],
    rsi1d: "RSI Daily", rsi1w: "RSI Weekly", rsi1m: "RSI Monthly",
    rsiOverbought: "Overbought", rsiOversold: "Oversold", rsiUptrend: "Uptrend", rsiDowntrend: "Downtrend",
    stablecoinLabel: "Stablecoin Supply", stablecoinChange: "24h Change",
    btcOiLabel: "BTC Open Interest", ethOiLabel: "ETH Open Interest",
    btcLsLabel: "BTC Long/Short", ethLsLabel: "ETH Long/Short",
    longSide: "Long", shortSide: "Short",
    hashRateSub: "Network mining power", addrSub: "24h active addresses", txSub: "24h transactions",
    mvrvChartSub: "3.7↑ overheated · 2.4↑ caution · 1.0 fair · 0.6↓ undervalued",
    hashChartSub: "Total network hash power (EH/s)",
    addrChartSub: "Daily active wallets", txChartSub: "Daily on-chain transactions",
    fearGreedTitle: "Fear & Greed Index", globalTitle: "Global Market Overview",
    coinPremiumTitle: "Korea Premium by Coin",
    kimchiHistoryTitle: "Avg Korea Premium History", kimchiHistorySub: "All coins avg · 5s refresh",
    collectingData: "Collecting live data...",
    btcFundingLabel: "BTC Funding Rate", ethFundingLabel: "ETH Funding Rate",
    fundingPeriod: "8h interval", annualFundingLabel: "BTC Annualized Funding",
    sentimentLabel: "Market Sentiment", sentimentBasis: "Funding rate basis",
    longOverheat: "Long Overheated", shortOverheat: "Short Overheated", neutral: "Neutral",
    btcFundingTitle: "BTC Funding Rate History", btcFundingSub: "Positive: longs dominant · Negative: shorts dominant · Settled every 8h",
    ethFundingTitle: "ETH Funding Rate History", ethFundingSub: "8-hour funding rate",
    fundingGuideTitle: "📖 Funding Rate Guide",
    vixSub: "30↑ Fear · 20–30 Caution · 20↓ Calm",
    globalStats: ["Total Market Cap", "24h Volume", "BTC Dominance", "ETH Dominance", "Market Cap 24h", "Active Coins"],
    fundingGuides: [
      { range: "Above +0.05%", label: "Long Overheated", desc: "Liquidation risk↑, potential sell signal" },
      { range: "-0.01% ~ +0.01%", label: "Neutral", desc: "Balanced market, trend unclear" },
      { range: "Below -0.05%", label: "Short Overheated", desc: "Liquidation risk↑, potential rebound" },
    ],
  },
  zh: {
    title: "市场指标", subtitle: "BTC链上数据 · 市场 · 衍生品", tabs: ["链上数据", "市场", "衍生品"],
    rsi1d: "RSI日线", rsi1w: "RSI周线", rsi1m: "RSI月线",
    rsiOverbought: "超买", rsiOversold: "超卖", rsiUptrend: "上升", rsiDowntrend: "下降",
    stablecoinLabel: "稳定币供应", stablecoinChange: "24h变动",
    btcOiLabel: "BTC未平仓量", ethOiLabel: "ETH未平仓量",
    btcLsLabel: "BTC多空比率", ethLsLabel: "ETH多空比率",
    longSide: "多", shortSide: "空",
    hashRateSub: "网络算力", addrSub: "24h活跃地址数", txSub: "24h交易数",
    mvrvChartSub: "3.7↑过热 · 2.4↑注意 · 1.0合理 · 0.6↓低估",
    hashChartSub: "全网算力 (EH/s)",
    addrChartSub: "每日活跃钱包数", txChartSub: "每日链上交易数",
    fearGreedTitle: "恐慌贪婪指数", globalTitle: "全球市场概况",
    coinPremiumTitle: "各币种当前韩国溢价",
    kimchiHistoryTitle: "平均韩国溢价历史", kimchiHistorySub: "全币种均值 · 5秒刷新",
    collectingData: "实时数据收集中...",
    btcFundingLabel: "BTC资金费率(当前)", ethFundingLabel: "ETH资金费率(当前)",
    fundingPeriod: "8小时周期", annualFundingLabel: "BTC年化资金费率",
    sentimentLabel: "市场情绪", sentimentBasis: "资金费率基准",
    longOverheat: "多头过热", shortOverheat: "空头过热", neutral: "中性",
    btcFundingTitle: "BTC资金费率历史", btcFundingSub: "正数:多头主导 · 负数:空头主导 · 每8小时结算",
    ethFundingTitle: "ETH资金费率历史", ethFundingSub: "8小时资金费率",
    fundingGuideTitle: "📖 资金费率解读指南",
    vixSub: "30↑恐慌 · 20~30注意 · 20↓平稳",
    globalStats: ["总市值", "24h交易量", "BTC主导率", "ETH主导率", "市值24h变动", "活跃币种数"],
    fundingGuides: [
      { range: "+0.05%以上", label: "多头过热", desc: "爆仓风险↑，可能卖出信号" },
      { range: "-0.01% ~ +0.01%", label: "中性", desc: "市场均衡，趋势不明" },
      { range: "-0.05%以下", label: "空头过热", desc: "爆仓风险↑，可能反弹" },
    ],
  },
};

const INFO: Record<string, InfoText> = {
  mvrv: {
    ko: "시장 가치(Market Cap) ÷ 실현 가치(Realized Cap). 3.7↑ 과열(매도 고려), 1.0↓ 저평가(매수 고려). 비트코인의 고/저평가를 보여주는 대표 온체인 지표.",
    en: "Market Cap ÷ Realized Cap. Above 3.7 = overheated (consider selling), below 1.0 = undervalued (consider buying). A key on-chain metric for Bitcoin valuation.",
    zh: "市场价值 ÷ 已实现价值。高于3.7=过热（考虑卖出），低于1.0=低估（考虑买入）。比特币估值的核心链上指标。",
  },
  mvrvChart: {
    ko: "MVRV Ratio 90일 추이. 기준선: 3.7↑ 과열, 2.4↑ 주의, 1.0↓ 저평가, 0.6↓ 강한 매수 구간. CoinMetrics 데이터 기준.",
    en: "90-day MVRV Ratio trend. Bands: 3.7↑ overheated, 2.4↑ caution, 1.0↓ undervalued, 0.6↓ strong buy zone. Source: CoinMetrics.",
    zh: "MVRV比率90天趋势。参考线：3.7↑过热，2.4↑警惕，1.0↓低估，0.6↓强力买入区间。数据来源：CoinMetrics。",
  },
  hashRate: {
    ko: "비트코인 네트워크 전체의 초당 연산 능력(EH/s). 높을수록 네트워크가 강력하고 보안이 뛰어납니다. 채굴자들의 신뢰도와 장기 투자 심리를 나타냅니다.",
    en: "Total computational power of the Bitcoin network per second (EH/s). Higher = stronger network security. Reflects miner confidence and long-term investment sentiment.",
    zh: "比特币网络的每秒算力（EH/s）。越高网络越安全。反映矿工信心和长期投资情绪。",
  },
  activeAddr: {
    ko: "24시간 내 실제로 비트코인을 송/수신한 고유 지갑 주소 수. 높을수록 실수요가 강하고 네트워크 활성도가 높습니다.",
    en: "Unique Bitcoin addresses that sent or received BTC in the past 24h. Higher = stronger real demand and network adoption.",
    zh: "过去24小时内发送或接收比特币的唯一地址数。越高代表真实需求越强，网络采用率越高。",
  },
  txCount: {
    ko: "24시간 동안 비트코인 블록체인에서 처리된 온체인 트랜잭션 수. 실제 네트워크 사용량과 혼잡도를 파악하는 데 활용됩니다.",
    en: "Number of on-chain transactions processed on the Bitcoin blockchain in 24h. Indicates actual network usage and congestion.",
    zh: "比特币区块链24小时内处理的链上交易数量。反映网络实际使用量和拥堵程度。",
  },
  fearGreed: {
    ko: "0~100 사이 값으로 시장 심리를 나타냅니다. 0~25 극도의 공포(매수 기회), 75~100 극도의 탐욕(과열 경고). 변동성·거래량·소셜미디어 등을 종합해 산출. 출처: Alternative.me",
    en: "0–100 index measuring market sentiment. 0–25 Extreme Fear (buying opportunity), 75–100 Extreme Greed (overheating warning). Computed from volatility, volume, social media, and more. Source: Alternative.me",
    zh: "0~100的市场情绪指数。0~25极度恐慌（买入机会），75~100极度贪婪（过热警告）。综合波动性、交易量、社交媒体等计算。来源：Alternative.me",
  },
  kimchiPremium: {
    ko: "국내 거래소(업비트) 가격이 해외 거래소(OKX) 대비 얼마나 높은지 나타내는 수치. 양수면 한국 시장 과열, 음수면 할인 상태. 강세장에서 역사적 최고 50% 이상 기록.",
    en: "Percentage difference between Korean exchange (Upbit) and overseas exchange (OKX) prices. Positive = Korean market premium, negative = discount. Historically peaked above 50% in bull markets.",
    zh: "韩国交易所（Upbit）与海外交易所（OKX）价格差的百分比。正数=韩国溢价，负数=折价。牛市历史最高曾超过50%。",
  },
  vix: {
    ko: "시카고옵션거래소(CBOE) 변동성 지수. S&P500 옵션의 내재 변동성을 나타냄. 20 이하=시장 안정, 20~30=주의, 30↑=공포(리스크 오프). 암호화폐 시장과 역상관 관계 경향.",
    en: "CBOE Volatility Index. Measures implied volatility of S&P500 options. Below 20 = calm, 20–30 = caution, above 30 = fear (risk-off). Tends to have an inverse correlation with crypto.",
    zh: "芝加哥期权交易所波动率指数。衡量标普500期权的隐含波动率。低于20=平稳，20-30=注意，高于30=恐慌（避险）。与加密货币市场有逆相关趋势。",
  },
  fundingBtc: {
    ko: "무기한 선물에서 8시간마다 롱/숏 간 정산 비용. 양수(+)=롱 과열, 음수(-)=숏 과열. 바이낸스 선물 기준.",
    en: "8-hourly fee between long/short futures positions. Positive = longs pay shorts (long overheated). Negative = shorts pay longs (short overheated). Source: OKX.",
    zh: "永续合约中每8小时多空之间结算的资金费率。正数=多头过热，负数=空头过热。数据来源：OKX。",
  },
  fundingEth: {
    ko: "이더리움 무기한 선물 펀딩비. BTC와 함께 전체 시장의 레버리지 과열 여부를 판단하는 데 활용됩니다.",
    en: "Ethereum perpetual futures funding rate. Used alongside BTC funding to assess overall market leverage overheating.",
    zh: "以太坊永续合约资金费率。与BTC资金费率共同用于判断整体市场杠杆过热情况。",
  },
  fundingAnnual: {
    ko: "현재 펀딩비를 연 단위로 환산(8시간 × 3 × 365). 예: 0.01%/8h → 연 10.95%. 차익거래 수익률 계산에 활용.",
    en: "Current funding rate annualized (× 3/day × 365). E.g. 0.01%/8h → 10.95%/yr. Used for funding rate arbitrage yield calculations.",
    zh: "当前资金费率年化换算（×3次/天×365天）。例：0.01%/8h→年化10.95%。用于资金费率套利收益计算。",
  },
  fundingSentiment: {
    ko: "펀딩비 수치로 현재 선물 심리를 요약. +0.05% 이상=롱 과열(조정 위험), -0.05% 이하=숏 과열(반등 가능성).",
    en: "Summarizes current futures sentiment from funding rate. Above +0.05% = longs overheated (correction risk), below -0.05% = shorts overheated (rebound potential).",
    zh: "根据资金费率概括当前合约市场情绪。高于+0.05%=多头过热（调整风险），低于-0.05%=空头过热（反弹可能）。",
  },
  rsi: {
    ko: "RSI(14) — 과매수/과매도 지표. 70↑ 과매수(단기 조정 가능), 30↓ 과매도(반등 가능). OKX BTC-USDT 기준.",
    en: "RSI(14) — Overbought/oversold indicator. Above 70 = overbought (correction risk), below 30 = oversold (rebound potential). Source: OKX BTC-USDT.",
    zh: "RSI(14)——超买/超卖指标。高于70=超买（调整风险），低于30=超卖（反弹可能）。数据来源：OKX BTC-USDT。",
  },
  openInterest: {
    ko: "선물 시장 전체 미결제 포지션 규모. OI 급증=레버리지 과열, OI 급감=청산 연쇄 신호. OKX 무기한 선물 기준.",
    en: "Total open futures positions on exchange. Surging OI = leverage overheating, sharp drop = liquidation cascade risk. Source: OKX perpetuals.",
    zh: "期货市场未平仓头寸总量。OI急升=杠杆过热，急降=爆仓风险。数据来源：OKX永续合约。",
  },
  longShort: {
    ko: "롱 포지션 보유 계좌 vs 숏 포지션 보유 계좌 비율. 롱 편향이 극단적으로 높으면 역설적으로 하락 위험. OKX 계정 기준.",
    en: "Ratio of accounts holding long vs short positions. Extreme long bias = contrarian bearish signal. Source: OKX account data.",
    zh: "持多头与空头仓位账户的比率。多头极端偏高反而是看跌信号。数据来源：OKX账户数据。",
  },
  stablecoin: {
    ko: "전체 블록체인의 스테이블코인 총 발행량. 증가=크립토 시장 자금 유입, 감소=자금 이탈. 출처: DefiLlama.",
    en: "Total stablecoin supply across all chains. Rising = capital inflows into crypto, falling = outflows. Source: DefiLlama.",
    zh: "全链稳定币总供应量。增加=资金流入加密市场，减少=资金外流。数据来源：DefiLlama。",
  },
  fundingChart: {
    ko: "BTC 무기한 선물 펀딩비 이력. 지속적인 높은 양수값=과열(조정 신호), 지속적인 음수값=과도한 비관론(반등 가능성).",
    en: "BTC perpetual futures funding rate history. Persistently high positive values = overheating (correction signal). Persistently negative = excessive pessimism (rebound potential).",
    zh: "BTC永续合约资金费率历史。持续高正值=过热（调整信号），持续负值=过度悲观（反弹可能）。",
  },
};

const PERIODS = [
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "180D", days: 180 },
  { label: "1Y", days: 365 },
];

export function IndicatorsClient({ locale }: { locale: string }) {
  const t = LABELS[locale as keyof typeof LABELS] ?? LABELS.ko;
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState(90);

  const { data, isLoading } = useSWR<IndicatorsResponse>(
    `/api/indicators?days=${period}`,
    fetcher,
    { refreshInterval: 60_000 }
  );

  const history = useAppStore((s) => s.history);
  const allCoins = useAppStore((s) => s.coins);

  // ── 프리미엄 히스토리 → TVDataPoint ────────────────────────────
  const premiumData: TVDataPoint[] = (() => {
    const byTime = new Map<number, number[]>();
    history.forEach((p) => {
      byTime.set(p.timestamp, [...(byTime.get(p.timestamp) ?? []), p.premium]);
    });
    return Array.from(byTime.entries())
      .sort(([a], [b]) => a - b)
      .map(([ts, vals]) => ({
        time: Math.floor(ts / 1000) as unknown as import("lightweight-charts").Time,
        value: parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(3)),
      }));
  })();

  // ── 온체인 데이터 → TVDataPoint ───────────────────────────────
  function toTV(points: { time: string; value: number }[]): TVDataPoint[] {
    return points.map((p) => ({ time: p.time as unknown as import("lightweight-charts").Time, value: p.value }));
  }

  const mvrvData = toTV(data?.mvrv ?? []);
  const hashData = toTV(data?.hashRate ?? []);
  const addrData = toTV(data?.activeAddresses ?? []);
  const txData = toTV(data?.txCount ?? []);

  // ── 펀딩비 → TVDataPoint (히스토그램) ───────────────────────────
  const btcFundingData: TVDataPoint[] = (data?.fundingRates?.btc ?? []).map((p) => ({
    time: Math.floor(p.time / 1000) as unknown as import("lightweight-charts").Time,
    value: p.value,
  }));

  const currentMvrv = mvrvData.at(-1)?.value ?? 0;
  const mvrvZone = getMvrvZone(currentMvrv, locale);

  // RSI
  const rsi = data?.rsi ?? null;
  function getRsiInfo(v: number | null) {
    if (v === null) return { label: "—", color: "text-[var(--fg-muted)]", badge: "", badgeBg: "" };
    if (v >= 70) return { label: v.toFixed(1), color: "text-red-400",    badge: t.rsiOverbought, badgeBg: "bg-red-500/10 border-red-500/20 text-red-400" };
    if (v >= 50) return { label: v.toFixed(1), color: "text-orange-400", badge: t.rsiUptrend,    badgeBg: "bg-orange-500/10 border-orange-500/20 text-orange-400" };
    if (v >= 30) return { label: v.toFixed(1), color: "text-blue-400",   badge: t.rsiDowntrend,  badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-400" };
    return            { label: v.toFixed(1), color: "text-blue-400",   badge: t.rsiOversold,   badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-400" };
  }

  // Open Interest
  const btcOI = data?.openInterest?.btc ?? null;
  const ethOI = data?.openInterest?.eth ?? null;

  // Long/Short
  const btcLS = data?.longShort?.btc ?? null;
  const ethLS = data?.longShort?.eth ?? null;

  // Stablecoin
  const stablecoin = data?.stablecoin ?? null;
  const defiTvl = data?.defiTvl ?? null;
  const mempool = data?.mempool ?? null;
  const trending = data?.trending ?? [];
  const fng = data?.fearGreed;
  const fngColor = fng ? getFngColor(fng.value) : "#6b7280";
  const fngZone = fng ? getFngZone(fng.value) : null;
  const latestBtcFunding = data?.fundingRates?.btc?.at(-1)?.value ?? 0;
  const latestEthFunding = data?.fundingRates?.eth?.at(-1)?.value ?? 0;
  const global = data?.globalMarket;
  const vix = data?.vix ?? null;
  const vixData = toTV(vix?.history ?? []);
  const vixColor = vix ? (vix.value >= 30 ? "#ef4444" : vix.value >= 20 ? "#f97316" : "#10b981") : "#6b7280";
  const VIX_BANDS = [
    { value: 30, color: "#ef444480", label: locale === "ko" ? "공포" : locale === "zh" ? "恐慌" : "Fear", style: "dashed" as const },
    { value: 20, color: "#f9731680", label: locale === "ko" ? "주의" : locale === "zh" ? "注意" : "Caution", style: "dashed" as const },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">{t.subtitle}</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 rounded-xl bg-white/4 p-1 w-fit">
        {t.tabs.map((name, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              tab === i ? "bg-[var(--fg)] text-[var(--bg-base)] shadow-sm" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            )}
          >
            {name}
          </button>
        ))}
      </div>

      {/* ── 온체인 탭 ── */}
      {tab === 0 && (
        <div className="space-y-4">
          {/* 기간 선택 */}
          <div className="flex items-center gap-1 rounded-xl bg-white/4 p-1 w-fit">
            {PERIODS.map(({ label, days }) => (
              <button
                key={days}
                onClick={() => setPeriod(days)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  period === days ? "bg-[var(--fg)] text-[var(--bg-base)] shadow-sm" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* MVRV 요약 카드 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              label="MVRV Ratio"
              value={isLoading ? "—" : currentMvrv.toFixed(2)}
              subValue="Market / Realized Value"
              color={mvrvZone.color}
              badge={mvrvZone.label}
              badgeBg={mvrvZone.bg}
              info={INFO.mvrv} locale={locale}
            />
            <MetricCard
              label="Hash Rate"
              value={isLoading ? "—" : (hashData.at(-1)?.value.toFixed(0) ?? "—") + " EH/s"}
              subValue={t.hashRateSub}
              color="text-[var(--fg)]"
              info={INFO.hashRate} locale={locale}
            />
            <MetricCard
              label="Active Addresses"
              value={isLoading ? "—" : Number(addrData.at(-1)?.value ?? 0).toLocaleString()}
              subValue={t.addrSub}
              color="text-cyan-400"
              info={INFO.activeAddr} locale={locale}
            />
            <MetricCard
              label="Transactions / day"
              value={isLoading ? "—" : Number(txData.at(-1)?.value ?? 0).toLocaleString()}
              subValue={t.txSub}
              color="text-amber-400"
              info={INFO.txCount} locale={locale}
            />
          </div>

          {/* MVRV 차트 */}
          <ChartCard
            title={`MVRV Ratio (${PERIODS.find((p) => p.days === period)?.label ?? "90D"})`}
            subtitle={t.mvrvChartSub}
            badge={isLoading ? "..." : currentMvrv.toFixed(3)}
            badgeBg={mvrvZone.bg + " " + mvrvZone.color}
            info={INFO.mvrvChart} locale={locale} source="Glassnode"
          >
            {isLoading ? (
              <div className="skeleton w-full rounded-lg" style={{ height: 200 }} />
            ) : (
              <TVChart
                data={mvrvData}
                height={200}
                type="area"
                color="#e2e8f0"
                topColor="#e2e8f020"
                bottomColor="#e2e8f004"
                bandLines={getMvrvBands(locale)}
                priceFormat={{ type: "price", precision: 3, minMove: 0.001 }}
              />
            )}
          </ChartCard>

          {/* Hash Rate 차트 */}
          <ChartCard
            title={`Hash Rate (${PERIODS.find((p) => p.days === period)?.label ?? "90D"})`}
            subtitle={t.hashChartSub}
            badge={isLoading ? "..." : (hashData.at(-1)?.value.toFixed(1) ?? "—") + " EH/s"}
            badgeBg="bg-white/8 border-white/12 text-[var(--fg)]"
            info={INFO.hashRate} locale={locale} source="blockchain.com"
          >
            {isLoading ? (
              <div className="skeleton w-full rounded-lg" style={{ height: 180 }} />
            ) : (
              <TVChart
                data={hashData}
                height={180}
                type="area"
                color="#94a3b8"
                topColor="#94a3b840"
                bottomColor="#94a3b804"
                priceFormat={{ type: "price", precision: 1, minMove: 0.1 }}
              />
            )}
          </ChartCard>

          {/* 활성 주소 & 트랜잭션 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title={`Active Addresses (${PERIODS.find((p) => p.days === period)?.label ?? "90D"})`} subtitle={t.addrChartSub} info={INFO.activeAddr} locale={locale} source="Glassnode">
              {isLoading ? (
                <div className="skeleton w-full rounded-lg" style={{ height: 160 }} />
              ) : (
                <TVChart data={addrData} height={160} type="area" color="#06b6d4" topColor="#06b6d440" bottomColor="#06b6d404" />
              )}
            </ChartCard>
            <ChartCard title={`Transaction Count (${PERIODS.find((p) => p.days === period)?.label ?? "90D"})`} subtitle={t.txChartSub} info={INFO.txCount} locale={locale} source="Glassnode">
              {isLoading ? (
                <div className="skeleton w-full rounded-lg" style={{ height: 160 }} />
              ) : (
                <TVChart data={txData} height={160} type="area" color="#f59e0b" topColor="#f59e0b40" bottomColor="#f59e0b04" />
              )}
            </ChartCard>
          </div>

          {/* BTC Mempool */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              label="BTC Mempool"
              value={isLoading ? "—" : mempool ? `${mempool.count.toLocaleString()} txs` : "—"}
              subValue={mempool ? `${(mempool.vsize / 1e6).toFixed(1)} MB` : ""}
              color="text-amber-400"
              info={{ ko: "비트코인 네트워크 미확인 트랜잭션 수. 많을수록 수수료 상승.", en: "Unconfirmed Bitcoin transactions. Higher count = higher fees.", zh: "比特币网络未确认交易数。越多手续费越高。" }}
              locale={locale}
            />
            <MetricCard
              label={locale === "ko" ? "빠른 수수료" : locale === "zh" ? "快速费率" : "Fast Fee"}
              value={isLoading ? "—" : mempool ? `${mempool.fastestFee} sat/vB` : "—"}
              subValue={locale === "ko" ? "다음 블록 (~10분)" : locale === "zh" ? "下一区块 (~10分)" : "Next block (~10 min)"}
              color={mempool ? (mempool.fastestFee > 50 ? "text-red-400" : mempool.fastestFee > 20 ? "text-orange-400" : "text-emerald-400") : "text-[var(--fg-muted)]"}
              info={{ ko: "다음 블록에 포함되기 위한 추천 수수료 (sat/vByte)", en: "Recommended fee for next block inclusion (sat/vByte)", zh: "推荐手续费率 (sat/vByte)" }}
              locale={locale}
            />
            <MetricCard
              label={locale === "ko" ? "보통 수수료" : locale === "zh" ? "普通费率" : "Normal Fee"}
              value={isLoading ? "—" : mempool ? `${mempool.halfHourFee} sat/vB` : "—"}
              subValue={locale === "ko" ? "~30분" : locale === "zh" ? "~30分钟" : "~30 min"}
              color="text-blue-400"
              info={{ ko: "30분 내 확인을 위한 추천 수수료", en: "Recommended fee for ~30 min confirmation", zh: "30分钟内确认的推荐费率" }}
              locale={locale}
            />
            <MetricCard
              label={locale === "ko" ? "저렴한 수수료" : locale === "zh" ? "低费率" : "Low Fee"}
              value={isLoading ? "—" : mempool ? `${mempool.hourFee} sat/vB` : "—"}
              subValue={locale === "ko" ? "~1시간" : locale === "zh" ? "~1小时" : "~1 hour"}
              color="text-[var(--fg-secondary)]"
              info={{ ko: "1시간 내 확인을 위한 추천 수수료", en: "Recommended fee for ~1 hour confirmation", zh: "1小时内确认的推荐费率" }}
              locale={locale}
            />
          </div>

          {/* DeFi TVL */}
          <ChartCard
            title="DeFi TVL"
            subtitle={locale === "ko" ? "전체 DeFi 예치금 (단위: $B)" : locale === "zh" ? "DeFi总锁定价值（十亿美元）" : "Total DeFi Locked Value ($B)"}
            badge={isLoading ? "..." : defiTvl ? `$${(defiTvl.total / 1e9).toFixed(0)}B` : "—"}
            badgeBg={defiTvl && defiTvl.change24h >= 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}
            info={{ ko: "DeFi 프로토콜에 예치된 총 자산 가치 (DefiLlama 기준). 시장 신뢰도 지표.", en: "Total assets locked in DeFi protocols (DefiLlama). Market confidence indicator.", zh: "DeFi协议中锁定的总资产价值（DefiLlama数据）" }}
            locale={locale}
            source="DefiLlama"
          >
            {isLoading || !defiTvl?.history.length ? (
              <div className="skeleton w-full rounded-lg" style={{ height: 180 }} />
            ) : (
              <TVChart
                data={toTV(defiTvl.history)}
                height={180}
                type="area"
                color="#10b981"
                topColor="#10b98130"
                bottomColor="#10b98104"
                priceFormat={{ type: "price", precision: 1, minMove: 0.1 }}
              />
            )}
          </ChartCard>
        </div>
      )}

      {/* ── 시장 탭 ── */}
      {tab === 1 && (
        <div className="space-y-4">
          {/* 기간 선택 (VIX 차트용) */}
          <div className="flex items-center gap-1 rounded-xl bg-white/4 p-1 w-fit">
            {PERIODS.map(({ label, days }) => (
              <button
                key={days}
                onClick={() => setPeriod(days)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  period === days ? "bg-[var(--fg)] text-[var(--bg-base)] shadow-sm" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* RSI + 스테이블코인 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: t.rsi1d, info: getRsiInfo(rsi?.daily ?? null) },
              { label: t.rsi1w, info: getRsiInfo(rsi?.weekly ?? null) },
              { label: t.rsi1m, info: getRsiInfo(rsi?.monthly ?? null) },
            ].map(({ label, info }) => (
              <MetricCard
                key={label}
                label={label}
                value={isLoading ? "—" : info.label}
                color={info.color}
                badge={isLoading ? "" : info.badge}
                badgeBg={info.badgeBg}
                info={INFO.rsi} locale={locale}
              />
            ))}
            <MetricCard
              label={t.stablecoinLabel}
              value={isLoading || !stablecoin ? "—" : formatBigUsd(stablecoin.total)}
              subValue={stablecoin ? `USDT ${formatBigUsd(stablecoin.usdt)} · USDC ${formatBigUsd(stablecoin.usdc)}` : undefined}
              color={stablecoin && stablecoin.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}
              badge={stablecoin ? `${stablecoin.change24h >= 0 ? "+" : ""}${stablecoin.change24h.toFixed(2)}% 24h` : ""}
              badgeBg={stablecoin && stablecoin.change24h >= 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}
              info={INFO.stablecoin} locale={locale}
            />
          </div>

          {/* 트렌딩 코인 */}
          {!isLoading && trending.length > 0 && (
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-white">
                  {locale === "ko" ? "🔥 트렌딩 코인" : locale === "zh" ? "🔥 热门代币" : "🔥 Trending Coins"}
                </span>
                <span className="text-xs text-[var(--fg-muted)]">CoinGecko · 24h</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trending.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-2.5 py-1.5 hover:bg-white/8 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coin.thumb} alt={coin.symbol} width={16} height={16} className="rounded-full" />
                    <span className="text-xs font-medium text-white">{coin.symbol.toUpperCase()}</span>
                    {coin.priceChangePercent !== null && (
                      <span className={cn(
                        "text-[10px] font-medium",
                        coin.priceChangePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {coin.priceChangePercent >= 0 ? "+" : ""}{coin.priceChangePercent.toFixed(1)}%
                      </span>
                    )}
                    {coin.rank > 0 && (
                      <span className="text-[10px] text-[var(--fg-muted)]">#{coin.rank}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 공탐지수 + 글로벌 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* 공탐지수 게이지 */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <h3 className="text-sm font-semibold text-white">{t.fearGreedTitle}</h3>
                <InfoTooltip text={INFO.fearGreed} locale={locale} />
              </div>
              {isLoading || !fng ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="skeleton w-full rounded-xl mx-auto" style={{ maxWidth: 260, height: 130 }} />
                  <div className="skeleton h-12 w-16 rounded-lg" />
                </div>
              ) : (
                <FearGreedGauge value={fng.value} prevValue={fng.previousValue} locale={locale} />
              )}
            </div>

            {/* 글로벌 지표 */}
            <div className="glass rounded-2xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-white mb-4">{t.globalTitle}</h3>
              {!global ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { label: t.globalStats[0], value: formatBigUsd(global.totalMarketCap), icon: "💰" },
                    { label: t.globalStats[1], value: formatBigUsd(global.totalVolume24h), icon: "📊" },
                    { label: t.globalStats[2], value: global.btcDominance.toFixed(1) + "%", icon: "₿", color: "text-orange-400" },
                    { label: t.globalStats[3], value: global.ethDominance.toFixed(1) + "%", icon: "Ξ", color: "text-blue-400" },
                    {
                      label: t.globalStats[4],
                      value: (global.marketCapChange24h > 0 ? "+" : "") + global.marketCapChange24h.toFixed(2) + "%",
                      icon: "📉",
                      color: global.marketCapChange24h >= 0 ? "text-emerald-400" : "text-rose-400",
                    },
                    { label: t.globalStats[5], value: global.activeCryptocurrencies.toLocaleString(), icon: "🪙" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/3 border border-white/5 p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span>{s.icon}</span>
                        <span className="text-xs text-[var(--fg-muted)]">{s.label}</span>
                      </div>
                      <div className={cn("font-number text-lg font-bold", s.color ?? "text-white")}>{s.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 코인별 프리미엄 바 */}
          {allCoins.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">{t.coinPremiumTitle}</h3>
              <div className="space-y-2.5">
                {[...allCoins].filter((c) => c.premium !== null).sort((a, b) => (b.premium ?? 0) - (a.premium ?? 0)).map((coin) => {
                  const pct = Math.min(Math.max(coin.premium ?? 0, -5), 5);
                  const barW = Math.abs(pct) * 10;
                  const isPos = (coin.premium ?? 0) >= 0;
                  return (
                    <div key={coin.symbol} className="flex items-center gap-3">
                      <div className="w-12 text-xs font-semibold text-[var(--fg)] shrink-0">{coin.symbol}</div>
                      <div className="flex-1 h-2 rounded-full bg-white/5 relative overflow-hidden">
                        <div
                          className={cn("absolute top-0 h-full rounded-full transition-all duration-700", isPos ? "bg-emerald-500" : "bg-rose-500")}
                          style={{ width: `${barW}%`, left: isPos ? "50%" : `${50 - barW}%` }}
                        />
                        <div className="absolute top-0 left-1/2 w-px h-full bg-white/10" />
                      </div>
                      <div className={cn("w-16 text-right text-xs font-number font-bold shrink-0", isPos ? "text-emerald-400" : "text-rose-400")}>
                        {isPos ? "+" : ""}{(coin.premium ?? 0).toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIX 차트 */}
          <ChartCard
            title={`VIX — CBOE Volatility Index (${PERIODS.find((p) => p.days === period)?.label ?? "90D"})`}
            subtitle={locale === "ko" ? "30↑ 공포 · 20~30 주의 · 20↓ 안정" : "30↑ Fear · 20–30 Caution · 20↓ Calm"}
            badge={vix ? vix.value.toFixed(1) : "—"}
            badgeBg={`border ${vix ? (vix.value >= 30 ? "bg-red-500/10 border-red-500/20 text-red-400" : vix.value >= 20 ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400") : "bg-white/5 border-white/10 text-[var(--fg-secondary)]"}`}
            info={INFO.vix} locale={locale} source="Yahoo Finance (CBOE)"
          >
            {isLoading || vixData.length === 0 ? (
              <div className="skeleton w-full rounded-lg" style={{ height: 180 }} />
            ) : (
              <TVChart
                data={vixData}
                height={180}
                type="area"
                color={vixColor}
                topColor={vixColor + "40"}
                bottomColor={vixColor + "04"}
                bandLines={VIX_BANDS}
                priceFormat={{ type: "price", precision: 2, minMove: 0.01 }}
              />
            )}
          </ChartCard>

          {/* 김프 히스토리 */}
          <ChartCard title={t.kimchiHistoryTitle} subtitle={t.kimchiHistorySub} info={INFO.kimchiPremium} locale={locale} source="Upbit / OKX">
            {premiumData.length < 3 ? (
              <div className="flex h-40 items-center justify-center text-sm text-[var(--fg-muted)]">{t.collectingData}</div>
            ) : (
              <TVChart
                data={premiumData}
                height={180}
                type="area"
                color="#e2e8f0"
                topColor="#e2e8f020"
                bottomColor="#e2e8f004"
                bandLines={[{ value: 0, color: "rgba(255,255,255,0.2)", style: "dashed" }]}
                priceFormat={{ type: "price", precision: 3, minMove: 0.001 }}
              />
            )}
          </ChartCard>
        </div>
      )}

      {/* ── 파생상품 탭 ── */}
      {tab === 2 && (
        <div className="space-y-4">
          {/* Open Interest + Long/Short */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              label={t.btcOiLabel}
              value={isLoading || !btcOI ? "—" : `${btcOI.oiCcy.toLocaleString("en-US", { maximumFractionDigits: 0 })} BTC`}
              subValue={btcOI ? formatBigUsd(btcOI.oiUsd) : undefined}
              color="text-orange-400"
              info={INFO.openInterest} locale={locale}
            />
            <MetricCard
              label={t.ethOiLabel}
              value={isLoading || !ethOI ? "—" : `${(ethOI.oiCcy / 1000).toFixed(1)}K ETH`}
              subValue={ethOI ? formatBigUsd(ethOI.oiUsd) : undefined}
              color="text-blue-400"
              info={INFO.openInterest} locale={locale}
            />
            <MetricCard
              label={t.btcLsLabel}
              value={isLoading || !btcLS ? "—" : `${(btcLS.longRatio * 100).toFixed(1)}% ${t.longSide}`}
              subValue={btcLS ? `${(btcLS.shortRatio * 100).toFixed(1)}% ${t.shortSide}` : undefined}
              color={btcLS && btcLS.longRatio > 0.6 ? "text-rose-400" : btcLS && btcLS.longRatio < 0.4 ? "text-emerald-400" : "text-[var(--fg)]"}
              badge={btcLS && btcLS.longRatio > 0.65 ? (locale === "ko" ? "롱 과열" : locale === "zh" ? "多头过热" : "Long Extreme") : btcLS && btcLS.longRatio < 0.35 ? (locale === "ko" ? "숏 과열" : locale === "zh" ? "空头过热" : "Short Extreme") : ""}
              badgeBg={btcLS && btcLS.longRatio > 0.65 ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}
              info={INFO.longShort} locale={locale}
            />
            <MetricCard
              label={t.ethLsLabel}
              value={isLoading || !ethLS ? "—" : `${(ethLS.longRatio * 100).toFixed(1)}% ${t.longSide}`}
              subValue={ethLS ? `${(ethLS.shortRatio * 100).toFixed(1)}% ${t.shortSide}` : undefined}
              color={ethLS && ethLS.longRatio > 0.6 ? "text-rose-400" : ethLS && ethLS.longRatio < 0.4 ? "text-emerald-400" : "text-[var(--fg)]"}
              info={INFO.longShort} locale={locale}
            />
          </div>

          {/* 펀딩비 요약 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              label={t.btcFundingLabel}
              value={isLoading ? "—" : `${latestBtcFunding > 0 ? "+" : ""}${latestBtcFunding.toFixed(4)}%`}
              subValue={t.fundingPeriod}
              color={latestBtcFunding > 0 ? "text-emerald-400" : "text-rose-400"}
              info={INFO.fundingBtc} locale={locale}
            />
            <MetricCard
              label={t.ethFundingLabel}
              value={isLoading ? "—" : `${latestEthFunding > 0 ? "+" : ""}${latestEthFunding.toFixed(4)}%`}
              subValue={t.fundingPeriod}
              color={latestEthFunding > 0 ? "text-emerald-400" : "text-rose-400"}
              info={INFO.fundingEth} locale={locale}
            />
            <MetricCard
              label={t.annualFundingLabel}
              value={isLoading ? "—" : `${(latestBtcFunding * 3 * 365).toFixed(1)}%`}
              subValue="8h × 3 × 365"
              color="text-[var(--fg)]"
              info={INFO.fundingAnnual} locale={locale}
            />
            <MetricCard
              label={t.sentimentLabel}
              value={latestBtcFunding > 0.05 ? t.longOverheat : latestBtcFunding < -0.05 ? t.shortOverheat : t.neutral}
              subValue={t.sentimentBasis}
              color={latestBtcFunding > 0.05 ? "text-rose-400" : latestBtcFunding < -0.05 ? "text-emerald-400" : "text-[var(--fg-secondary)]"}
              info={INFO.fundingSentiment} locale={locale}
            />
          </div>

          {/* BTC 펀딩비 히스토그램 */}
          <ChartCard
            title={t.btcFundingTitle}
            subtitle={t.btcFundingSub}
            info={INFO.fundingChart} locale={locale} source="OKX"
          >
            {isLoading || btcFundingData.length === 0 ? (
              <div className="skeleton w-full rounded-lg" style={{ height: 200 }} />
            ) : (
              <TVChart
                data={btcFundingData.map((d) => ({
                  ...d,
                  color: (d.value as number) >= 0 ? "#10b981" : "#ef4444",
                }))}
                height={200}
                type="histogram"
                color="#e2e8f0"
                bandLines={[
                  { value: 0.05, color: "#ef444480", label: t.longOverheat, style: "dashed" },
                  { value: -0.05, color: "#10b98180", label: t.shortOverheat, style: "dashed" },
                  { value: 0, color: "rgba(255,255,255,0.2)", style: "solid" },
                ]}
                priceFormat={{ type: "price", precision: 4, minMove: 0.0001 }}
              />
            )}
          </ChartCard>

          {/* ETH 펀딩비 */}
          <ChartCard title={t.ethFundingTitle} subtitle={t.ethFundingSub} source="OKX">
            {isLoading || (data?.fundingRates?.eth?.length ?? 0) === 0 ? (
              <div className="skeleton w-full rounded-lg" style={{ height: 180 }} />
            ) : (
              <TVChart
                data={(data?.fundingRates?.eth ?? []).map((p) => ({
                  time: Math.floor(p.time / 1000) as unknown as import("lightweight-charts").Time,
                  value: p.value,
                  color: p.value >= 0 ? "#10b981" : "#ef4444",
                }))}
                height={180}
                type="histogram"
                color="#e2e8f0"
                bandLines={[{ value: 0, color: "rgba(255,255,255,0.2)", style: "solid" }]}
                priceFormat={{ type: "price", precision: 4, minMove: 0.0001 }}
              />
            )}
          </ChartCard>

          {/* 펀딩비 해석 가이드 */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">{t.fundingGuideTitle}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {t.fundingGuides.map((g, i) => {
                const colors = [
                  { color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
                  { color: "text-[var(--fg)]", bg: "bg-white/5 border-white/10" },
                  { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                ];
                const { color, bg } = colors[i];
                return (
                  <div key={g.range} className={cn("rounded-xl border p-4", bg)}>
                    <div className={cn("text-xs font-bold mb-1 font-number", color)}>{g.range}</div>
                    <div className="text-sm font-semibold text-white">{g.label}</div>
                    <div className="text-xs text-[var(--fg-muted)] mt-1">{g.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
