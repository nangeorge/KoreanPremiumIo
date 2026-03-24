"use client";

import { useLocale } from "next-intl";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";

const THRESHOLD = 10; // 절대값 김프 경보 기준 (%)

export function HotAlertsTicker() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const coins = useAppStore((s) => s.coins);

  const hotCoins = coins
    .filter((c) => c.premium !== null && Math.abs(c.premium) >= THRESHOLD)
    .sort((a, b) => Math.abs(b.premium!) - Math.abs(a.premium!));

  if (hotCoins.length === 0) return null;

  const label = isKo ? "⚠️ 고김프 경보" : isZh ? "⚠️ 高溢价警报" : "⚠️ High Premium Alert";

  // 심리스 루프를 위해 아이템 2배 복제
  const items = [...hotCoins, ...hotCoins];

  return (
    <div className="w-full border-b border-orange-500/20 bg-orange-500/8 overflow-hidden">
      <div className="flex items-stretch">
        {/* 고정 레이블 */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border-r border-orange-500/20 bg-orange-500/12 z-10">
          <span className="text-[11px] font-bold text-orange-400 whitespace-nowrap tracking-wide uppercase">
            {label}
          </span>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-hidden relative">
          {/* 왼쪽 페이드 */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg-base)] to-transparent z-10 pointer-events-none opacity-60" />
          {/* 오른쪽 페이드 */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg-base)] to-transparent z-10 pointer-events-none opacity-60" />

          <div
            className="flex items-center gap-0 animate-ticker-scroll"
            style={{ width: "max-content" }}
          >
            {items.map((coin, i) => {
              const p = coin.premium!;
              const isHot = p > 0;
              const color = p >= 20 ? "text-red-400" : p >= 10 ? "text-orange-400" : "text-blue-400";
              const bg = p >= 20 ? "bg-red-500/10" : p >= 10 ? "bg-orange-500/10" : "bg-blue-500/10";
              const border = p >= 20 ? "border-red-500/20" : p >= 10 ? "border-orange-500/20" : "border-blue-500/20";
              const arrow = isHot ? "▲" : "▼";
              const name = locale === "ko" ? coin.nameKo : locale === "zh" ? coin.nameZh : coin.name;

              return (
                <div
                  key={`${coin.symbol}-${i}`}
                  className={cn(
                    "flex items-center gap-1.5 mx-2 my-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium whitespace-nowrap shrink-0",
                    bg, border
                  )}
                >
                  {/* 코인 로고 */}
                  {coin.logoUrl && (
                    <img src={coin.logoUrl} alt={coin.symbol} className="w-3.5 h-3.5 rounded-full object-cover" />
                  )}
                  <span className="text-white font-bold">{coin.symbol}</span>
                  <span className="text-[var(--fg-muted)] hidden sm:inline">{name}</span>
                  <span className={cn("font-bold font-number", color)}>
                    {arrow} {Math.abs(p).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
