"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import useSWR from "swr";
import { useAppStore } from "@/store";
import { formatPremium, cn } from "@/lib/utils";
import type { IndicatorsResponse } from "@/app/api/indicators/route";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ExternalLink } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// 프리미엄 → 게이지 위치 (스케일 -5% ~ +10%, 총 범위 15%)
function toGaugePct(p: number) {
  return Math.min(100, Math.max(0, ((p + 5) / 15) * 100));
}

// 프리미엄 존 정보
function getPremiumZone(p: number | null, locale: string) {
  const ko = locale === "ko", zh = locale === "zh";
  if (p === null) return { label: "—", sub: "", color: "text-gray-500", dot: "#6b7280", card: "glass" };
  if (p >= 7)  return { label: ko ? "🔴 극과열" : zh ? "🔴 极度过热" : "🔴 Extreme",  sub: ko ? "역대급 고점 수준" : zh ? "历史顶部" : "Historic peak zone",    color: "text-red-400",     dot: "#ef4444", card: "bg-red-500/10 border border-red-500/25" };
  if (p >= 4)  return { label: ko ? "🟠 고점"   : zh ? "🟠 高点"     : "🟠 Peak",      sub: ko ? "단기 조정 주의"   : zh ? "短期调整风险" : "Correction risk",       color: "text-orange-400",  dot: "#f97316", card: "bg-orange-500/8 border border-orange-500/20" };
  if (p >= 2)  return { label: ko ? "🟡 주의"   : zh ? "🟡 注意"     : "🟡 Caution",   sub: ko ? "과열 가능성 주시" : zh ? "注意过热"   : "Watch overheating",     color: "text-yellow-400",  dot: "#eab308", card: "bg-yellow-500/6 border border-yellow-500/15" };
  if (p >= 0)  return { label: ko ? "🟢 보통"   : zh ? "🟢 正常"     : "🟢 Normal",    sub: ko ? "국내외 가격 균형" : zh ? "价格均衡"   : "Balanced market",       color: "text-emerald-400", dot: "#22c55e", card: "bg-emerald-500/8 border border-emerald-500/20" };
  if (p >= -3) return { label: ko ? "⚪ 무관심" : zh ? "⚪ 冷漠"     : "⚪ Apathy",    sub: ko ? "국내 수요 저조"   : zh ? "国内需求低迷" : "Low local demand",      color: "text-gray-400",    dot: "#9ca3af", card: "glass" };
  return         { label: ko ? "🔵 공포"   : zh ? "🔵 恐慌"     : "🔵 Fear",      sub: ko ? "시장 패닉 상태"   : zh ? "市场恐慌"   : "Market panic",          color: "text-blue-400",    dot: "#3b82f6", card: "bg-blue-500/8 border border-blue-500/20" };
}

