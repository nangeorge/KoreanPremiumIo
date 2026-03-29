"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { cn, formatPremium } from "@/lib/utils";
import { useAppStore } from "@/store";

function useVisitors() {
  const [count, setCount] = useState<number | null>(null);
  const sessionRef = useRef<string>("");

  useEffect(() => {
    // sessionStorage에서 세션ID 가져오거나 생성
    let sid = sessionStorage.getItem("kp_sid");
    if (!sid) {
      sid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem("kp_sid", sid);
    }
    sessionRef.current = sid;

    async function heartbeat() {
      try {
        const res = await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionRef.current }),
        });
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch { /* ignore */ }
    }

    heartbeat();
    const interval = setInterval(heartbeat, 20_000); // 20초마다 heartbeat
    return () => clearInterval(interval);
  }, []);

  return count;
}

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
  const visitorCount = useVisitors();

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as "dark" | "light") ?? "dark";
    setTheme(stored);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  function switchLocale(newLocale: string) {
    // Replace locale prefix in pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl" style={{ backgroundColor: "color-mix(in srgb, var(--bg-base) 85%, transparent)", borderBottom: "1px solid var(--border-color)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/6 text-lg leading-none">
              🌶️
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-sm tracking-tight text-[var(--fg)]">KimchiPremium</span>
            </div>
          </Link>

          {/* Center: Live stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-[var(--fg-secondary)]">LIVE</span>
            </div>
            {visitorCount !== null && (
              <div className="flex items-center gap-1 text-xs text-[var(--fg-muted)]">
                <span>👥</span>
                <span className="font-number">{visitorCount.toLocaleString()}</span>
              </div>
            )}
            {btcPremium !== null && (
              <div className={cn(
                "flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-number bg-white/4",
                btcPremium >= 0 ? "text-[#3fb950]" : "text-[#f85149]"
              )}>
                <span className="text-[var(--fg-muted)] font-normal">BTC</span>
                {formatPremium(btcPremium)}
              </div>
            )}
            {exchangeRate > 0 && (
              <div className="flex items-center gap-1 font-number text-xs text-[var(--fg-secondary)]">
                <span>$1 = ₩{exchangeRate.toLocaleString("ko-KR")}</span>
              </div>
            )}
            {updatedAt && (
              <div className="text-xs text-[var(--fg-muted)]">
                {new Date(updatedAt).toLocaleTimeString(locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "ko-KR")}
              </div>
            )}
          </div>

          {/* Right: Theme toggle + Locale switcher */}
          <div className="flex items-center gap-3">
            {/* Mobile: live dot + 환율 + 접속자 */}
            <div className="flex items-center gap-1.5 md:hidden">
              <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
              {exchangeRate > 0 && (
                <span className="font-number text-xs text-[var(--fg-secondary)] font-medium">
                  $1 = ₩{exchangeRate.toLocaleString("ko-KR")}
                </span>
              )}
              {visitorCount !== null && (
                <span className="flex items-center gap-0.5 text-xs text-[var(--fg-muted)]">
                  <span>👥</span>
                  <span className="font-number">{visitorCount.toLocaleString()}</span>
                </span>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="rounded p-1.5 text-[var(--fg-muted)] transition-colors hover:bg-white/5 hover:text-[var(--fg-secondary)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="flex items-center rounded border border-[var(--border-color)] bg-white/3 p-0.5">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => switchLocale(loc.code)}
                  className={cn(
                    "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-all duration-150",
                    locale === loc.code
                      ? "bg-white/10 text-[var(--fg)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg-secondary)]"
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
