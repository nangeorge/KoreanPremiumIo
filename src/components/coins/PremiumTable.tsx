"use client";

import { useState, useMemo, useRef, useEffect, memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppStore } from "@/store";
import { Star } from "lucide-react";
import {
  formatKrw,
  formatUsd,
  formatPremium,
  formatMarketCap,
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
type Category = "all" | "top" | "meme" | "defi" | "layer2" | "ai" | "game" | "cex" | "korea" | "watch" | "alert";

const CATEGORY_SYMBOLS: Record<Exclude<Category, "watch" | "alert">, Set<string> | null> = {
  all: null,
  top: new Set(["BTC","ETH","XRP","SOL","ADA","DOGE","TRX","TON","AVAX","SHIB","LTC","BCH","LINK","ATOM","DOT","UNI","APT","SUI","ICP","NEAR"]),
  meme: new Set(["DOGE","SHIB","PEPE","BONK","WIF","PENGU"]),
  defi: new Set(["UNI","AAVE","COMP","1INCH","PENDLE","ONDO","RAY","GRT","STG","COW","ZRX","BLUR","ENA","ETHFI","PYTH"]),
  layer2: new Set(["POL","OP","ARB","IMX","MNT","BLAST","ZK","STX","TAIKO","LAYER","ALT","ZETA","BERA","MOVE","SONIC"]),
  ai: new Set(["RENDER","VIRTUAL","ARKM","AKT","MOCA","API3"]),
  game: new Set(["SAND","MANA","AXS","GMT","YGG","BIGTIME","BEAM","CARV","ANIME"]),
  cex: new Set(["CRO","GT","MX"]),
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
  cex:    { ko: "CEX",     en: "CEX",     zh: "CEX"    },
  korea:  { ko: "한국전용", en: "KR Only", zh: "韩国限定"},
  watch:  { ko: "⭐ 관심", en: "⭐ Watch", zh: "⭐ 自选" },
  alert:  { ko: "🚨 경보",  en: "🚨 Alert", zh: "🚨 警报" },
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

// ── 정렬 아이콘 ────────────────────────────────────────────────────────────────
function SortIcon({ field, current, dir }: { field: string; current: string; dir: string }) {
  if (current === "default" || field !== current) return <span className="text-[var(--fg-muted)]">↕</span>;
  return <span className="text-white">{dir === "asc" ? "↑" : "↓"}</span>;
}

// ── 코인 행 (Coinbase 스타일) ──────────────────────────────────────────────────
const CoinRow = memo(function CoinRow({ coin, isSelected, onClick, locale, exchange, isFavorite, onToggleFavorite }: {
  coin: CoinPrice;
  isSelected: boolean;
  onClick: () => void;
  locale: string;
  exchange: Exchange;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const name = locale === "ko" ? coin.nameKo : locale === "zh" ? coin.nameZh : coin.name;
  const changeColor = getChangeColor(coin.change24h);

  const extPrice = exchange === "coinbase" ? coin.coinbasePrice : coin.binancePrice;
  const premium = exchange === "coinbase" ? coin.coinbasePremium : coin.premium;

  // 가격 변동 플래시
  const prevPriceRef = useRef<number>(extPrice);
  const [flashClass, setFlashClass] = useState<string>("");
  useEffect(() => {
    if (prevPriceRef.current !== 0 && prevPriceRef.current !== extPrice) {
      const cls = extPrice > prevPriceRef.current ? "flash-up" : "flash-down";
      setFlashClass(cls);
      const t = setTimeout(() => setFlashClass(""), 800);
      prevPriceRef.current = extPrice;
      return () => clearTimeout(t);
    }
    prevPriceRef.current = extPrice;
  }, [extPrice]);

  const rowGlow =
    premium === null ? "" :
    premium >= 7  ? "bg-red-500/5" :
    premium >= 4  ? "bg-orange-500/4" :
    premium >= 2  ? "bg-yellow-500/3" :
    premium < -2  ? "bg-blue-500/4" :
    "";

  // 24h USD 거래량 = KRW 거래량 / 환율 (extPrice > 0 이면 가능, 아니면 KRW 표시)
  const volumeUsd = extPrice > 0 && coin.volume24h > 0
    ? coin.volume24h / (coin.binancePriceKrw / coin.binancePrice || 1)
    : null;

  return (
    <tr
      onClick={onClick}
      className={cn(
        "group cursor-pointer border-b border-[var(--divider)] transition-colors duration-100",
        isSelected ? "bg-white/5" : cn(rowGlow, "hover:bg-[var(--bg-hover)]")
      )}
    >
      {/* 관심 */}
      <td className="w-7 pl-2 py-3.5 text-center">
        <button
          onClick={onToggleFavorite}
          className="inline-flex items-center justify-center transition-colors"
          title={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Star
            size={13}
            className={cn(
              "transition-colors",
              isFavorite ? "fill-yellow-400 text-yellow-400" : "text-[var(--fg-muted)] hover:text-yellow-400"
            )}
          />
        </button>
      </td>

      {/* 순위 */}
      <td className="hidden w-8 py-3.5 pl-2 text-center text-xs text-[var(--fg-muted)] sm:table-cell">
        {COIN_RANK[coin.symbol] ?? "—"}
      </td>

      {/* Asset — 코인명 sticky */}
      <td className="sticky left-0 z-10 bg-[var(--bg-raised)] py-3 pl-3 pr-2 group-hover:bg-[var(--bg-hover)] sm:pl-4 sm:pr-3 w-[120px] sm:w-[160px]">
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-white/5 sm:h-8 sm:w-8">
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
            className="hover:opacity-80 transition-opacity min-w-0"
          >
            <div className="font-semibold text-[var(--fg)] text-sm hover:text-[var(--fg)] transition-colors truncate">{coin.symbol}</div>
            <div className="text-xs text-[var(--fg-muted)] hidden sm:block truncate">{name}</div>
          </Link>
        </div>
      </td>

      {/* Market Price (USD) */}
      <td className={cn("px-3 py-3.5 text-right", flashClass)}>
        <div className="font-number text-sm font-medium text-[var(--fg)]">
          {formatUsd(extPrice)}
        </div>
        <div className="font-number text-xs text-[var(--fg-muted)] mt-0.5">
          ₩{formatKrw(coin.upbitPrice)}
          {extPrice > 0 && (
            <span className="ml-1 text-[var(--fg-muted)]">
              · ≈{formatUsd(coin.upbitPrice / (coin.binancePriceKrw / coin.binancePrice || 1))}
            </span>
          )}
        </div>
      </td>

      {/* Change 24h */}
      <td className="hidden xs:table-cell px-3 py-3.5 text-right">
        <span className={cn("font-number text-sm font-medium", changeColor)}>
          {coin.change24h > 0 ? "+" : ""}
          {coin.change24h.toFixed(2)}%
        </span>
      </td>

      {/* Mkt Cap */}
      <td className="hidden px-3 py-3.5 text-right md:table-cell">
        <div className="font-number text-sm text-[var(--fg-secondary)]">
          {formatMarketCap(coin.marketCap)}
        </div>
      </td>

      {/* Volume 24h */}
      <td className="hidden px-3 py-3.5 text-right lg:table-cell">
        <div className="font-number text-sm text-[var(--fg-secondary)]">
          {volumeUsd ? formatMarketCap(volumeUsd) : "—"}
        </div>
      </td>

      {/* 김치 프리미엄 */}
      <td className="px-3 py-3.5 text-right pr-4 sm:pr-6">
        {premium === null ? (
          <span className="font-number text-sm text-[var(--fg-muted)]">—</span>
        ) : (
          <span
            className={cn(
              "inline-flex items-center rounded px-2 py-0.5 text-sm font-semibold font-number",
              premium >= 7  ? "bg-red-500/12 text-[#f85149]" :
              premium >= 4  ? "bg-orange-500/10 text-orange-400" :
              premium >= 2  ? "bg-yellow-500/10 text-yellow-400" :
              premium >= 0  ? "bg-emerald-500/10 text-[#3fb950]" :
              premium >= -3 ? "bg-white/4 text-[var(--fg-muted)]" :
                              "bg-blue-500/10 text-blue-400"
            )}
          >
            {formatPremium(premium)}
          </span>
        )}
      </td>
    </tr>
  );
});

// ── 스켈레톤 ──────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-[var(--divider)]">
      <td className="w-7 pl-2 py-4"><div className="skeleton h-3 w-3 rounded mx-auto" /></td>
      <td className="hidden w-8 py-4 pl-2 sm:table-cell"><div className="skeleton h-3 w-4 rounded mx-auto" /></td>
      <td className="sticky left-0 z-10 bg-[var(--bg-raised)] py-4 pl-3 pr-3 sm:pl-4">
        <div className="flex items-center gap-2.5">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div>
            <div className="skeleton h-4 w-12 rounded mb-1" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-right"><div className="skeleton h-4 w-20 rounded ml-auto" /></td>
      <td className="hidden xs:table-cell px-3 py-4 text-right"><div className="skeleton h-4 w-14 rounded ml-auto" /></td>
      <td className="hidden px-3 py-4 md:table-cell"><div className="skeleton h-4 w-16 rounded ml-auto" /></td>
      <td className="hidden px-3 py-4 lg:table-cell"><div className="skeleton h-4 w-16 rounded ml-auto" /></td>
      <td className="px-3 py-4 text-right pr-4 sm:pr-6"><div className="skeleton h-7 w-20 rounded-full ml-auto" /></td>
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
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const initFavorites = useAppStore((s) => s.initFavorites);

  // localStorage에서 favorites 초기화 (클라이언트 전용)
  useEffect(() => { initFavorites(); }, [initFavorites]);

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  function handleSort(field: SortField) {
    if (sortField === field) {
      // 같은 컬럼 재클릭 → 방향 토글
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // 새 컬럼 클릭 → 기본 방향으로 정렬
      setSortField(field);
      setSortDirection(field === "marketCap" ? "asc" : "desc");
    }
  }

  const alertSymbols = useMemo(
    () => new Set(coins.filter((c) => c.premium !== null && Math.abs(c.premium) >= 10).map((c) => c.symbol)),
    [coins]
  );

  const sorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const symbolSet =
      activeCategory === "watch" ? new Set(favorites) :
      activeCategory === "alert" ? alertSymbols :
      CATEGORY_SYMBOLS[activeCategory as Exclude<Category, "watch" | "alert">];
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
  }, [coins, sortField, sortDirection, selectedExchange, activeCategory, searchQuery, favorites, alertSymbols]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pagedCoins = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const headerClass =
    "cursor-pointer select-none py-3 text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-wider hover:text-[var(--fg)] transition-colors";

  const exchangeLabel = selectedExchange === "coinbase" ? "Coinbase" : "OKX";

  const catLabel = (cat: Category) => {
    const l = CATEGORY_LABELS[cat];
    return locale === "ko" ? l.ko : locale === "zh" ? l.zh : l.en;
  };

  return (
    <div className="glass rounded-lg min-w-0">
      {/* 카테고리 탭 */}
      <div className="px-4 pt-4 sm:px-6">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isAlert = cat === "alert";
            const alertCount = isAlert ? alertSymbols.size : 0;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSortField(cat === "alert" ? "premium" : "marketCap");
                  setSortDirection(cat === "alert" ? "desc" : "asc");
                  setPage(1);
                }}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-all duration-150",
                  isActive
                    ? isAlert
                      ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                      : "bg-white/10 text-[var(--fg)]"
                    : isAlert && alertCount > 0
                      ? "text-orange-400 hover:bg-orange-500/10 border border-orange-500/20"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] hover:bg-white/5"
                )}
              >
                {catLabel(cat)}
                {isAlert && alertCount > 0 && (
                  <span className={cn(
                    "inline-flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 min-w-[18px] h-[18px]",
                    isActive ? "bg-orange-500/30 text-orange-200" : "bg-orange-500/20 text-orange-400 animate-pulse"
                  )}>
                    {alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 검색 + 거래소 선택 */}
      <div className="flex items-center gap-2 px-4 pb-3 sm:px-6 flex-wrap">
        {/* 검색창 */}
        <div className="relative flex-1 min-w-[160px]">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--fg-muted)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder={locale === "ko" ? "코인 검색..." : locale === "zh" ? "搜索..." : "Search coin..."}
            className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-base)] pl-8 pr-8 py-1.5 text-xs text-[var(--fg)] placeholder-[var(--fg-muted)] outline-none focus:border-white/15 focus:bg-[var(--bg-raised)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <span className="text-xs text-[var(--fg-muted)]">{t("compareExchange")}</span>
        <div className="flex items-center rounded border border-[var(--border-color)] bg-[var(--bg-base)] p-0.5">
          {(["binance", "coinbase"] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => setSelectedExchange(ex)}
              title={ex === "binance" ? "OKX" : "Coinbase"}
              className={cn(
                "rounded px-2 py-1.5 transition-all duration-150 flex items-center justify-center",
                selectedExchange === ex
                  ? "bg-white/10"
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
        <table className="w-full min-w-[320px]">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)]">
              {/* ★ */}
              <th className="w-7 pl-2 py-3 text-center">
                <Star size={11} className="inline text-[var(--fg-muted)]" />
              </th>
              {/* # */}
              <th className="hidden w-12 py-3 pl-2 text-center sm:table-cell text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                #
              </th>

              {/* Asset */}
              <th
                className={cn(headerClass, "sticky left-0 z-10 bg-[var(--bg-raised)] pl-3 text-left sm:pl-4")}
                onClick={() => handleSort("marketCap")}
                title={locale === "ko" ? "시가총액 순위 기준 정렬" : "Sort by market cap rank"}
              >
                <span className="flex items-center gap-1">
                  {locale === "ko" ? "자산" : "Asset"} <SortIcon field="marketCap" current={sortField} dir={sortDirection} />
                </span>
              </th>

              {/* Market Price */}
              <th
                className={cn(headerClass, "px-3 text-right")}
                onClick={() => handleSort("upbitPrice")}
              >
                <span className="flex items-center justify-end gap-1">
                  {locale === "ko" ? "시세" : "Price"}
                  <span className="text-[var(--fg-muted)] normal-case">({exchangeLabel})</span>
                  <SortIcon field="upbitPrice" current={sortField} dir={sortDirection} />
                </span>
              </th>

              {/* Change 24h */}
              <th
                className={cn(headerClass, "hidden xs:table-cell px-3 text-right")}
                onClick={() => handleSort("change24h")}
              >
                <span className="flex items-center justify-end gap-1">
                  {locale === "ko" ? "변동" : "Change"} <SortIcon field="change24h" current={sortField} dir={sortDirection} />
                </span>
              </th>

              {/* Mkt Cap */}
              <th
                className={cn(headerClass, "hidden px-3 text-right md:table-cell")}
                onClick={() => handleSort("marketCap")}
              >
                <span className="flex items-center justify-end gap-1">
                  {locale === "ko" ? "시총" : "Mkt Cap"} <SortIcon field="marketCap" current={sortField} dir={sortDirection} />
                </span>
              </th>

              {/* Volume */}
              <th
                className={cn(headerClass, "hidden px-3 text-right lg:table-cell")}
                onClick={() => handleSort("volume24h")}
              >
                <span className="flex items-center justify-end gap-1">
                  {locale === "ko" ? "거래량" : "Volume"} <SortIcon field="volume24h" current={sortField} dir={sortDirection} />
                </span>
              </th>

              {/* 김치 프리미엄 */}
              <th
                className={cn(headerClass, "px-3 pr-4 text-right sm:pr-6")}
                onClick={() => handleSort("premium")}
              >
                <span className="flex items-center justify-end gap-1">
                  {t("premium")} <SortIcon field="premium" current={sortField} dir={sortDirection} />
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
                  <td colSpan={9} className="py-12 text-center text-sm text-[var(--fg-muted)]">
                    {activeCategory === "watch" && favorites.length === 0
                      ? (locale === "ko" ? "⭐ 별표를 눌러 관심 코인을 추가하세요" : locale === "zh" ? "⭐ 点击星标添加自选" : "⭐ Click the star to add coins to your watchlist")
                      : locale === "ko" ? `"${searchQuery}" 검색 결과가 없습니다` : `No results for "${searchQuery}"`}
                  </td>
                </tr>
              )
              : pagedCoins.map((coin) => (
                  <CoinRow
                    key={coin.symbol}
                    coin={coin}
                    locale={locale}
                    exchange={selectedExchange}
                    isSelected={selectedSymbol === coin.symbol}
                    onClick={() =>
                      setSelectedSymbol(selectedSymbol === coin.symbol ? null : coin.symbol)
                    }
                    isFavorite={favorites.includes(coin.symbol)}
                    onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(coin.symbol); }}
                  />
                ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-[var(--divider)]">
          <span className="text-xs text-[var(--fg-muted)]">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)}
            {" "}/{" "}{sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="rounded px-2 py-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              «
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded px-2.5 py-1 text-xs text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              {locale === "ko" ? "이전" : "Prev"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs text-[var(--fg-muted)]">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={cn(
                      "rounded min-w-[28px] px-2 py-1 text-xs font-medium transition-all",
                      page === p
                        ? "bg-white/10 text-[var(--fg)]"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded px-2.5 py-1 text-xs text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              {locale === "ko" ? "다음" : "Next"}
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="rounded px-2 py-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
