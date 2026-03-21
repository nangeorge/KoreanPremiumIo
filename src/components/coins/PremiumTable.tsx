"use client";

import { useState, useMemo, useRef, useEffect, memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppStore } from "@/store";
import {
  formatKrw,
  formatUsd,
  formatPremium,
  formatVolume,
  getChangeColor,
  cn,
} from "@/lib/utils";
import type { CoinPrice, SortField, Exchange } from "@/types";
import { SUPPORTED_COINS } from "@/types";
import Image from "next/image";
import Link from "next/link";

const COIN_ORDER: string[] = SUPPORTED_COINS.map((c) => c.symbol);

// CoinGecko 기준 시총 순위 (2025년 기준, 주기적 업데이트 필요)
// 스테이블코인 및 업비트 미상장(BNB 등) 제외 순위
const MARKET_CAP_RANK: Record<string, number> = {
  BTC:1,ETH:2,XRP:3,SOL:4,DOGE:5,
  ADA:6,TRX:7,TON:8,AVAX:9,SHIB:10,
  LINK:11,XLM:12,HBAR:13,SUI:14,DOT:15,
  NEAR:16,UNI:17,APT:18,ICP:19,PEPE:20,
  ETC:21,POL:22,ATOM:23,FIL:24,OP:25,
  ARB:26,BCH:27,LTC:28,RENDER:29,GRT:30,
  SEI:31,IMX:32,ALGO:33,EOS:34,STX:35,
  BONK:36,WIF:37,ENA:38,MNT:39,AAVE:40,
  JUP:41,TIA:42,BERA:43,ZRO:44,ZK:45,
  JTO:46,PENDLE:47,ONDO:48,VIRTUAL:49,MANTRA:50,
  SAND:51,MANA:52,AXS:53,WLD:54,PENGU:55,
  MOVE:56,BEAM:57,SONIC:58,BLUR:59,CRO:60,
  NEO:61,FLOW:62,EGLD:63,MINA:64,XTZ:65,
  THETA:66,COMP:67,ENS:68,ZIL:69,KAVA:70,
  CHZ:71,PYTH:72,IOTA:73,RAY:74,GMT:75,
  QTUM:76,ZRX:77,"1INCH":78,CELO:79,ALT:80,
  ASTR:81,BLAST:82,ZETA:83,ARKM:84,STG:85,
  LAYER:86,BIGTIME:87,MOCA:88,API3:89,AGLD:90,
  TAIKO:91,ETHFI:92,MASK:93,XEC:94,RVN:95,
  IOST:96,BTT:97,VTHO:98,ICX:99,STORJ:100,
  WAVES:101,POWR:102,CHR:103,ELF:104,HOLO:105,
  ONT:106,SUN:107,JST:108,TFUEL:109,RED:110,
  YGG:111,SNT:112,AUDIO:113,GAS:114,PUNDIX:115,
  LSK:116,QKC:117,ARDR:118,ONG:119,CKB:120,
  AKT:121,AXL:122,COW:123,ORCA:124,WAXP:125,
  CARV:126,STEEM:127,VANA:128,AERGO:129,ANIME:130,
  TRUST:131,POLYX:132,DRIFT:133,
  BORA:134,MBL:135,MLK:136,HUNT:137,MED:138,
};
// 표시용 순위 = 시총 순위 (없으면 999)
const COIN_RANK: Record<string, number> = MARKET_CAP_RANK;

// ── 카테고리 ──────────────────────────────────────────────────────────────────
type Category = "all" | "top" | "meme" | "defi" | "layer2" | "ai" | "game" | "korea";

