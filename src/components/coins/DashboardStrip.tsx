"use client";

import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { useAppStore } from "@/store";
import { formatPremium, cn } from "@/lib/utils";
import useSWR from "swr";
import { Copy, Check } from "lucide-react";
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
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const triggerRef = useRef<HTMLDivElement>(null);

  const show = () => {
    clearTimeout(timer.current);
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top });
    }
  };
  const hide = () => { timer.current = setTimeout(() => setPos(null), 120); };

  return (
    <div
      ref={triggerRef}
      className="flex flex-col items-center justify-center gap-0.5 px-3.5 py-2.5 min-w-[72px] cursor-default"
      onMouseEnter={tooltip ? show : undefined}
      onMouseLeave={tooltip ? hide : undefined}
    >
      <span className={cn(
        "text-[10px] whitespace-nowrap transition-colors",
        tooltip ? "text-[var(--fg-muted)] underline decoration-dotted underline-offset-2 decoration-white/20 hover:decoration-white/50" : "text-[var(--fg-muted)]"
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

      {/* 툴팁 — fixed로 overflow 탈출 */}
      {tooltip && pos && (
        <div
          className="fixed w-56 rounded-xl border border-white/10 bg-[#1a1a1a] p-3 shadow-2xl z-[999] text-left"
          style={{ left: pos.x, top: pos.y - 8, transform: "translate(-50%, -100%)" }}
          onMouseEnter={() => { clearTimeout(timer.current); }}
          onMouseLeave={hide}
        >
          <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">{tooltip}</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
            >
              Learn more ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── SNS 공유 버튼 ─────────────────────────────────────────────────────────

interface ShareButtonsProps {
  btcPremium: number | null;
  fng: number | null;
  vix: number | null;
  rsiD: number | null;
  locale: string;
}

function ShareButtons({ btcPremium, fng, vix, rsiD, locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = "https://koreanpremium.io";
  const isKo = locale === "ko";
  const isZh = locale === "zh";

  const premiumStr = btcPremium !== null
    ? `${btcPremium >= 0 ? "+" : ""}${btcPremium.toFixed(2)}%`
    : null;

  // Twitter — 280자 제한, 간결하게
  const twitterText = isKo
    ? [
        `🌶️ BTC 김치 프리미엄 ${premiumStr ?? "—"}`,
        fng !== null ? `공포탐욕: ${fng} | RSI(1D): ${rsiD?.toFixed(1) ?? "—"}` : "",
        "한국인 30%가 코인 보유, 글로벌 거래량 10%가 원화 — 고점 김프 +50%, 저점 역프 -5%",
      ].filter(Boolean).join("\n")
    : isZh
    ? [
        `🌶️ BTC泡菜溢价 ${premiumStr ?? "—"}`,
        fng !== null ? `恐贪指数: ${fng} | RSI(1D): ${rsiD?.toFixed(1) ?? "—"}` : "",
        "韩国30%人口持币，全球交易量10%来自韩元",
      ].filter(Boolean).join("\n")
    : [
        `🌶️ BTC Kimchi Premium ${premiumStr ?? "—"}`,
        fng !== null ? `Fear/Greed: ${fng} | RSI(1D): ${rsiD?.toFixed(1) ?? "—"}` : "",
        "30% of Koreans own crypto — driving 10% of global volume",
      ].filter(Boolean).join("\n");

  // 나머지 플랫폼 — 풍부한 텍스트
  const fullText = isKo
    ? [
        `🌶️ BTC 김치 프리미엄 ${premiumStr ?? "—"} | 실시간 추적`,
        "",
        "📊 주요 지표",
        fng !== null ? `• 공포탐욕지수: ${fng} (${fng >= 75 ? "극탐욕" : fng >= 55 ? "탐욕" : fng >= 45 ? "중립" : fng >= 25 ? "공포" : "극공포"})` : "",
        vix !== null ? `• VIX: ${vix.toFixed(1)} (${vix >= 30 ? "공포" : vix >= 20 ? "주의" : "안정"})` : "",
        rsiD !== null ? `• BTC RSI(1D): ${rsiD.toFixed(1)} (${rsiD >= 70 ? "과매수" : rsiD <= 30 ? "과매도" : "중립"})` : "",
        "",
        "💡 왜 김치 프리미엄인가?",
        "한국인 인구의 30%가 암호화폐를 보유, 글로벌 거래량의 10%가 원화에서 나온다.",
        "고점 신호: 김프 +20~50% | 저점 신호: 역프 −3~−5%",
        "(2018년 고점 +50% · 2021년 고점 +25% · FTX 저점 −5%)",
        "",
        `🔗 ${url}`,
      ].filter(Boolean).join("\n")
    : isZh
    ? [
        `🌶️ BTC泡菜溢价 ${premiumStr ?? "—"} | 实时追踪`,
        "",
        "📊 主要指标",
        fng !== null ? `• 恐贪指数: ${fng}` : "",
        vix !== null ? `• VIX: ${vix.toFixed(1)}` : "",
        rsiD !== null ? `• BTC RSI(1D): ${rsiD.toFixed(1)}` : "",
        "",
        "💡 为什么关注泡菜溢价？",
        "韩国30%人口持有加密货币，全球交易量10%来自韩元。",
        "顶部信号: 溢价+20~50% | 底部信号: 折价−3~−5%",
        "",
        `🔗 ${url}`,
      ].filter(Boolean).join("\n")
    : [
        `🌶️ BTC Kimchi Premium ${premiumStr ?? "—"} | Live Tracker`,
        "",
        "📊 Key Indicators",
        fng !== null ? `• Fear/Greed: ${fng} (${fng >= 75 ? "Extreme Greed" : fng >= 55 ? "Greedy" : fng >= 45 ? "Neutral" : fng >= 25 ? "Fear" : "Extreme Fear"})` : "",
        vix !== null ? `• VIX: ${vix.toFixed(1)} (${vix >= 30 ? "Fear" : vix >= 20 ? "Caution" : "Stable"})` : "",
        rsiD !== null ? `• BTC RSI(1D): ${rsiD.toFixed(1)} (${rsiD >= 70 ? "Overbought" : rsiD <= 30 ? "Oversold" : "Neutral"})` : "",
        "",
        "💡 Why Kimchi Premium?",
        "30% of Koreans own crypto — driving 10% of global volume.",
        "Top signal: +20–50% premium | Bottom signal: −3–5% discount",
        "(Jan 2018 peak: +50% · Apr 2021 peak: +25% · Nov 2022 FTX: −5%)",
        "",
        `🔗 ${url}`,
      ].filter(Boolean).join("\n");

  const copyLink = () => {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const kakaoShare = () => {
    if (typeof navigator.share === "function") {
      navigator.share({ title: twitterText.split("\n")[0], text: fullText, url });
    } else {
      navigator.clipboard.writeText(fullText);
    }
  };

  const btnCls = "flex items-center justify-center w-7 h-7 rounded-lg border border-white/10 bg-white/5 text-[var(--fg-muted)] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all";

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* X (Twitter) */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className={btnCls} title="X (Twitter)로 공유"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(fullText)}`}
        target="_blank" rel="noopener noreferrer"
        className={btnCls} title="텔레그램으로 공유"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      </a>

      {/* Reddit */}
      <a
        href={`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(twitterText.split("\n")[0])}`}
        target="_blank" rel="noopener noreferrer"
        className={btnCls} title="Reddit으로 공유"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      </a>

      {/* KakaoTalk (모바일: 네이티브 공유, PC: 클립보드) */}
      <button onClick={kakaoShare} className={btnCls} title="카카오톡으로 공유">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.623 1.524 4.928 3.84 6.313L4.8 20.1a.5.5 0 0 0 .72.55l4.44-2.64c.67.09 1.36.14 2.04.14 5.523 0 10-3.477 10-7.65C22 6.477 17.523 3 12 3z" />
        </svg>
      </button>

      {/* Line */}
      <a
        href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className={btnCls} title="라인으로 공유"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(fullText)}`}
        target="_blank" rel="noopener noreferrer"
        className={btnCls} title="왓츠앱으로 공유"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>

      {/* 링크 복사 */}
      <button onClick={copyLink} className={btnCls} title="링크 복사">
        {copied
          ? <Check size={12} className="text-emerald-400" />
          : <Copy size={12} />
        }
      </button>
    </div>
  );
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
    revalidateOnMount: true,
    errorRetryInterval: 10_000,
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
    <div className="rounded-2xl border border-white/6 bg-[var(--bg-raised)]">
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

      {/* 하단: Why Kimchi Premium? + 설명 */}
      <div className="flex flex-col gap-2.5 px-4 py-3 border-t border-white/6">
        {/* 텍스트 */}
        <div className="flex items-start gap-2.5">
          <span className="text-sm mt-0.5 shrink-0">🌶️</span>
          <div>
            <p className="text-xs font-bold text-white">
              {isKo ? "왜 김치 프리미엄인가?" : isZh ? "为什么关注泡菜溢价？" : "Why Kimchi Premium?"}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--fg-muted)] leading-relaxed">
              {isKo
                ? "한국인은 세계 최고의 투자 민족 — 전체 인구의 30%가 암호화폐를 보유, 글로벌 거래량의 10%가 원화에서 나온다. 그들이 가장 많이 팔 때가 역사적 저점이고, 가장 많이 살 때가 역사적 고점이다. 2018년 1월 BTC 고점: 김프 +40~50% · 2018년 12월 BTC 저점: 역프 −3~−5% · 2021년 4월 고점: 김프 +20~25% · 2022년 11월 FTX 저점: 역프 −3~−5%"
                : isZh
                ? "韩国人是全球最活跃的加密投资者 — 30%人口持有加密货币，原币交易占全球10%。他们抛售最多时是历史低点，买入最多时是历史高点。2018年1月BTC高点: 溢价+40~50% · 2018年12月低点: 折价−3~−5% · 2021年4月高点: 溢价+20~25% · 2022年11月FTX低点: 折价−3~−5%"
                : "Koreans are the world's most passionate crypto investors — 30% own crypto, Korean Won drives 10% of global volume. When Koreans sell most, it's a historic bottom. When they buy most, it's a historic top. Jan 2018 BTC peak: +40–50% · Dec 2018 bottom: −3–5% · Apr 2021 peak: +20–25% · Nov 2022 FTX bottom: −3–5%"}
            </p>
          </div>
        </div>
        {/* 하단 바: 공유 버튼 + 갱신 뱃지 */}
        <div className="flex items-center justify-between">
          <ShareButtons btcPremium={btcPremium} fng={fng} vix={vix} rsiD={rsiD} locale={locale} />
          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--fg-muted)] bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isKo ? "5초 갱신" : isZh ? "5秒更新" : "5s live"}
          </span>
        </div>
      </div>
    </div>
  );
}
