"use client";

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
  const altPremiums = coins
    .filter((c) => c.symbol !== "BTC")
    .map((c) => selectedExchange === "coinbase" ? c.coinbasePremium : c.premium)
    .filter((p): p is number => p !== null);
  const altAvg = altPremiums.length > 0
    ? altPremiums.reduce((s, p) => s + p, 0) / altPremiums.length : 0;

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

  const stats: { label: string; value: string; color: string; tooltip?: { ko: string; en: string; zh: string }; href?: string }[] = [
    {
      label: isKo ? "현재 BTC 프리미엄" : "BTC Premium",
      value: isLoading ? "—" : btcPremium !== null ? formatPremium(btcPremium) : "—",
      color: btcPremium === null ? "text-gray-500" : btcPremium >= 0 ? "text-emerald-400" : "text-rose-400",
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
      value: isLoading ? "—" : `₩${exchangeRate.toLocaleString("ko-KR")}`,
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
          </div>
        );
      })}
    </div>
  );
}
