"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { SUPPORTED_COINS } from "@/types";
import type { CoinPrice, PriceResponse } from "@/types";
import { formatKrw, formatUsd, formatPremium, formatVolume, cn } from "@/lib/utils";
import { COIN_CONTENT } from "@/lib/coinContent";

export default function CoinDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const symbol = (params.symbol as string).toUpperCase();
  const isKo = locale === "ko";

  const coinMeta = SUPPORTED_COINS.find((c) => c.symbol === symbol);
  const [coin, setCoin] = useState<CoinPrice | null>(null);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "analysis" | "sources">("overview");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/prices");
      if (!res.ok) return;
      const data: PriceResponse = await res.json();
      const found = data.coins.find((c) => c.symbol === symbol);
      if (found) setCoin(found);
      setExchangeRate(data.exchangeRate.usdKrw);
    }
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [symbol]);

  if (!coinMeta) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-gray-500">{isKo ? "코인을 찾을 수 없습니다." : "Coin not found."}</p>
        <Link href={`/${locale}`} className="mt-4 inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> {isKo ? "돌아가기" : "Back"}
        </Link>
      </div>
    );
  }

  const content = COIN_CONTENT[symbol] ?? null;
  const name = isKo ? coinMeta.nameKo : coinMeta.name;
  const premium = coin?.premium ?? null;

  const stats = coin ? [
    {
      label: isKo ? "업비트 (KRW)" : "Upbit (KRW)",
      value: formatKrw(coin.upbitPrice),
      color: "text-white",
    },
    {
      label: isKo ? "Bybit (USD)" : "Bybit (USD)",
      value: formatUsd(coin.binancePrice),
      color: "text-white",
    },
    {
      label: isKo ? "김치 프리미엄" : "Kimchi Premium",
      value: premium !== null ? formatPremium(premium) : "—",
      color: premium === null ? "text-gray-500" : premium >= 0 ? "text-emerald-400" : "text-rose-400",
    },
    {
      label: isKo ? "24시간 변동" : "24h Change",
      value: `${coin.change24h >= 0 ? "+" : ""}${coin.change24h.toFixed(2)}%`,
      color: coin.change24h >= 0 ? "text-emerald-400" : "text-rose-400",
    },
    {
      label: isKo ? "거래량 (24h)" : "Volume (24h)",
      value: formatVolume(coin.volume24h, locale),
      color: "text-gray-300",
    },
    {
      label: isKo ? "원/달러 환율" : "USD/KRW",
      value: `₩${exchangeRate.toLocaleString("ko-KR")}`,
      color: "text-gray-300",
    },
  ] : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      {/* 뒤로가기 */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft size={14} />
        {isKo ? "전체 코인 목록" : "All Coins"}
      </Link>

      {/* 헤더 */}
      <div className="glass rounded-2xl p-6 flex items-center gap-5">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-white/5">
          {coin?.logoUrl && (
            <Image src={coin.logoUrl} alt={symbol} fill className="object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{name}</h1>
            <span className="text-sm font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">{symbol}</span>
            {premium !== null && (
              <span className={cn(
                "text-sm font-bold px-3 py-1 rounded-full border",
                premium >= 0
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              )}>
                {formatPremium(premium)}
              </span>
            )}
          </div>
          {coin && (
            <p className="text-2xl font-bold font-number text-white mt-1">
              {formatKrw(coin.upbitPrice)}
            </p>
          )}
        </div>
      </div>

      {/* 실시간 스탯 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {coin ? stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className={cn("font-number text-lg font-bold", s.color)}>{s.value}</div>
          </div>
        )) : Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl h-20" />
        ))}
      </div>

      {/* 코인 정보 탭 */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-white/5">
          {(
            [
              { key: "overview",  ko: "개요",    en: "Overview" },
              { key: "analysis",  ko: "심층 분석", en: "Analysis" },
              { key: "sources",   ko: "출처",    en: "Sources"  },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 py-3.5 text-sm font-medium transition-all duration-200 border-b-2",
                activeTab === tab.key
                  ? "border-white text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              )}
            >
              {isKo ? tab.ko : tab.en}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-6">
          {!content ? (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-sm text-gray-600">
                {isKo ? "분석 내용이 곧 추가됩니다." : "Analysis coming soon."}
              </p>
            </div>
          ) : activeTab === "overview" ? (
            <div className="space-y-6">
              {/* 요약 */}
              <p className="text-gray-300 leading-relaxed">
                {isKo ? content.summary.ko : content.summary.en}
              </p>

              {/* facts: 핵심 정보 그리드 */}
              {content.type === "facts" && content.facts && (
                <div>
                  <h2 className="text-sm font-bold text-white mb-3">
                    {isKo ? "핵심 정보" : "Key Facts"}
                  </h2>
                  <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                    {content.facts.map((row, i) => {
                      const item = isKo ? row[0] : row[1];
                      return (
                        <div key={i} className="flex items-start justify-between gap-4 py-2.5 border-b border-white/5 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                          <span className="text-sm text-gray-500 shrink-0">{item.label}</span>
                          <span className="text-sm text-gray-200 text-right font-number">{item.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "analysis" ? (
            <div className="space-y-5">
              {/* opinion: 섹션별 평가 */}
              {content.type === "opinion" && content.opinionSections?.map((sec, i) => {
                const ratingColor =
                  sec.rating === "good" ? "border-emerald-500/20 bg-emerald-500/5" :
                  sec.rating === "bad"  ? "border-rose-500/20 bg-rose-500/5" :
                  "border-white/8 bg-white/3";
                const dotColor =
                  sec.rating === "good" ? "bg-emerald-500" :
                  sec.rating === "bad"  ? "bg-rose-500" :
                  "bg-gray-500";
                return (
                  <div key={i} className={cn("rounded-xl p-5 border", ratingColor)}>
                    <h2 className="text-sm font-bold text-white mb-3">
                      {isKo ? sec.title.ko : sec.title.en}
                    </h2>
                    <ul className="space-y-2.5">
                      {sec.items.map((item, j) => (
                        <li key={j} className="flex gap-3">
                          <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", dotColor)} />
                          <span className="text-sm text-gray-300 leading-relaxed">
                            {isKo ? item.ko : item.en}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {/* opinion: 종합 결론 */}
              {content.type === "opinion" && content.verdict && (
                <div className="rounded-xl p-5 border border-amber-500/20 bg-amber-500/5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {isKo ? "종합 의견" : "Verdict"}
                  </span>
                  <p className="mt-2 text-white font-semibold leading-relaxed">
                    {isKo ? content.verdict.ko : content.verdict.en}
                  </p>
                </div>
              )}

              {/* facts: 섹션별 리스트 */}
              {content.type === "facts" && content.sections?.map((sec, i) => (
                <div key={i}>
                  <h2 className="text-sm font-bold text-white mb-3">
                    {isKo ? sec.title.ko : sec.title.en}
                  </h2>
                  <ul className="space-y-2.5">
                    {sec.items.map((item, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40 shrink-0" />
                        <span className="text-sm text-gray-400 leading-relaxed">
                          {isKo ? item.ko : item.en}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* 분석 없음 */}
              {content.type === "facts" && !content.sections?.length && (
                <p className="text-sm text-gray-600 text-center py-6">
                  {isKo ? "분석 내용이 곧 추가됩니다." : "Analysis coming soon."}
                </p>
              )}
            </div>
          ) : (
            /* 출처 탭 */
            <div>
              {content.sources && content.sources.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {content.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-full px-3 py-1.5 transition-colors"
                    >
                      {src.label} ↗
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-6">
                  {isKo ? "참고 자료가 없습니다." : "No sources available."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
