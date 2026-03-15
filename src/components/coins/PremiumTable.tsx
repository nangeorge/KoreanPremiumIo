"use client";

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

function SortIcon({ field, current, dir }: { field: string; current: string; dir: string }) {
  if (current === "default" || field !== current) return <span className="text-gray-700">↕</span>;
  return <span className="text-indigo-400">{dir === "asc" ? "↑" : "↓"}</span>;
}

function CoinRow({ coin, isSelected, onClick, locale, exchange }: {
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

  return (
    <tr
      onClick={onClick}
      className={cn(
        "group cursor-pointer border-b border-white/4 transition-all duration-150",
        isSelected ? "bg-indigo-600/8 border-indigo-500/20" : "hover:bg-white/2"
      )}
    >
      {/* 코인명 */}
      <td className="py-4 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-white/5">
            {coin.logoUrl && (
              <Image
                src={coin.logoUrl}
                alt={coin.symbol}
                fill
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
            <div className="font-semibold text-white text-sm hover:text-indigo-300 transition-colors">{coin.symbol}</div>
            <div className="text-xs text-gray-500">{name}</div>
          </Link>
        </div>
      </td>

      {/* 업비트 가격 (KRW) */}
      <td className="px-3 py-4 text-right">
        <div className="font-number text-sm font-medium text-white">
          ₩{formatKrw(coin.upbitPrice)}
        </div>
        {!isKo && (
          <div className="font-number text-xs text-gray-600 mt-0.5">
            ≈ {formatUsd(extPriceKrw > 0 ? coin.upbitPrice / (extPriceKrw / extPrice) : 0)}
          </div>
        )}
      </td>

      {/* 외부 거래소 가격 */}
      <td className="hidden px-3 py-4 text-right sm:table-cell">
        <div className="font-number text-sm text-gray-200 font-medium">
          {formatUsd(extPrice)}
        </div>
        <div className="font-number text-xs text-gray-500 mt-0.5">
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

      {/* 김치 프리미엄 */}
      <td className="px-3 py-4 text-right pr-4 sm:pr-6">
        {premium === null ? (
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium border bg-white/4 border-white/10 text-gray-600">
            —
          </span>
        ) : (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1.5 text-base font-extrabold font-number border tracking-tight shadow-sm",
              premium >= 0
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10"
                : "bg-rose-500/15 border-rose-500/30 text-rose-300 shadow-rose-500/10"
            )}
          >
            {formatPremium(premium)}
          </span>
        )}
      </td>

      {/* 거래량 */}
      <td className="hidden px-3 py-4 text-right lg:table-cell">
        <div className="font-number text-xs text-gray-500">{formatVolume(coin.volume24h, locale)}</div>
      </td>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/4">
      <td className="py-4 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-3">
          <div className="skeleton h-9 w-9 rounded-full" />
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

  function handleSort(field: SortField) {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortField("default");
        setSortDirection("asc");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  }

  const sorted = [...coins].sort((a, b) => {
    if (sortField === "default") {
      return COIN_ORDER.indexOf(a.symbol) - COIN_ORDER.indexOf(b.symbol);
    }
    const val = sortDirection === "asc" ? 1 : -1;
    if (sortField === "symbol") return val * a.symbol.localeCompare(b.symbol);
    if (sortField === "upbitPrice") return val * (a.upbitPrice - b.upbitPrice);
    if (sortField === "premium") {
      const ap = selectedExchange === "coinbase" ? a.coinbasePremium : a.premium;
      const bp = selectedExchange === "coinbase" ? b.coinbasePremium : b.premium;
      if (ap === null && bp === null) return 0;
      if (ap === null) return 1;  // null은 항상 맨 뒤
      if (bp === null) return -1;
      return val * (ap - bp);
    }
    if (sortField === "change24h") return val * (a.change24h - b.change24h);
    if (sortField === "volume24h") return val * (a.volume24h - b.volume24h);
    return 0;
  });

  const headerClass =
    "cursor-pointer select-none py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors";

  const upbitLabel = locale === "ko" ? t("upbit") : `${t("upbit")} (KRW)`;
  const extLabel = selectedExchange === "coinbase"
    ? (locale === "ko" ? "코인베이스 / 원화 환산" : "Coinbase / KRW equiv.")
    : (locale === "ko" ? `${t("binance")} / 원화 환산` : `${t("binance")} / KRW equiv.`);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* 거래소 선택 */}
      <div className="flex items-center gap-2 px-4 pt-4 sm:px-6">
        <span className="text-xs text-gray-500">비교 거래소</span>
        <div className="flex items-center rounded-lg border border-white/8 bg-white/3 p-0.5">
          {(["binance", "coinbase"] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => setSelectedExchange(ex)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-all duration-200",
                selectedExchange === ex
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {ex === "binance" ? "🌏 Bybit" : "🇺🇸 Coinbase"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th
                className={cn(headerClass, "pl-4 pr-3 text-left sm:pl-6")}
                onClick={() => handleSort("symbol")}
              >
                <span className="flex items-center gap-1">
                  {t("coin")} <SortIcon field="symbol" current={sortField} dir={sortDirection} />
                </span>
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
                  {t("change24h")} <SortIcon field="change24h" current={sortField} dir={sortDirection} />
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
                  {t("volume")} <SortIcon field="volume24h" current={sortField} dir={sortDirection} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
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
