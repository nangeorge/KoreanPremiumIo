import { NextIntlClientProvider } from "next-intl";
import { SessionProviderWrapper } from "@/components/auth/SessionProviderWrapper";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabNav } from "@/components/layout/TabNav";
import { DataProvider } from "@/components/coins/DataProvider";
import { ChatWidget } from "@/components/chat/ChatWidget";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://koreanpremium.io";

type Params = { locale: string };

const META: Record<string, { title: string; description: string; keywords: string[] }> = {
  ko: {
    title: "Korea Premium Index | 김치 프리미엄 실시간 — 업비트 vs 바이낸스",
    description:
      "Korea Premium Index — 비트코인, 이더리움, XRP 등 130개 코인 김치프리미엄(김프)을 실시간으로 확인. 업비트(원화) vs 바이낸스(달러) 가격 차이, 역프리미엄, 공포탐욕지수, MVRV, 펀딩비, 온체인 지표를 5초마다 자동 갱신.",
    keywords: [
      "Korea Premium Index", "코리아 프리미엄 인덱스", "한국 프리미엄 지수",
      "김치프리미엄", "김프", "김프가", "실시간 김프", "김프 트래커",
      "업비트 바이낸스 차이", "비트코인 김프", "이더리움 김프", "리플 김프", "솔라나 김프",
      "역프리미엄", "역김프", "코인 프리미엄", "암호화폐 프리미엄",
      "업비트 BTC 가격", "국내외 코인 차이", "코인 차익거래",
      "원달러 환율 코인", "업비트 바이낸스 비교",
      "공포탐욕지수", "비트코인 MVRV", "펀딩비 실시간", "해시레이트",
      "온체인 지표", "비트코인 도미넌스", "암호화폐 뉴스",
    ],
  },
  en: {
    title: "Korea Premium Index | Real-time Kimchi Premium Tracker — Upbit vs Binance",
    description:
      "Korea Premium Index — Track Bitcoin, Ethereum & 130-coin kimchi premium in real-time. Compare Upbit (KRW) vs Binance & Coinbase (USD) prices. Live Fear & Greed Index, MVRV ratio, funding rates, hash rate, and on-chain metrics. Auto-refreshes every 5 seconds.",
    keywords: [
      "Korea Premium Index", "korea premium index crypto", "korea premium index live",
      "korea premium index bitcoin", "korean crypto premium index", "KPI crypto",
      "kimchi premium", "kimchi premium live", "kimchi premium tracker", "kimchi premium crypto",
      "korea crypto premium", "bitcoin kimchi premium", "ethereum kimchi premium",
      "upbit vs binance", "upbit binance price difference", "korean crypto exchange premium",
      "crypto arbitrage korea", "KRW USD bitcoin premium", "upbit bitcoin price usd",
      "bitcoin korea premium live", "korea bitcoin price", "what is kimchi premium crypto",
      "crypto fear greed index", "bitcoin fear and greed index today",
      "bitcoin MVRV ratio", "bitcoin funding rate live", "perpetual futures funding rate",
      "bitcoin hash rate live", "bitcoin on-chain metrics",
      "crypto market indicators", "btc dominance", "altcoin season index",
      "crypto news today", "korean crypto market",
    ],
  },
  zh: {
    title: "韩国溢价指数 | 泡菜溢价实时追踪器 — Upbit vs Binance",
    description:
      "韩国溢价指数（Korea Premium Index）— 实时追踪比特币、以太坊、XRP等130种加密货币泡菜溢价。对比Upbit（韩元）与Binance（美元）价格差异，每5秒自动刷新。包含恐慌贪婪指数、MVRV比率、资金费率、链上数据等市场指标。",
    keywords: [
      "韩国溢价指数", "Korea Premium Index", "韩国加密货币溢价指数",
      "泡菜溢价", "韩国加密货币溢价", "比特币泡菜溢价", "实时泡菜溢价", "泡菜指数",
      "韩国比特币溢价", "Upbit Binance差价", "韩国交易所溢价",
      "韩元比特币溢价", "加密货币套利", "Upbit价格",
      "恐慌贪婪指数", "比特币恐慌贪婪指数",
      "比特币MVRV比率", "加密货币资金费率", "永续合约资金费率", "币安资金费率",
      "比特币哈希率", "链上数据", "市场情绪指标", "比特币主导地位",
      "加密货币新闻", "韩国加密货币监管",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.ko;

  const ogLocale = locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : "en_US";
  const ogAlt = locale === "ko" ? "김치 프리미엄 실시간 트래커" : locale === "zh" ? "泡菜溢价实时追踪器" : "KimchiPremium — Real-time Kimchi Premium Tracker";

  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        ko: `${BASE_URL}/ko`,
        en: `${BASE_URL}/en`,
        zh: `${BASE_URL}/zh`,
        "x-default": `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${BASE_URL}/${locale}`,
      siteName: "KimchiPremium",
      type: "website",
      locale: ogLocale,
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as "ko" | "en" | "zh")) notFound();

  const messages = await getMessages();

  const inLanguage = locale === "ko" ? "ko-KR" : locale === "zh" ? "zh-CN" : "en-US";
  const desc = META[locale]?.description ?? META.en.description;

  // JSON-LD 구조화 데이터 — WebApplication + FinancialService
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "KimchiPremium",
      alternateName: ["김치 프리미엄", "Kimchi Premium", "泡菜溢价", "김프"],
      url: `${BASE_URL}/${locale}`,
      description: desc,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      inLanguage,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Real-time Kimchi Premium tracking",
        "Upbit vs Binance vs Coinbase price comparison",
        "137 cryptocurrencies supported",
        "Bitcoin Fear & Greed Index",
        "MVRV ratio",
        "Funding rate tracker",
        "Hash rate monitoring",
        "Active addresses & transaction count",
        "Latest crypto news",
        "KO/EN/ZH multilingual",
        "Auto-refresh every 5 seconds",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: "KimchiPremium",
      alternateName: ["김치프리미엄", "泡菜溢价"],
      description: "Real-time cryptocurrency kimchi premium and on-chain market analytics",
      url: `${BASE_URL}/${locale}`,
      areaServed: ["KR", "US", "CN"],
      serviceType: "Cryptocurrency Market Data",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Free Market Data Tools",
        itemListElement: [
          { "@type": "Offer", "itemOffered": { "@type": "Service", name: "Kimchi Premium Tracker" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", name: "Fear & Greed Index" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", name: "MVRV Ratio Chart" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", name: "Funding Rate Monitor" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", name: "Hash Rate Chart" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", name: "Crypto News Feed" } },
        ],
      },
    },
  ];

  const disclaimer =
    locale === "ko"
      ? "본 서비스는 정보 제공 목적으로만 운영되며, 투자 권유나 조언을 제공하지 않습니다. 모든 투자 판단과 그에 따른 손익의 책임은 이용자 본인에게 있습니다."
      : locale === "zh"
      ? "本服务仅供参考，不提供任何投资建议或推荐。所有投资决策及其盈亏责任完全由用户本人承担。"
      : "This service is for informational purposes only and does not constitute investment advice or solicitation. All investment decisions and their resulting gains or losses are solely the responsibility of the user.";

  return (
    <SessionProviderWrapper>
    <NextIntlClientProvider messages={messages} locale={locale}>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <DataProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <TabNav />
          <main className="flex-1">{children}</main>
          {/* 투자 비조언 고지 */}
          <div className="border-t border-white/5 bg-[var(--bg-base)] px-4 py-3">
            <p className="mx-auto max-w-7xl text-center text-xs text-[var(--fg-muted)] leading-relaxed">
              ⚠️ {disclaimer}
            </p>
          </div>
          <Footer />
          <ChatWidget />
        </div>
      </DataProvider>
    </NextIntlClientProvider>
    </SessionProviderWrapper>
  );
}
