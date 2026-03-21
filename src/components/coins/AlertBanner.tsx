"use client";

import { useLocale } from "next-intl";
import { useAppStore } from "@/store";
import { formatPremium } from "@/lib/utils";

export function AlertBanner() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const coins = useAppStore((s) => s.coins);
  const btc = coins.find((c) => c.symbol === "BTC");
  const btcPremium = btc?.premium ?? null;

  const shareText = btcPremium !== null
    ? encodeURIComponent(
        isKo
          ? `🌶️ BTC 김치 프리미엄 실시간 확인\n\n현재: ${formatPremium(btcPremium)} — 137개 코인 추적 중\n\n▶ koreanpremium.io\n#김치프리미엄 #비트코인 #업비트`
          : isZh
          ? `🌶️ 比特币泡菜溢价实时监控\n\n当前: ${formatPremium(btcPremium)} — 追踪137种加密货币\n\n▶ koreanpremium.io\n#泡菜溢价 #比特币`
          : `🌶️ BTC Kimchi Premium live tracker\n\nNow: ${formatPremium(btcPremium)} — tracking 137 coins\n\n▶ koreanpremium.io\n#KimchiPremium #Bitcoin #Upbit`
      )
    : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[var(--bg-raised)] to-[var(--bg-base)] p-5">
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/3 blur-3xl pointer-events-none" />
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-orange-500/6 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col gap-3">
        {/* 상단: 헤드라인 */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🌶️</span>
          <p className="text-sm font-bold text-white leading-tight">
            {isKo ? "이 정보, 아는 사람만 알아요" : isZh ? "这些信息，只有知情者才知道" : "Most traders don't see this"}
          </p>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          {isKo
            ? "업비트-바이낸스 가격 차이(김치 프리미엄)는 한국 시장 과열·공포 신호. 137개 코인 실시간 추적."
            : isZh
            ? "Upbit-Binance价差（泡菜溢价）是韩国市场过热/恐慌信号。实时追踪137种加密货币。"
            : "The Upbit-Binance spread signals Korean market greed & fear before it hits the global market. 137 coins live."}
        </p>

        {/* 하단: 버튼 */}
        <div className="flex items-center gap-2 pt-1">
          {shareText && (
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
              {isKo ? "공유하기" : isZh ? "分享" : "Share"}
            </a>
          )}
          <a
            href={`/${locale}`}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {isKo ? "북마크 해두기 →" : isZh ? "收藏此页 →" : "Bookmark this →"}
          </a>
        </div>
      </div>
    </div>
  );
}
