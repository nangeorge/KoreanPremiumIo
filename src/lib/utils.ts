import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 원화 가격 — 전체 숫자 표시 (M 없음) */
export function formatKrw(value: number): string {
  return value.toLocaleString("ko-KR", { maximumFractionDigits: 0 });
}

/** 달러 가격 */
export function formatUsd(value: number): string {
  if (value >= 1000) {
    return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (value >= 1) {
    return "$" + value.toFixed(4);
  }
  return "$" + value.toFixed(6);
}

export function formatPremium(value: number): string {
  const sign = value > 0 ? "+" : "";
  return sign + value.toFixed(2) + "%";
}

/** 거래량 — ko: 억/조 표기, en: B/M 표기 */
export function formatVolume(value: number, locale = "ko"): string {
  if (locale === "ko") {
    if (value >= 1_000_000_000_000) return "₩" + (value / 1_000_000_000_000).toFixed(2) + "조";
    if (value >= 100_000_000)       return "₩" + (value / 100_000_000).toFixed(0) + "억";
    if (value >= 10_000)            return "₩" + (value / 10_000).toFixed(0) + "만";
    return "₩" + value.toLocaleString("ko-KR");
  }
  // English: KRW volume → show as USD equivalent isn't available here, just show KRW in B/M
  if (value >= 1_000_000_000_000) return "₩" + (value / 1_000_000_000_000).toFixed(2) + "T";
  if (value >= 1_000_000_000)     return "₩" + (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000)         return "₩" + (value / 1_000_000).toFixed(0) + "M";
  return "₩" + value.toLocaleString("en-US");
}

export function getPremiumColor(premium: number): string {
  if (premium >= 3) return "text-emerald-400";
  if (premium >= 1) return "text-emerald-500";
  if (premium >= 0) return "text-emerald-600";
  if (premium >= -1) return "text-rose-500";
  return "text-rose-400";
}

export function getPremiumBg(premium: number): string {
  if (premium >= 1) return "bg-emerald-500/10 border-emerald-500/20";
  if (premium >= 0) return "bg-emerald-600/10 border-emerald-600/20";
  return "bg-rose-500/10 border-rose-500/20";
}

export function getChangeColor(change: number): string {
  if (change > 0) return "text-emerald-400";
  if (change < 0) return "text-rose-400";
  return "text-gray-400";
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return "방금";
  if (seconds < 60) return `${seconds}초 전`;
  return `${Math.floor(seconds / 60)}분 전`;
}