const CATEGORY_SYMBOLS: Record<Category, Set<string> | null> = {
  all: null,
  top: new Set(["BTC","ETH","XRP","SOL","ADA","DOGE","TRX","TON","AVAX","SHIB","LTC","BCH","LINK","ATOM","DOT","UNI","APT","SUI","ICP","NEAR"]),
  meme: new Set(["DOGE","SHIB","PEPE","BONK","WIF","PENGU"]),
  defi: new Set(["UNI","AAVE","COMP","1INCH","PENDLE","ONDO","RAY","GRT","STG","COW","ZRX","BLUR","ENA","ETHFI","PYTH"]),
  layer2: new Set(["POL","OP","ARB","IMX","MNT","BLAST","ZK","STX","TAIKO","LAYER","ALT","ZETA","BERA","MOVE","SONIC"]),
  ai: new Set(["RENDER","VIRTUAL","ARKM","AKT","MOCA","API3"]),
  game: new Set(["SAND","MANA","AXS","GMT","YGG","BIGTIME","BEAM","CARV","ANIME"]),
  korea: new Set(["BORA","MBL","MLK","HUNT","MED","ICX","VTHO","BTT","IOST","AERGO","POLYX","ARDR","RED","SNT"]),
};

const CATEGORY_LABELS: Record<Category, { ko: string; en: string; zh: string }> = {
  all:    { ko: "전체",     en: "All",     zh: "全部"   },
  top:    { ko: "시총 Top", en: "Top Cap", zh: "主流"   },
  meme:   { ko: "밈코인",   en: "Meme",    zh: "Meme"   },
  defi:   { ko: "DeFi",    en: "DeFi",    zh: "DeFi"   },
  layer2: { ko: "Layer2",  en: "Layer2",  zh: "Layer2" },
  ai:     { ko: "AI",      en: "AI",      zh: "AI"     },
  game:   { ko: "게임",     en: "Game",    zh: "游戏"   },
  korea:  { ko: "한국전용", en: "KR Only", zh: "韩国限定"},
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

// ── 정렬 아이콘 ────────────────────────────────────────────────────────────────
function SortIcon({ field, current, dir }: { field: string; current: string; dir: string }) {
  if (current === "default" || field !== current) return <span className="text-gray-700">↕</span>;
  return <span className="text-white">{dir === "asc" ? "↑" : "↓"}</span>;
}

// ── 코인 행 ────────────────────────────────────────────────────────────────────
const CoinRow = memo(function CoinRow({ coin, isSelected, onClick, locale, exchange }: {
  coin: CoinPrice;
  isSelected: boolean;
  onClick: () => void;
  locale: string;
  exchange: Exchange;
}) {
  const name = locale === "ko" ? coin.nameKo : locale === "zh" ? coin.nameZh : coin.name;
  const changeColor = getChangeColor(coin.change24h);
  const isKo = locale === "ko";

  const extPrice = exchange === "coinbase" ? coin.coinbasePrice : coin.binancePrice;
  const extPriceKrw = exchange === "coinbase" ? coin.coinbasePriceKrw : coin.binancePriceKrw;
  const premium = exchange === "coinbase" ? coin.coinbasePremium : coin.premium;

  // 가격 변동 플래시
  const prevPriceRef = useRef<number>(coin.upbitPrice);
  const [flashClass, setFlashClass] = useState<string>("");
  useEffect(() => {
    if (prevPriceRef.current !== 0 && prevPriceRef.current !== coin.upbitPrice) {
      const cls = coin.upbitPrice > prevPriceRef.current ? "flash-up" : "flash-down";
      setFlashClass(cls);
      const t = setTimeout(() => setFlashClass(""), 800);
      prevPriceRef.current = coin.upbitPrice;
      return () => clearTimeout(t);
    }
    prevPriceRef.current = coin.upbitPrice;
  }, [coin.upbitPrice]);

  const rowGlow =
    premium === null ? "" :
    premium >= 7  ? "bg-red-500/5" :
    premium >= 4  ? "bg-orange-500/4" :
    premium >= 2  ? "bg-yellow-500/3" :
    premium < -2  ? "bg-blue-500/4" :
    "";

  return (
    <tr
      onClick={onClick}
      className={cn(
        "group cursor-pointer border-b border-[var(--divider)] transition-all duration-150",
        isSelected ? "bg-white/6 border-white/15" : cn(rowGlow, "hover:bg-[var(--bg-hover)]")
      )}
    >
      {/* 순위 — 정렬 무관 고정 */}
      <td className="hidden w-8 py-4 pl-4 text-center text-xs text-gray-600 sm:table-cell">
        {COIN_RANK[coin.symbol] ?? "—"}
      </td>

      {/* 코인명 — 모바일 sticky */}
      <td className="sticky left-0 z-10 bg-[var(--bg-raised)] py-4 pl-3 pr-3 group-hover:bg-[var(--bg-hover)] sm:pl-4">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white/5">
            {coin.logoUrl && (
              <Image
                src={coin.logoUrl}
                alt={coin.symbol}
                fill
                sizes="32px"
                className="object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
          <Link
            href={`/${locale}/coin/${coin.symbol.toLowerCase()}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:opacity-80 transition-opacity"
          >
            <div className="font-semibold text-[var(--fg)] text-sm hover:text-gray-300 transition-colors">{coin.symbol}</div>
            <div className="text-xs text-[var(--fg-muted)] hidden xs:block">{name}</div>
          </Link>
        </div>
      </td>

      {/* 업비트 가격 (KRW) */}
      <td className={cn("px-3 py-4 text-right", flashClass)}>
        <div className="font-number text-sm font-medium text-[var(--fg)]">
          ₩{formatKrw(coin.upbitPrice)}
        </div>
        {!isKo && (
          <div className="font-number text-xs text-[var(--fg-muted)] mt-0.5">
            ≈ {formatUsd(extPriceKrw > 0 ? coin.upbitPrice / (extPriceKrw / extPrice) : 0)}
          </div>
        )}
      </td>

      {/* 외부 거래소 가격 */}
      <td className="hidden px-3 py-4 text-right sm:table-cell">
        <div className="font-number text-sm text-[var(--fg)] font-medium">
          {formatUsd(extPrice)}
        </div>
        <div className="font-number text-xs text-[var(--fg-secondary)] mt-0.5">
          ≈ ₩{formatKrw(extPriceKrw)}
        </div>
      </td>

      {/* 24h 변동 */}
      <td className="hidden px-3 py-4 text-right md:table-cell">
        <span className={cn("font-number text-sm font-medium", changeColor)}>
          {coin.change24h > 0 ? "+" : ""}
          {coin.change24h.toFixed(2)}%
        </span>
      </td>

      {/* 김치 프리미엄 — heatmap 강도 색상 */}
      <td className="px-3 py-4 text-right pr-4 sm:pr-6">
        {premium === null ? (
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium border bg-white/4 border-white/10 text-gray-600">
            —
          </span>
        ) : (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-3 py-1.5 text-base font-semibold font-number border tracking-tight",
              premium >= 7  ? "bg-[#f85149]/15 border-[#f85149]/30 text-[#f85149]" :
              premium >= 4  ? "bg-orange-500/12 border-orange-500/25 text-orange-400" :
              premium >= 2  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
              premium >= 0  ? "bg-[#3fb950]/12 border-[#3fb950]/25 text-[#3fb950]" :
              premium >= -3 ? "bg-white/5 border-white/10 text-[var(--fg-muted)]" :
                              "bg-blue-500/12 border-blue-500/25 text-blue-400"
            )}
          >
            {formatPremium(premium)}
          </span>
        )}
      </td>

      {/* 거래량 */}
      <td className="hidden px-3 py-4 text-right lg:table-cell">
        <div className="font-number text-xs text-[var(--fg-secondary)]">{formatVolume(coin.volume24h, locale)}</div>
      </td>
    </tr>
  );
});

// ── 스켈레톤 ──────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-[var(--divider)]">
      <td className="hidden w-8 py-4 pl-4 sm:table-cell"><div className="skeleton h-3 w-4 rounded mx-auto" /></td>
      <td className="sticky left-0 z-10 bg-[var(--bg-raised)] py-4 pl-3 pr-3 sm:pl-4">
        <div className="flex items-center gap-2.5">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div>
            <div className="skeleton h-4 w-12 rounded mb-1" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-right"><div className="skeleton h-4 w-28 rounded ml-auto" /></td>
      <td className="hidden px-3 py-4 sm:table-cell">
        <div className="skeleton h-4 w-24 rounded ml-auto mb-1" />
        <div className="skeleton h-3 w-20 rounded ml-auto" />
      </td>
      <td className="hidden px-3 py-4 md:table-cell"><div className="skeleton h-4 w-14 rounded ml-auto" /></td>
      <td className="px-3 py-4 text-right pr-4 sm:pr-6"><div className="skeleton h-7 w-20 rounded-full ml-auto" /></td>
      <td className="hidden px-3 py-4 lg:table-cell"><div className="skeleton h-3 w-16 rounded ml-auto" /></td>
    </tr>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export function PremiumTable() {
  const t = useTranslations("table");
  const locale = useLocale();
  const coins = useAppStore((s) => s.coins);
  const isLoading = useAppStore((s) => s.isLoading);
  const sortField = useAppStore((s) => s.sortField);
  const sortDirection = useAppStore((s) => s.sortDirection);
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const selectedExchange = useAppStore((s) => s.selectedExchange);
  const setSortField = useAppStore((s) => s.setSortField);
  const setSortDirection = useAppStore((s) => s.setSortDirection);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);
  const setSelectedExchange = useAppStore((s) => s.setSelectedExchange);

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  function handleSort(field: SortField) {
    // 시총 순위는 오름차순이 자연스러운 방향 (1=BTC가 상단)
    const naturalDir = field === "marketCap" ? "asc" : "desc";
    const oppositeDir = naturalDir === "asc" ? "desc" : "asc";

    if (sortField === field) {
      if (sortDirection === naturalDir) {
        setSortDirection(oppositeDir);
      } else {
        // 반대 방향에서 한 번 더 클릭 → 시총 순위로 리셋
        setSortField("marketCap");
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection(naturalDir);
    }
  }

  const sorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const symbolSet = CATEGORY_SYMBOLS[activeCategory];
    const filtered = coins.filter((c) => {
      if (symbolSet && !symbolSet.has(c.symbol)) return false;
      if (!q) return true;
      return (
        c.symbol.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.nameKo.includes(q)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "default" || sortField === "marketCap") {
        const ra = MARKET_CAP_RANK[a.symbol] ?? 999;
        const rb = MARKET_CAP_RANK[b.symbol] ?? 999;
        return (sortDirection === "asc" ? 1 : -1) * (ra - rb);
      }
      // symbol 정렬은 제거됨 (헤더 클릭 불가)
      const val = sortDirection === "asc" ? 1 : -1;
      if (sortField === "symbol") return val * a.symbol.localeCompare(b.symbol);
      if (sortField === "upbitPrice") return val * (a.upbitPrice - b.upbitPrice);
      if (sortField === "premium") {
        const ap = selectedExchange === "coinbase" ? a.coinbasePremium : a.premium;
        const bp = selectedExchange === "coinbase" ? b.coinbasePremium : b.premium;
        if (ap === null && bp === null) return 0;
        if (ap === null) return 1;
        if (bp === null) return -1;
        return val * (ap - bp);
      }
      if (sortField === "change24h") return val * (a.change24h - b.change24h);
      if (sortField === "volume24h") return val * (a.volume24h - b.volume24h);
      return 0;
    });
  }, [coins, sortField, sortDirection, selectedExchange, activeCategory, searchQuery]);

  const headerClass =
    "cursor-pointer select-none py-3 text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-wider hover:text-gray-300 transition-colors";

  const upbitLabel = locale === "ko" ? t("upbit") : `${t("upbit")} (KRW)`;
  const extLabel = selectedExchange === "coinbase"
    ? (locale === "ko" ? "코인베이스 / 원화 환산" : "Coinbase / KRW equiv.")
    : (locale === "ko" ? `${t("binance")} / 원화 환산` : `${t("binance")} / KRW equiv.`);

  const catLabel = (cat: Category) => {
    const l = CATEGORY_LABELS[cat];
    return locale === "ko" ? l.ko : locale === "zh" ? l.zh : l.en;
  };

  return (
    <div className="glass rounded-xl min-w-0">
      {/* 카테고리 탭 */}
      <div className="px-4 pt-4 sm:px-6">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSortField("marketCap");
                setSortDirection("asc");
              }}
              className={cn(
                "flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                activeCategory === cat
                  ? "bg-white text-black"
                  : "bg-white/5 text-[var(--fg-muted)] hover:bg-white/8 hover:text-[var(--fg-secondary)]"
              )}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 + 거래소 선택 */}
      <div className="flex items-center gap-2 px-4 pb-3 sm:px-6 flex-wrap">
        {/* 검색창 */}
        <div className="relative flex-1 min-w-[160px]">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "ko" ? "코인 검색..." : locale === "zh" ? "搜索..." : "Search coin..."}
            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] pl-8 pr-8 py-1.5 text-xs text-[var(--fg)] placeholder-[var(--fg-muted)] outline-none focus:border-white/20 focus:bg-[var(--bg-raised)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <span className="text-xs text-gray-500">{t("compareExchange")}</span>
        <div className="flex items-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] p-0.5">
          {(["binance", "coinbase"] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => setSelectedExchange(ex)}
              title={ex === "binance" ? "OKX" : "Coinbase"}
              className={cn(
                "rounded-md px-2.5 py-1.5 transition-all duration-200 flex items-center justify-center",
                selectedExchange === ex
                  ? "bg-white/15"
                  : "hover:bg-white/5"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ex === "binance"
                  ? "https://www.google.com/s2/favicons?domain=okx.com&sz=32"
                  : "https://www.google.com/s2/favicons?domain=coinbase.com&sz=32"
                }
                width={16}
                height={16}
                alt={ex === "binance" ? "OKX" : "Coinbase"}
                className="rounded-sm"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)]">
              {/* 시총 순위 헤더 — 클릭으로 정렬 */}
              <th
                className={cn(headerClass, "hidden w-12 py-3 pl-4 text-center sm:table-cell")}
                onClick={() => handleSort("marketCap")}
                title={locale === "ko" ? "시가총액 순위 기준 정렬" : "Sort by market cap rank"}
              >
                <span className="flex items-center justify-center gap-1">
                  # <SortIcon field="marketCap" current={sortField} dir={sortDirection} />
                </span>
              </th>

              {/* 코인 헤더 — 정렬 없음 */}
              <th className="sticky left-0 z-10 bg-[var(--bg-raised)] pl-3 text-left sm:pl-4 py-3 text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                {t("coin")}
              </th>

              <th
                className={cn(headerClass, "px-3 text-right")}
                onClick={() => handleSort("upbitPrice")}
              >
                <span className="flex items-center justify-end gap-1">
                  {upbitLabel} <SortIcon field="upbitPrice" current={sortField} dir={sortDirection} />
                </span>
              </th>
              <th className={cn(headerClass, "hidden px-3 text-right sm:table-cell")}>{extLabel}</th>
              <th
                className={cn(headerClass, "hidden px-3 text-right md:table-cell")}
                onClick={() => handleSort("change24h")}
              >
                <span className="flex items-center justify-end gap-1">
                  {t("change24h")} <span className="text-gray-600 normal-case">(Upbit)</span> <SortIcon field="change24h" current={sortField} dir={sortDirection} />
                </span>
              </th>
              <th
                className={cn(headerClass, "px-3 pr-4 text-right sm:pr-6")}
                onClick={() => handleSort("premium")}
              >
                <span className="flex items-center justify-end gap-1">
                  {t("premium")} <SortIcon field="premium" current={sortField} dir={sortDirection} />
                </span>
              </th>
              <th
                className={cn(headerClass, "hidden px-3 text-right lg:table-cell")}
                onClick={() => handleSort("volume24h")}
              >
                <span className="flex items-center justify-end gap-1">
                  {t("volume")} <span className="text-gray-700 normal-case">(Upbit)</span> <SortIcon field="volume24h" current={sortField} dir={sortDirection} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : sorted.length === 0
              ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[var(--fg-muted)]">
                    {locale === "ko" ? `"${searchQuery}" 검색 결과가 없습니다` : `No results for "${searchQuery}"`}
                  </td>
                </tr>
              )
              : sorted.map((coin) => (
                  <CoinRow
                    key={coin.symbol}
                    coin={coin}
                    locale={locale}
                    exchange={selectedExchange}
                    isSelected={selectedSymbol === coin.symbol}
                    onClick={() =>
                      setSelectedSymbol(selectedSymbol === coin.symbol ? null : coin.symbol)
                    }
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
