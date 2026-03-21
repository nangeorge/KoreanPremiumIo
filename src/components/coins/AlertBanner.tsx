"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useAppStore } from "@/store";
import { formatPremium } from "@/lib/utils";
import useSWR from "swr";
import type { IndicatorsResponse } from "@/app/api/indicators/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const SITE_URL = "https://koreanpremium.io";

function buildShareText(opts: {
  locale: string;
  btcPremium: number | null;
  ethPremium: number | null;
  fng: number | null;
  fngText: string;
  vix: number | null;
  rsiDaily: number | null;
  rsiWeekly: number | null;
  rsiMonthly: number | null;
}): string {
  const { locale, btcPremium, ethPremium, fng, fngText, vix, rsiDaily, rsiWeekly, rsiMonthly } = opts;
  const isKo = locale === "ko";
  const isZh = locale === "zh";

  const lines: string[] = [];

  if (isKo) {
    lines.push("🌶️ 실시간 김치 프리미엄 현황");
    lines.push("");
    if (btcPremium !== null) lines.push(`BTC 김프: ${formatPremium(btcPremium)}`);
    if (ethPremium !== null) lines.push(`ETH 김프: ${formatPremium(ethPremium)}`);
    if (fng !== null)        lines.push(`공포탐욕: ${fng} (${fngText})`);
    if (vix !== null)        lines.push(`VIX: ${vix.toFixed(1)}`);
    if (rsiDaily !== null || rsiWeekly !== null || rsiMonthly !== null) {
      const parts = [
        rsiDaily   !== null ? `1D: ${rsiDaily.toFixed(1)}`   : null,
        rsiWeekly  !== null ? `1W: ${rsiWeekly.toFixed(1)}`  : null,
        rsiMonthly !== null ? `1M: ${rsiMonthly.toFixed(1)}` : null,
      ].filter(Boolean);
      lines.push(`BTC RSI — ${parts.join(" / ")}`);
    }
    lines.push("");
    lines.push(`▶ ${SITE_URL}`);
    lines.push("#김치프리미엄 #비트코인 #업비트 #크립토");
  } else if (isZh) {
    lines.push("🌶️ 韩国泡菜溢价实时数据");
    lines.push("");
    if (btcPremium !== null) lines.push(`BTC溢价: ${formatPremium(btcPremium)}`);
    if (ethPremium !== null) lines.push(`ETH溢价: ${formatPremium(ethPremium)}`);
    if (fng !== null)        lines.push(`恐贪指数: ${fng} (${fngText})`);
    if (vix !== null)        lines.push(`VIX: ${vix.toFixed(1)}`);
    if (rsiDaily !== null || rsiWeekly !== null || rsiMonthly !== null) {
      const parts = [
        rsiDaily   !== null ? `1D: ${rsiDaily.toFixed(1)}`   : null,
        rsiWeekly  !== null ? `1W: ${rsiWeekly.toFixed(1)}`  : null,
        rsiMonthly !== null ? `1M: ${rsiMonthly.toFixed(1)}` : null,
      ].filter(Boolean);
      lines.push(`BTC RSI — ${parts.join(" / ")}`);
    }
    lines.push("");
    lines.push(`▶ ${SITE_URL}`);
    lines.push("#泡菜溢价 #比特币 #韩国加密");
  } else {
    lines.push("🌶️ Kimchi Premium Live Update");
    lines.push("");
    if (btcPremium !== null) lines.push(`BTC Premium: ${formatPremium(btcPremium)}`);
    if (ethPremium !== null) lines.push(`ETH Premium: ${formatPremium(ethPremium)}`);
    if (fng !== null)        lines.push(`Fear & Greed: ${fng} (${fngText})`);
    if (vix !== null)        lines.push(`VIX: ${vix.toFixed(1)}`);
    if (rsiDaily !== null || rsiWeekly !== null || rsiMonthly !== null) {
      const parts = [
        rsiDaily   !== null ? `1D: ${rsiDaily.toFixed(1)}`   : null,
        rsiWeekly  !== null ? `1W: ${rsiWeekly.toFixed(1)}`  : null,
        rsiMonthly !== null ? `1M: ${rsiMonthly.toFixed(1)}` : null,
      ].filter(Boolean);
      lines.push(`BTC RSI — ${parts.join(" / ")}`);
    }
    lines.push("");
    lines.push(`▶ ${SITE_URL}`);
    lines.push("#KimchiPremium #Bitcoin #Upbit #Crypto");
  }

  return lines.join("\n");
}

