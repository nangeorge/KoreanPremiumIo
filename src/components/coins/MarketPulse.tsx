"use client";

import { useAppStore } from "@/store";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { formatPremium } from "@/lib/utils";

// 프리미엄 기반 시장 서사 — 비전문가도 이해 가능
function getMarketNarrative(p: number | null, locale: string) {
  const ko = locale === "ko", zh = locale === "zh";
  if (p === null) return { emoji: "📡", state: ko ? "데이터 로딩" : zh ? "加载中" : "Loading", story: "", color: "text-gray-400", bg: "bg-white/3 border-white/8" };
  if (p >= 7)  return {
    emoji: "🚨",
    state: ko ? "극과열" : zh ? "极度过热" : "EXTREME",
    story: ko ? "역사적 고점 수준. 단기 급락 리스크 최고조." : zh ? "历史顶部水平，短期崩溃风险极高。" : "Historic peak zone. Short-term crash risk at maximum.",
    color: "text-red-300", bg: "bg-red-500/10 border-red-500/25",
  };
  if (p >= 4)  return {
    emoji: "🔥",
    state: ko ? "고점 경고" : zh ? "高点警告" : "PEAK WARNING",
    story: ko ? "한국 투자자 과열 매수. 과거 이 수준에서 단기 조정이 잦았음." : zh ? "韩国投资者过热买入。历史上此水平常见短期调整。" : "Korean FOMO buying. Short-term corrections historically common at this level.",
    color: "text-orange-300", bg: "bg-orange-500/8 border-orange-500/20",
  };
  if (p >= 2)  return {
    emoji: "⚠️",
    state: ko ? "주의 구간" : zh ? "注意区间" : "CAUTION",
    story: ko ? "국내 매수 열기 상승 중. 과열 여부 지속 모니터링 필요." : zh ? "国内买入热情上升，需持续监控是否过热。" : "Rising local demand. Monitor for overheating signs.",
    color: "text-yellow-300", bg: "bg-yellow-500/6 border-yellow-500/15",
  };
  if (p >= 0)  return {
    emoji: "✅",
    state: ko ? "정상 균형" : zh ? "正常均衡" : "BALANCED",
    story: ko ? "국내외 가격 균형. 건강한 시장 상태." : zh ? "国内外价格均衡，市场状态健康。" : "Balanced KRW/USD pricing. Healthy market state.",
    color: "text-emerald-300", bg: "bg-emerald-500/8 border-emerald-500/20",
  };
  if (p >= -3) return {
    emoji: "😐",
    state: ko ? "무관심" : zh ? "冷漠" : "APATHY",
    story: ko ? "국내 수요 저조. 한국 투자자들이 시장을 외면 중." : zh ? "国内需求低迷，韩国投资者回避市场。" : "Low Korean demand. Local investors avoiding the market.",
    color: "text-gray-300", bg: "bg-white/4 border-white/10",
  };
  return {
    emoji: "❄️",
    state: ko ? "공포 패닉" : zh ? "恐慌" : "FEAR/PANIC",
    story: ko ? "역프리미엄 심화. 한국 시장 패닉 매도 상태. 역사적 저점 신호." : zh ? "负溢价加深，韩国市场恐慌抛售，历史性低点信号。" : "Negative premium deepens. Korean panic selling. Historic bottom signal.",
    color: "text-blue-300", bg: "bg-blue-500/8 border-blue-500/20",
  };
}

export function MarketPulse() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const coins = useAppStore((s) => s.coins);
  const isLoading = useAppStore((s) => s.isLoading);

  const btc = coins.find((c) => c.symbol === "BTC");
  const btcPremium = btc?.premium ?? null;
  const { emoji, state, story, color, bg } = getMarketNarrative(btcPremium, locale);

  // X(Twitter) 공유 텍스트
  const shareText = btcPremium !== null
    ? encodeURIComponent(
        isKo
          ? `🌶️ 지금 BTC 김치 프리미엄: ${formatPremium(btcPremium)} (${state})\n\n${story}\n\n실시간 추적 → koreanpremium.io\n#김치프리미엄 #비트코인`
          : isZh
          ? `🌶️ BTC泡菜溢价: ${formatPremium(btcPremium)} (${state})\n\n${story}\n\n实时追踪 → koreanpremium.io\n#泡菜溢价 #比特币`
          : `🌶️ BTC Kimchi Premium: ${formatPremium(btcPremium)} (${state})\n\n${story}\n\nLive tracker → koreanpremium.io\n#KimchiPremium #Bitcoin`
      )
    : null;

  return (
    <div className={cn("rounded-2xl border p-4 transition-all duration-500", bg)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* 왼쪽: 라이브 배지 + 시장 상태 */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* 라이브 도트 */}
          <div className="flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span className="text-[10px] font-medium text-orange-400 uppercase tracking-wider">Live</span>
          </div>

          {/* 시장 상태 */}
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{emoji}</span>
            <div>
              <span className={cn("text-sm font-black tracking-wide", color)}>
                {isLoading ? "—" : state}
              </span>
              {btcPremium !== null && !isLoading && (
                <span className={cn("ml-2 font-number text-sm font-bold", color)}>
                  {formatPremium(btcPremium)}
                </span>
              )}
            </div>
          </div>

          {/* 서사 (중간 사이즈 이상) */}
          {story && !isLoading && (
            <span className="hidden sm:block text-xs text-gray-500 max-w-xs leading-snug">
              {story}
            </span>
          )}
        </div>

        {/* 오른쪽: 공유 버튼 + 코인 수 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-600">
            {isLoading ? "—" : `${coins.length}${isKo ? "개 코인 추적 중" : isZh ? "种加密货币" : " coins tracked"}`}
          </span>

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
              {isKo ? "공유" : isZh ? "分享" : "Share"}
            </a>
          )}
        </div>
      </div>

      {/* 모바일: 서사 텍스트 */}
      {story && !isLoading && (
        <p className="sm:hidden mt-2 text-xs text-gray-500 leading-snug">{story}</p>
      )}
    </div>
  );
}
