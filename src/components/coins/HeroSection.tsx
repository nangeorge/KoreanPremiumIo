"use client";

import { useLocale } from "next-intl";
import { useAppStore } from "@/store";
import { formatPremium } from "@/lib/utils";

const COPY = {
  ko: {
    headline: "실시간 김치 프리미엄 트래커",
    sub: "업비트(KRW) vs Bybit(USD) 가격 차이로 한국 시장 심리를 추적합니다",
    badge: "137개 코인 · 5초 자동 갱신",
    premiumLabel: "BTC 김프",
    coins: "지원 코인",
    interval: "갱신 주기",
  },
  zh: {
    headline: "实时泡菜溢价追踪器",
    sub: "通过 Upbit(KRW) 与 Bybit(USD) 的价差，追踪韩国市场情绪",
    badge: "支持137种币 · 每5秒更新",
    premiumLabel: "BTC 溢价",
    coins: "支持币种",
    interval: "更新频率",
  },
  en: {
    headline: "Real-time Kimchi Premium Tracker",
    sub: "Track Korean market sentiment through Upbit (KRW) vs Bybit (USD) price spreads",
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
    <div className="rounded-2xl border border-white/6 bg-gradient-to-br from-white/3 to-transparent px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">🌶️</span>
          <h1 className="text-base font-bold text-white">{c.headline}</h1>
        </div>
        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{c.sub}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--fg-muted)] bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {c.badge}
          </span>
        </div>
      </div>

      {/* 실시간 지표 3개 */}
      <div className="flex gap-3 sm:gap-4 shrink-0">
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