export function AlertBanner() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const coins = useAppStore((s) => s.coins);

  const btc = coins.find((c) => c.symbol === "BTC");
  const eth = coins.find((c) => c.symbol === "ETH");
  const btcPremium = btc?.premium ?? null;
  const ethPremium = eth?.premium ?? null;

  const { data: indicators } = useSWR<IndicatorsResponse>("/api/indicators", fetcher, {
    refreshInterval: 300_000,
  });

  const fng = indicators?.fearGreed?.value ?? null;
  const fngText = indicators?.fearGreed?.valueText ?? "";
  const vix = indicators?.vix?.value ?? null;
  const rsiDaily   = indicators?.rsi?.daily   ?? null;
  const rsiWeekly  = indicators?.rsi?.weekly  ?? null;
  const rsiMonthly = indicators?.rsi?.monthly ?? null;

  const [copied, setCopied] = useState(false);

  const rawText = buildShareText({ locale, btcPremium, ethPremium, fng, fngText, vix, rsiDaily, rsiWeekly, rsiMonthly });
  const encodedText = encodeURIComponent(rawText);
  const encodedUrl = encodeURIComponent(SITE_URL);

  const platforms = [
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
      ),
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
    {
      id: "reddit",
      label: "Reddit",
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(
        isKo ? `실시간 김치 프리미엄 현황 — BTC ${btcPremium !== null ? formatPremium(btcPremium) : "—"}`
        : isZh ? `韩国泡菜溢价实时数据 — BTC ${btcPremium !== null ? formatPremium(btcPremium) : "—"}`
        : `Kimchi Premium Live — BTC ${btcPremium !== null ? formatPremium(btcPremium) : "—"}`
      )}`,
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
    },
    {
      id: "line",
      label: "LINE",
      href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
      ),
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${rawText}\n\n${SITE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[var(--bg-raised)] to-[var(--bg-base)] p-5">
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/3 blur-3xl pointer-events-none" />
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-orange-500/6 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col gap-3">
        {/* 헤드라인 */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🌶️</span>
          <p className="text-sm font-bold text-white leading-tight">
            {isKo ? "이 정보, 아는 사람만 알아요" : isZh ? "这些信息，只有知情者才知道" : "Most traders don't see this"}
          </p>
        </div>

        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
          {isKo
            ? "업비트-OKX 가격 차이(김치 프리미엄)는 한국 시장 과열·공포 신호. 137개 코인 실시간 추적."
            : isZh
            ? "Upbit-OKX价差（泡菜溢价）是韩国市场过热/恐慌信号。实时追踪137种加密货币。"
            : "The Upbit-OKX spread signals Korean market greed & fear before it hits the global market. 137 coins live."}
        </p>

        {/* 공유 버튼들 */}
        {btcPremium !== null && (
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-xs text-[var(--fg-muted)]">
              {isKo ? "공유하기:" : isZh ? "分享:" : "Share:"}
            </span>

            {platforms.map((p) => (
              <a
                key={p.id}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                title={p.label}
                className="flex items-center justify-center h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-[var(--fg-secondary)] transition-all hover:bg-white/12 hover:text-white hover:border-white/20"
              >
                {p.icon}
              </a>
            ))}

            {/* 링크 복사 */}
            <button
              onClick={copyLink}
              title={isKo ? "텍스트 복사" : isZh ? "复制文本" : "Copy text"}
              className="flex items-center justify-center h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-[var(--fg-secondary)] transition-all hover:bg-white/12 hover:text-white hover:border-white/20"
            >
              {copied ? (
                <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
