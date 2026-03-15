"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
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

  function switchLocale(newLocale: string) {
    // Replace locale prefix in pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
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
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">LIVE</span>
            </div>
            {exchangeRate > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-500">USD/KRW</span>
                <span className="font-number text-gray-200 font-medium">
                  ₩{exchangeRate.toLocaleString("ko-KR")}
                </span>
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
            {/* Mobile live dot */}
            <span className="live-dot h-2 w-2 rounded-full bg-emerald-400 md:hidden" />

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
