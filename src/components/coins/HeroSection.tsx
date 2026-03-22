"use client";

import { useLocale } from "next-intl";
import { useAppStore } from "@/store";
import { formatPremium } from "@/lib/utils";

const COPY = {
  ko: {
    headline: "왜 김치 프리미엄인가?",
    sub: "한국인은 세계 최고의 투자 민족이다. 전체 인구의 30%가 암호화폐를 보유하고, 글로벌 거래량의 10%가 원화에서 나온다. 그들이 공포에 팔고 탐욕에 살 때, 전 세계가 뒤따른다.",
    badge: "137개 코인 · 5초 자동 갱신",
    premiumLabel: "BTC 김프",
    coins: "지원 코인",
    interval: "갱신 주기",
  },
  zh: {
    headline: "为什么关注泡菜溢价？",
    sub: "韩国人是全球最活跃的加密投资者。30%的人口持有加密货币，原币交易量占全球10%。当他们恐慌抛售或贪婪买入时，全球市场随之波动。",
    badge: "支持137种币 · 每5秒更新",
    premiumLabel: "BTC 溢价",
    coins: "支持币种",
    interval: "更新频率",
  },
  en: {
    headline: "Why Kimchi Premium?",
    sub: "Koreans are the world's most passionate crypto investors. 30% of the population holds crypto, and Korean Won accounts for 10% of global volume. When they panic-sell or FOMO-buy, the rest of the world follows.",
    badge: "137 coins · Updates every 5s",
    premiumLabel: "BTC Premium",
    coins: "Coins",
    interval: "Refresh",
  },
};

export function HeroSection() {
  const locale = useLocale() as "ko" | "zh" | "en";
  const coins = useAppStore((s) => s.coins);
  const c = COPY[locale] ?? COPY.en;

  const btc = coins.find((coin) => coin.symbol === "BTC");
  const btcPremium = btc?.premium ?? null;

  const premiumColor =
    btcPremium === null ? "text-[var(--fg-muted)]" :
    btcPremium >= 5     ? "text-red-400" :
    btcPremium >= 2     ? "text-orange-400" :
    btcPremium >= 0     ? "text-emerald-400" :
                          "text-blue-400";

  return (
    <div className="rounded-2xl border border-white/6 bg-gradient-to-br from-white/3 to-transparent px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-5">
      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🌶️</span>
          <h1 className="text-base font-bold text-white">{c.headline}</h1>
        </div>
        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{c.sub}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--fg-muted)] bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {c.badge}
          </span>
        </div>
      </div>

      {/* 실시간 지표 3개 */}
      <div className="flex gap-3 sm:gap-4 shrink-0 sm:pt-0.5">
        <div className="text-center">
          <div className="text-[10px] text-[var(--fg-muted)] mb-0.5">{c.premiumLabel}</div>
          <div className={`font-number text-lg font-bold ${premiumColor}`}>
            {btcPremium !== null ? formatPremium(btcPremium) : "—"}
          </div>
        </div>
        <div className="w-px bg-white/8" />
        <div className="text-center">
          <div className="text-[10px] text-[var(--fg-muted)] mb-0.5">{c.coins}</div>
          <div className="font-number text-lg font-bold text-white">137</div>
        </div>
        <div className="w-px bg-white/8" />
        <div className="text-center">
          <div className="text-[10px] text-[var(--fg-muted)] mb-0.5">{c.interval}</div>
          <div className="font-number text-lg font-bold text-white">5s</div>
        </div>
      </div>
    </div>
  );
}