// ── 미니 세그먼트 바 (Fear & Greed, VIX 등) ──────────────────────────────
function MiniSegmentBar({ value, max, segments }: {
  value: number;
  max: number;
  segments: { to: number; color: string }[];
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fillColor = segments.find((s) => value <= s.to)?.color ?? segments.at(-1)!.color;
  return (
    <div className="relative h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: fillColor }}
      />
    </div>
  );
}

export function StatsBar() {
  const t = useTranslations("stats");
  const locale = useLocale();
  const isKo = locale === "ko";
  const isZh = locale === "zh";

  const coins = useAppStore((s) => s.coins);
  const exchangeRate = useAppStore((s) => s.exchangeRate);
  const isLoading = useAppStore((s) => s.isLoading);
  const selectedExchange = useAppStore((s) => s.selectedExchange);

  const { data: indicators } = useSWR<IndicatorsResponse>("/api/indicators", fetcher, {
    refreshInterval: 60_000,
  });

  const btc = coins.find((c) => c.symbol === "BTC");
  const btcPremium = (selectedExchange === "coinbase" ? btc?.coinbasePremium : btc?.premium) ?? null;

  const altAvg = useMemo(() => {
    const premiums = coins
      .filter((c) => c.symbol !== "BTC")
      .map((c) => selectedExchange === "coinbase" ? c.coinbasePremium : c.premium)
      .filter((p): p is number => p !== null);
    return premiums.length > 0 ? premiums.reduce((s, p) => s + p, 0) / premiums.length : 0;
  }, [coins, selectedExchange]);

  const mvrvValue = indicators?.mvrv?.at(-1)?.value ?? null;
  const mvrvInfo = mvrvValue === null ? { label: "—", color: "text-gray-500", pct: null }
    : mvrvValue > 3.7 ? { label: isKo ? `${mvrvValue.toFixed(2)} 과열`   : `${mvrvValue.toFixed(2)} Overheated`, color: "text-red-400",     pct: 95 }
    : mvrvValue > 2.4 ? { label: isKo ? `${mvrvValue.toFixed(2)} 주의`   : `${mvrvValue.toFixed(2)} Caution`,    color: "text-orange-400",  pct: 70 }
    : mvrvValue > 1.0 ? { label: isKo ? `${mvrvValue.toFixed(2)} 적정`   : `${mvrvValue.toFixed(2)} Fair`,       color: "text-emerald-400", pct: Math.round((mvrvValue - 1) / (2.4 - 1) * 55 + 15) }
    :                   { label: isKo ? `${mvrvValue.toFixed(2)} 저평가` : `${mvrvValue.toFixed(2)} Undervalued`, color: "text-indigo-400",  pct: 5 };

  const fng = indicators?.fearGreed ?? null;
  const fngValue = fng?.value ?? null;
  const fngInfo = fngValue === null ? { label: "—", color: "text-gray-500" }
    : fngValue >= 80 ? { label: isKo ? `${fngValue} 극탐욕` : isZh ? `${fngValue} 极度贪婪` : `${fngValue} Extreme Greed`, color: "text-red-400" }
    : fngValue >= 60 ? { label: isKo ? `${fngValue} 탐욕`   : isZh ? `${fngValue} 贪婪`     : `${fngValue} Greed`,         color: "text-orange-400" }
    : fngValue >= 40 ? { label: isKo ? `${fngValue} 중립`   : isZh ? `${fngValue} 中性`     : `${fngValue} Neutral`,       color: "text-yellow-400" }
    : fngValue >= 20 ? { label: isKo ? `${fngValue} 공포`   : isZh ? `${fngValue} 恐慌`     : `${fngValue} Fear`,          color: "text-blue-400" }
    :                  { label: isKo ? `${fngValue} 극공포` : isZh ? `${fngValue} 极度恐慌` : `${fngValue} Extreme Fear`,  color: "text-indigo-400" };

  const vixValue = indicators?.vix?.value ?? null;
  const vixInfo = vixValue === null ? { label: "—", color: "text-gray-500" }
    : vixValue >= 30 ? { label: `${vixValue.toFixed(1)} ${isKo ? "공포" : isZh ? "恐慌" : "Fear"}`,     color: "text-red-400" }
    : vixValue >= 20 ? { label: `${vixValue.toFixed(1)} ${isKo ? "주의" : isZh ? "注意" : "Caution"}`,  color: "text-orange-400" }
    :                  { label: `${vixValue.toFixed(1)} ${isKo ? "안정" : isZh ? "稳定" : "Calm"}`,     color: "text-emerald-400" };

  const refPremium = btcPremium ?? altAvg;
  const marketStatus = refPremium > 2 ? t("bullish") : refPremium < -1 ? t("bearish") : t("neutral");
  const statusColor = refPremium > 2 ? "text-emerald-400" : refPremium < -1 ? "text-rose-400" : "text-yellow-400";

  const zone = getPremiumZone(btcPremium, locale);
  const gaugePct = btcPremium !== null ? toGaugePct(btcPremium) : null;

  // BTC 프리미엄 툴팁
  const btcTooltip = {
    ko: "한국 거래소(업비트)와 해외 거래소의 BTC 가격 차이 비율.\n\n🔵 공포 (−3% 이하): 해외 대비 국내가 크게 낮음. 시장 공황.\n⚪ 무관심 (0 ~ −3%): 약한 역프리미엄. 국내 수요 저조.\n🟢 보통 (0 ~ +2%): 정상 범위. 국내외 가격 균형.\n🟡 주의 (+2 ~ +4%): 국내 매수 열기 상승.\n🟠 고점 (+4 ~ +7%): 과거 고점 근처. 단기 조정 가능성↑\n🔴 극과열 (+7% 이상): 극단적 과열. 역사적 고점 수준.",
    en: "BTC price premium of Korean exchange (Upbit) vs offshore.\n\n🔵 Fear (below −3%): Korea well below global. Panic selling.\n⚪ Apathy (0 ~ −3%): Weak negative premium.\n🟢 Normal (0 ~ +2%): Balanced range.\n🟡 Caution (+2 ~ +4%): Rising local demand.\n🟠 Peak (+4 ~ +7%): Near historical highs.\n🔴 Extreme (+7%+): Historic peak zone.",
    zh: "韩国交易所(Upbit)与海外的BTC价格差异比率。\n\n🔵 恐慌 (低于−3%): 国内远低于全球。\n⚪ 冷漠 (0 ~ −3%): 弱负溢价。\n🟢 正常 (0 ~ +2%): 均衡区间。\n🟡 注意 (+2 ~ +4%): 国内买入热情上升。\n🟠 高点 (+4 ~ +7%): 接近历史高位。\n🔴 极过热 (+7%以上): 极度过热。",
  };

  const zoneLabels = isKo
    ? ["❄️ 역프", "중립", "주의", "고점", "🔥 극과열"]
    : isZh
    ? ["❄️ 折价", "正常", "注意", "高点", "🔥 极过热"]
    : ["❄️ Discount", "Normal", "Caution", "Peak", "🔥 Extreme"];

  const scaleLabels = ["-5%", "0%", "+2%", "+5%", "+10%"];
  // zone dividers at 0%, +2%, +4%, +7% → 33.3%, 46.7%, 60%, 80% of gauge
  const dividers = [33.3, 46.7, 60, 80];

  return (
    <div className="space-y-3">

      {/* ── 김치 온도계 (전체 너비) ── */}
      <div className={cn("rounded-2xl p-5 transition-all duration-500", zone.card)}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">

          {/* 왼쪽: 수치 + 시그널 */}
          <div className="flex-shrink-0 min-w-[140px]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-medium text-gray-400">
                {isKo ? "BTC 김치 프리미엄" : isZh ? "BTC 泡菜溢价" : "BTC Kimchi Premium"}
              </span>
              <InfoTooltip text={btcTooltip} locale={locale} />
            </div>
            <div className={cn("font-number font-black leading-none transition-colors duration-500",
              isLoading ? "skeleton rounded w-28 h-10" : "text-4xl sm:text-5xl",
              zone.color
            )}>
              {!isLoading && (btcPremium !== null ? formatPremium(btcPremium) : "—")}
            </div>
            <div className={cn("mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
              isLoading ? "opacity-0" : "opacity-100",
              zone.color,
              btcPremium !== null && btcPremium >= 7  ? "bg-red-500/15 border-red-500/25" :
              btcPremium !== null && btcPremium >= 4  ? "bg-orange-500/12 border-orange-500/20" :
              btcPremium !== null && btcPremium >= 2  ? "bg-yellow-500/10 border-yellow-500/20" :
              btcPremium !== null && btcPremium >= 0  ? "bg-emerald-500/12 border-emerald-500/20" :
              btcPremium !== null && btcPremium >= -3 ? "bg-white/5 border-white/10" :
              "bg-blue-500/12 border-blue-500/20"
            )}>
              {zone.label}
              {zone.sub && <span className="ml-1 opacity-60">· {zone.sub}</span>}
            </div>
          </div>

          {/* 오른쪽: 그라디언트 게이지 */}
          <div className="flex-1 min-w-0">
            {/*
              스케일: -5% ~ +10% (총 범위 15%)
              각 프리미엄 값의 시각적 위치 = (p + 5) / 15 * 100
                -5% → 0%,  0% → 33.3%,  +2% → 46.7%,  +5% → 66.7%,  +7% → 80%,  +10% → 100%
              존 레이블: 각 구간 중앙
                역프(−5~0): 16.7%  / 중립(0~+2): 40%  / 주의(+2~+4): 53.4%
                고점(+4~+7): 70%   / 극과열(+7~+10): 90%
            */}

            {/* 존 레이블 (절대 위치) */}
            <div className="relative h-4 mb-1">
              {([
                { label: zoneLabels[0], pct: 16.7 },
                { label: zoneLabels[1], pct: 40.0 },
                { label: zoneLabels[2], pct: 53.4 },
                { label: zoneLabels[3], pct: 70.0 },
                { label: zoneLabels[4], pct: 90.0 },
              ] as { label: string; pct: number }[]).map(({ label, pct }) => (
                <span
                  key={label}
                  className="absolute text-[10px] text-gray-600 -translate-x-1/2 leading-none"
                  style={{ left: `${pct}%` }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* 게이지 바 */}
            <div
              className="relative h-4 rounded-full overflow-visible"
              style={{
                background: "linear-gradient(to right, #3b82f6 0%, #6b7280 33.3%, #22c55e 46.7%, #eab308 60%, #f97316 80%, #ef4444 100%)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              {/* 존 구분선 (실제 프리미엄 값 기준) */}
              {dividers.map((d) => (
                <div
                  key={d}
                  className="absolute top-0 h-full w-px"
                  style={{ left: `${d}%`, background: "rgba(0,0,0,0.35)" }}
                />
              ))}

              {/* 현재 위치 마커 */}
              {gaugePct !== null && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 z-10"
                  style={{ left: `${gaugePct}%` }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-gray-900"
                    style={{
                      background: zone.dot,
                      boxShadow: `0 0 8px 2px ${zone.dot}80`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* 스케일 레이블 (절대 위치 — 실제 프리미엄 값 기준) */}
            <div className="relative h-4 mt-1">
              {([
                { label: "-5%",  pct: 0 },
                { label: "0%",   pct: 33.3 },
                { label: "+5%",  pct: 66.7 },
                { label: "+10%", pct: 100 },
              ] as { label: string; pct: number }[]).map(({ label, pct }) => (
                <span
                  key={label}
                  className="absolute text-[10px] text-gray-600 font-number leading-none"
                  style={{
                    left: pct === 0 ? 0 : pct === 100 ? "auto" : `${pct}%`,
                    right: pct === 100 ? 0 : "auto",
                    transform: pct === 0 || pct === 100 ? "none" : "translateX(-50%)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 보조 지표 카드 6개 ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

        {/* Alt 평균 프리미엄 */}
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1.5">
            {isKo ? "Alt 평균 프리미엄" : isZh ? "山寨币均值" : "Avg Alt Premium"}
          </div>
          <div className={cn("font-number text-lg font-bold leading-none", altAvg >= 0 ? "text-emerald-400" : "text-rose-400")}>
            {isLoading ? <span className="skeleton rounded block h-6 w-16" /> : formatPremium(altAvg)}
          </div>
          {!isLoading && (
            <MiniSegmentBar
              value={Math.min(10, Math.max(-5, altAvg) + 5)}
              max={15}
              segments={[
                { to: 5,  color: "#3b82f6" },
                { to: 7,  color: "#22c55e" },
                { to: 9,  color: "#eab308" },
                { to: 12, color: "#f97316" },
                { to: 15, color: "#ef4444" },
              ]}
            />
          )}
        </div>

        {/* MVRV */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-xs text-gray-500">MVRV Ratio</span>
            <InfoTooltip text={{
              ko: "시장 가치 ÷ 실현 가치. 3.7↑ 과열, 1.0↓ 저평가.",
              en: "Market Cap ÷ Realized Cap. Above 3.7 = overheated, below 1.0 = undervalued.",
              zh: "市场价值 ÷ 已实现价值。高于3.7=过热，低于1.0=低估。",
            }} locale={locale} />
          </div>
          <div className={cn("font-number text-lg font-bold leading-none", mvrvInfo.color)}>
            {isLoading ? <span className="skeleton rounded block h-6 w-16" /> : mvrvInfo.label}
          </div>
          {!isLoading && mvrvInfo.pct !== null && (
            <MiniSegmentBar
              value={mvrvInfo.pct}
              max={100}
              segments={[
                { to: 25, color: "#6366f1" },
                { to: 60, color: "#22c55e" },
                { to: 80, color: "#f97316" },
                { to: 100, color: "#ef4444" },
              ]}
            />
          )}
        </div>

        {/* Fear & Greed */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-xs text-gray-500">
              {isKo ? "공포탐욕지수" : isZh ? "恐慌贪婪指数" : "Fear & Greed"}
            </span>
            <InfoTooltip text={{
              ko: "시장 심리 지수 (0=극공포, 100=극탐욕). 80↑ 과열 경고, 20↓ 매수 기회.",
              en: "Market sentiment (0=Extreme Fear, 100=Extreme Greed). Above 80 = overheated, below 20 = potential buy.",
              zh: "市场情绪指数（0=极度恐惧，100=极度贪婪）。高于80=过热，低于20=潜在买入机会。",
            }} locale={locale} />
          </div>
          <div className={cn("font-number text-lg font-bold leading-none", fngInfo.color)}>
            {isLoading ? <span className="skeleton rounded block h-6 w-16" /> : fngInfo.label}
          </div>
          {!isLoading && fngValue !== null && (
            <MiniSegmentBar
              value={fngValue}
              max={100}
              segments={[
                { to: 20, color: "#6366f1" },
                { to: 40, color: "#3b82f6" },
                { to: 60, color: "#eab308" },
                { to: 80, color: "#f97316" },
                { to: 100, color: "#ef4444" },
              ]}
            />
          )}
        </div>

        {/* VIX */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-1 mb-1.5">
            <a
              href="https://www.tradingview.com/chart/?symbol=CBOE:VIX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              VIX <ExternalLink size={10} className="shrink-0" />
            </a>
            <InfoTooltip text={{
              ko: "미국 S&P500 변동성 지수. 20↓ 안정, 20~30 주의, 30↑ 공포.",
              en: "US S&P500 Volatility Index. Below 20 = calm, 20–30 = caution, above 30 = fear.",
              zh: "美国标普500波动率指数。低于20=平稳，20-30=注意，高于30=恐慌。",
            }} locale={locale} />
          </div>
          <div className={cn("font-number text-lg font-bold leading-none", vixInfo.color)}>
            {isLoading ? <span className="skeleton rounded block h-6 w-16" /> : vixInfo.label}
          </div>
          {!isLoading && vixValue !== null && (
            <MiniSegmentBar
              value={Math.min(vixValue, 50)}
              max={50}
              segments={[
                { to: 20, color: "#22c55e" },
                { to: 30, color: "#f97316" },
                { to: 50, color: "#ef4444" },
              ]}
            />
          )}
        </div>

        {/* 환율 */}
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1.5">{t("exchangeRate")}</div>
          <div className="font-number text-lg font-bold leading-none text-indigo-300">
            {isLoading
              ? <span className="skeleton rounded block h-6 w-20" />
              : `$1 = ₩${exchangeRate.toLocaleString("ko-KR")}`
            }
          </div>
          {/* 환율 추이 표시 (1300~1500 기준 위치) */}
          {!isLoading && exchangeRate > 0 && (
            <MiniSegmentBar
              value={Math.min(200, Math.max(0, exchangeRate - 1300))}
              max={200}
              segments={[
                { to: 50,  color: "#22c55e" },
                { to: 100, color: "#eab308" },
                { to: 150, color: "#f97316" },
                { to: 200, color: "#ef4444" },
              ]}
            />
          )}
        </div>

        {/* 시장 상태 */}
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1.5">{t("marketStatus")}</div>
          <div className={cn("font-number text-lg font-bold leading-none", statusColor)}>
            {isLoading
              ? <span className="skeleton rounded block h-6 w-16" />
              : marketStatus
            }
          </div>
          {/* 프리미엄 기준 신호 강도 표시 */}
          {!isLoading && (
            <div className="flex items-center gap-1 mt-2">
              {[-2, 0, 2, 4, 6].map((threshold) => (
                <div
                  key={threshold}
                  className="flex-1 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: refPremium > threshold
                      ? (refPremium > 4 ? "#ef4444" : refPremium > 2 ? "#f97316" : "#22c55e")
                      : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
