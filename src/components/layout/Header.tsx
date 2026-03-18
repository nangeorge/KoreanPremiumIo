"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn, formatPremium } from "@/lib/utils";
import { useAppStore } from "@/store";

const LOCALES = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const exchangeRate = useAppStore((s) => s.exchangeRate);
  const updatedAt = useAppStore((s) => s.updatedAt);
  const coins = useAppStore((s) => s.coins);
  const btcPremium = coins.find((c) => c.symbol === "BTC")?.premium ?? null;

  function switchLocale(newLocale: string) {
    // Replace locale prefix in pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-black/85 backdrop-blur-xl" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 1px 0 rgba(99,102,241,0.1), 0 4px 24px rgba(0,0,0,0.45)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/80 to-orange-500/80 shadow-lg shadow-red-500/20 text-xl">
              🌶️
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white leading-none">김치 프리미엄 <span className="text-xs">🥬</span></div>
              <div className="text-[10px] text-orange-400 leading-none mt-0.5">Kimchi Premium Tracker</div>
            </div>
          </Link>

          {/* Center: Live stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">LIVE</span>
            </div>
            {btcPremium !== null && (
              <div className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-number font-bold transition-all duration-500",
                btcPremium >= 7  ? "border-red-500/40 bg-red-500/10 text-red-300" :
                btcPremium >= 4  ? "border-orange-500/35 bg-orange-500/10 text-orange-300" :
                btcPremium >= 2  ? "border-yellow-500/30 bg-yellow-500/8 text-yellow-300" :
                btcPremium >= 0  ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-300" :
                                   "border-blue-500/25 bg-blue-500/8 text-blue-300"
              )}>
                <span className="text-gray-500 font-normal">BTC 김프</span>
                {formatPremium(btcPremium)}
              </div>
            )}
            {exchangeRate > 0 && (
              <div className="flex items-center gap-1 text-xs font-number">
                <span className="text-gray-500">$1</span>
                <span className="text-gray-600">=</span>
                <span className="text-gray-200 font-medium">₩{exchangeRate.toLocaleString("ko-KR")}</span>
              </div>
            )}
            {updatedAt && (
              <div className="text-xs text-gray-600">
                {new Date(updatedAt).toLocaleTimeString("ko-KR")}
              </div>
            )}
          </div>

          {/* Right: Locale switcher */}
          <div className="flex items-center gap-3">
            {/* Mobile: live dot + 환율 */}
            <div className="flex items-center gap-1.5 md:hidden">
              <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
              {exchangeRate > 0 && (
                <span className="font-number text-xs text-gray-300 font-medium">
                  $1 = ₩{exchangeRate.toLocaleString("ko-KR")}
                </span>
              )}
            </div>

            <div className="flex items-center rounded-lg border border-white/8 bg-white/3 p-0.5">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => switchLocale(loc.code)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
                    locale === loc.code
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  )}
                >
                  <span>{loc.flag}</span>
                  <span className="hidden sm:inline">{loc.label}</span>
                  <span className="sm:hidden">{loc.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
