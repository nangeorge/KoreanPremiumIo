"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import useSWR from "swr";
import { useAppStore } from "@/store";
import { formatPremium } from "@/lib/utils";
import type { IndicatorsResponse } from "@/app/api/indicators/route";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ExternalLink } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function StatsBar() {
  const t = useTranslations("stats");
  const locale = useLocale();
  const isKo = locale === "ko";

  const coins = useAppStore((s) => s.coins);
  const exchangeRate = useAppStore((s) => s.exchangeRate);
  const isLoading = useAppStore((s) => s.isLoading);
  const selectedExchange = useAppStore((s) => s.selectedExchange);

  const { data: indicators } = useSWR<IndicatorsResponse>("/api/indicators", fetcher, {
    refreshInterval: 60_000,
  });

  // BTC 프리미엄
  const btc = coins.find((c) => c.symbol === "BTC");
  const btcPremium = (selectedExchange === "coinbase" ? btc?.coinbasePremium : btc?.premium) ?? null;

  // Alt 평균 (BTC 제외)
  const altAvg = useMemo(() => {
    const premiums = coins
      .filter((c) => c.symbol !== "BTC")
      .map((c) => selectedExchange === "coinbase" ? c.coinbasePremium : c.premium)
      .filter((p): p is number => p !== null);
    return premiums.length > 0 ? premiums.reduce((s, p) => s + p, 0) / premiums.length : 0;
  }, [coins, selectedExchange]);

  // MVRV
  const mvrvValue = indicators?.mvrv?.at(-1)?.value ?? null;
  const mvrvInfo = mvrvValue === null ? { label: "—", color: "text-gray-500" }
    : mvrvValue > 3.7 ? { label: isKo ? `${mvrvValue.toFixed(2)} 과열` : `${mvrvValue.toFixed(2)} Overheated`, color: "text-red-400" }
    : mvrvValue > 2.4 ? { label: isKo ? `${mvrvValue.toFixed(2)} 주의` : `${mvrvValue.toFixed(2)} Caution`,    color: "text-orange-400" }
    : mvrvValue > 1.0 ? { label: isKo ? `${mvrvValue.toFixed(2)} 적정` : `${mvrvValue.toFixed(2)} Fair`,       color: "text-emerald-400" }
    :                   { label: isKo ? `${mvrvValue.toFixed(2)} 저평가` : `${mvrvValue.toFixed(2)} Undervalued`, color: "text-indigo-400" };

  // Fear & Greed
  const fng = indicators?.fearGreed ?? null;
  const fngValue = fng?.value ?? null;
  const fngInfo = fngValue === null ? { label: "—", color: "text-gray-500" }
    : fngValue >= 80 ? { label: isKo ? `${fngValue} 극탐욕` : `${fngValue} Extreme Greed`, color: "text-red-400" }
    : fngValue >= 60 ? { label: isKo ? `${fngValue} 탐욕` : `${fngValue} Greed`,            color: "text-orange-400" }
    : fngValue >= 40 ? { label: isKo ? `${fngValue} 중립` : `${fngValue} Neutral`,          color: "text-yellow-400" }
    : fngValue >= 20 ? { label: isKo ? `${fngValue} 공포` : `${fngValue} Fear`,             color: "text-blue-400" }
    :                  { label: isKo ? `${fngValue} 극공포` : `${fngValue} Extreme Fear`,   color: "text-indigo-400" };

  // VIX
  const vixData = indicators?.vix ?? null;
  const vixValue = vixData?.value ?? null;
  const vixInfo = vixValue === null ? { label: "—", color: "text-gray-500" }
    : vixValue >= 30 ? { label: `${vixValue.toFixed(1)} ${isKo ? "공포" : "Fear"}`,       color: "text-red-400" }
    : vixValue >= 20 ? { label: `${vixValue.toFixed(1)} ${isKo ? "주의" : "Caution"}`,   color: "text-orange-400" }
    :                  { label: `${vixValue.toFixed(1)} ${isKo ? "안정" : "Calm"}`,       color: "text-emerald-400" };

  // 시장 상태
  const refPremium = btcPremium ?? altAvg;
  const marketStatus = refPremium > 2 ? t("bullish") : refPremium < -1 ? t("bearish") : t("neutral");
  const statusColor = refPremium > 2 ? "text-emerald-400" : refPremium < -1 ? "text-rose-400" : "text-yellow-400";

  // 김프 시그널
  const btcSignal = btcPremium === null ? null
    : btcPremium >= 20  ? { ko: "🔴 초고점", en: "🔴 Extreme Peak", zh: "🔴 极高点", color: "text-red-400 bg-red-500/10 border-red-500/20" }
    : btcPremium >= 10  ? { ko: "🟠 고점",   en: "🟠 Peak",         zh: "🟠 高点",  color: "text-orange-400 bg-orange-500/10 border-orange-500/20" }
    : btcPremium >= 3   ? { ko: "🟡 주의",   en: "🟡 Caution",      zh: "🟡 注意",  color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" }
    : btcPremium >= 0   ? { ko: "🟢 보통",   en: "🟢 Normal",       zh: "🟢 正常",  color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
    : btcPremium >= -3  ? { ko: "⚪ 무관심", en: "⚪ Apathy",        zh: "⚪ 冷漠",  color: "text-gray-400 bg-white/5 border-white/10" }
    :                     { ko: "🔵 공포",   en: "🔵 Fear",          zh: "🔵 恐慌",  color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };

  const stats: { label: string; value: string; color: string; tooltip?: { ko: string; en: string; zh: string }; href?: string }[] = [
    {
      label: isKo ? "현재 BTC 프리미엄" : "BTC Premium",
      value: isLoading ? "—" : btcPremium !== null ? formatPremium(btcPremium) : "—",
      color: btcPremium === null ? "text-gray-500" : btcPremium >= 0 ? "text-emerald-400" : "text-rose-400",
      tooltip: {
        ko: "한국 거래소(업비트)와 해외 거래소의 BTC 가격 차이 비율.\n\n🔵 공포 (−3% 이하): 해외 대비 국내가 크게 낮음. 시장 공황, 투자자 이탈.\n⚪ 무관심 (0 ~ −3%): 약한 역프리미엄. 국내 수요 저조.\n🟢 보통 (0 ~ +3%): 정상 범위. 국내외 가격 균형.\n🟡 주의 (+3 ~ +10%): 국내 매수 열기 상승. 과열 가능성 주의.\n🟠 고점 (+10 ~ +20%): 과거 고점 근처. 단기 조정 가능성↑\n🔴 초고점 (+20% 이상): 극단적 과열. 역사적 고점 수준.\n\n※ 경험치 기반 기준선으로 투자 결론을 내리지 마세요.",
        en: "BTC price premium of Korean exchange (Upbit) vs offshore.\n\n🔵 Fear (below −3%): Korea trades well below global. Panic selling.\n⚪ Apathy (0 ~ −3%): Weak negative premium. Low local demand.\n🟢 Normal (0 ~ +3%): Balanced range.\n🟡 Caution (+3 ~ +10%): Rising local demand. Watch for overheating.\n🟠 Peak (+10 ~ +20%): Near historical highs. Short-term correction risk↑\n🔴 Extreme Peak (+20%+): Extreme overheating. Historical peak levels.\n\n※ Heuristic guidelines only — not financial advice.",
        zh: "韩国交易所(Upbit)与海外的BTC价格差异比率。\n\n🔵 恐慌 (低于−3%): 国内远低于全球。恐慌抛售。\n⚪ 冷漠 (0 ~ −3%): 弱负溢价。国内需求低迷。\n🟢 正常 (0 ~ +3%): 均衡区间。\n🟡 注意 (+3 ~ +10%): 国内买入热情上升，注意过热。\n🟠 高点 (+10 ~ +20%): 接近历史高位，短期调整风险↑\n🔴 极高点 (+20%以上): 极度过热，历史顶部水平。\n\n※ 仅供参考，不构成投资建议。",
      },
    },
    {
      label: isKo ? "Alt 평균 프리미엄" : "Avg Alt Premium",
      value: isLoading ? "—" : formatPremium(altAvg),
      color: altAvg >= 0 ? "text-emerald-400" : "text-rose-400",
    },
    {
      label: "MVRV Ratio",
      value: mvrvInfo.label,
      color: mvrvInfo.color,
      tooltip: {
        ko: "시장 가치(Market Cap) ÷ 실현 가치(Realized Cap). 3.7↑ 과열(매도 고려), 2.4↑ 주의, 1.0↓ 저평가(매수 고려).",
        en: "Market Cap ÷ Realized Cap. Above 3.7 = overheated (consider selling), below 1.0 = undervalued (consider buying).",
        zh: "市场价值 ÷ 已实现价值。高于3.7=过热，低于1.0=低估。",
      },
    },
    {
      label: isKo ? "공포탐욕지수" : "Fear & Greed",
      value: fngInfo.label,
      color: fngInfo.color,
      tooltip: {
        ko: "시장 심리 지수 (0=극공포, 100=극탐욕). 가격 변동성, 거래량, SNS 감성, 설문 등 종합. 80↑ 과열 경고, 20↓ 매수 기회 신호.",
        en: "Market sentiment index (0=Extreme Fear, 100=Extreme Greed). Based on volatility, volume, social sentiment, surveys. Above 80 = overheated, below 20 = potential buying opportunity.",
        zh: "市场情绪指数（0=极度恐惧，100=极度贪婪）。综合波动率、交易量、社交媒体情绪等。高于80=过热，低于20=潜在买入机会。",
      },
    },
    {
      label: "VIX",
      value: vixInfo.label,
      color: vixInfo.color,
      href: "https://www.tradingview.com/chart/?symbol=CBOE:VIX",
      tooltip: {
        ko: "미국 S&P500 변동성 지수 (공포지수). 20 이하=시장 안정, 20~30=주의, 30↑=공포(리스크 오프). 암호화폐 시장과 상관관계 있음.",
        en: "US S&P500 Volatility Index (fear gauge). Below 20 = calm, 20–30 = caution, above 30 = fear (risk-off). Correlated with crypto market.",
        zh: "美国标普500波动率指数（恐慌指数）。低于20=市场平稳，20-30=注意，高于30=恐慌（避险）。与加密货币市场有关联。",
      },
    },
    {
      label: t("exchangeRate"),
      value: isLoading ? "—" : `$1 = ₩${exchangeRate.toLocaleString("ko-KR")}`,
      color: "text-indigo-300",
    },
    {
      label: t("marketStatus"),
      value: isLoading ? "—" : marketStatus,
      color: statusColor,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {stats.map((stat, i) => {
        const isBtcPremium = i === 0;
        let cardClass = "glass rounded-xl p-4 transition-all duration-300 hover:border-white/10";
        if (isBtcPremium && btcPremium !== null) {
          cardClass = btcPremium >= 0
            ? "rounded-xl p-4 transition-all duration-300 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40"
            : "rounded-xl p-4 transition-all duration-300 bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40";
        }
        return (
          <div
            key={stat.label}
            className={cardClass}
          >
            <div className="flex items-center gap-1 mb-1.5">
              {stat.href ? (
                <a
                  href={stat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {stat.label}
                  <ExternalLink size={10} className="shrink-0" />
                </a>
              ) : (
                <span className={`text-xs ${isBtcPremium ? "text-gray-400 font-medium" : "text-gray-500"}`}>
                  {stat.label}
                </span>
              )}
              {stat.tooltip && <InfoTooltip text={stat.tooltip} locale={locale} />}
            </div>
            <div
              className={`font-number leading-none ${isBtcPremium ? "text-2xl font-black" : "text-lg font-bold"} ${stat.color} ${isLoading ? "skeleton rounded" : ""}`}
            >
              {isLoading ? "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" : stat.value}
            </div>
            {isBtcPremium && !isLoading && btcSignal && (
              <div className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${btcSignal.color}`}>
                {locale === "ko" ? btcSignal.ko : locale === "zh" ? btcSignal.zh : btcSignal.en}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
