"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "home",       href: "",           labelKo: "김치 프리미엄", labelEn: "Kimchi Premium", labelZh: "泡菜溢价" },
  { key: "indicators", href: "/indicators", labelKo: "지표 분석",    labelEn: "Indicators",     labelZh: "指标"    },
  { key: "news",       href: "/news",       labelKo: "뉴스",         labelEn: "News",           labelZh: "新闻"    },
  { key: "coin",       href: "/coin/btc",   labelKo: "코인 정보",    labelEn: "Coin Info",      labelZh: "币种信息" },
];

export function TabNav() {
  const locale = useLocale();
  const pathname = usePathname();

  function getLabel(tab: typeof TABS[0]) {
    if (locale === "ko") return tab.labelKo;
    if (locale === "zh") return tab.labelZh;
    return tab.labelEn;
  }

  function isActive(tab: typeof TABS[0]) {
    const expected = `/${locale}${tab.href}`;
    if (tab.key === "home") return pathname === `/${locale}` || pathname === `/${locale}/`;
    if (tab.key === "coin") return pathname.startsWith(`/${locale}/coin/`);
    return pathname.startsWith(expected);
  }

  return (
    <div className="sticky top-16 z-40 w-full bg-black/90 backdrop-blur-xl" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`/${locale}${tab.href}`}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3 py-3.5 sm:px-4 text-sm font-medium transition-all duration-200",
                isActive(tab)
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-white/20"
              )}
            >
              <span>{getLabel(tab)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
