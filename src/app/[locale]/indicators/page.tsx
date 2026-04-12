import { getLocale } from "next-intl/server";
import { IndicatorsClient } from "@/components/indicators/IndicatorsClient";
import { BTCPremiumHistoryChart } from "@/components/charts/BTCPremiumHistoryChart";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kimchipremium.com";

const META: Record<string, { title: string; description: string; keywords: string[] }> = {
  ko: {
    title: "암호화폐 시장 지표 | 공포탐욕지수 · MVRV · 펀딩비 실시간",
    description:
      "비트코인 공포탐욕지수, MVRV 비율, 해시레이트, 활성 주소, 무기한 선물 펀딩비를 한눈에. 온체인 데이터와 파생상품 지표로 암호화폐 시장 흐름을 분석하세요.",
    keywords: [
      "공포탐욕지수", "비트코인 공포탐욕지수", "암호화폐 공탐지수",
      "비트코인 MVRV", "MVRV 지표", "온체인 지표", "비트코인 온체인 분석",
      "해시레이트 실시간", "비트코인 활성 주소", "펀딩비 실시간",
      "바이낸스 펀딩비", "무기한 선물 펀딩비", "비트코인 도미넌스",
      "암호화폐 시장 심리", "시장 지표",
    ],
  },
  en: {
    title: "Crypto Market Indicators | Fear & Greed Index, MVRV Ratio, Funding Rate Live",
    description:
      "Real-time Bitcoin Fear & Greed Index, MVRV ratio, hash rate, active addresses, and perpetual futures funding rates. On-chain analytics and derivatives data in one dashboard.",
    keywords: [
      "crypto fear greed index", "bitcoin fear and greed index today", "bitcoin fear greed index live",
      "bitcoin MVRV ratio", "MVRV ratio live", "MVRV crypto indicator",
      "bitcoin hash rate live", "bitcoin active addresses", "bitcoin on-chain metrics", "blockchain analytics",
      "bitcoin funding rate live", "crypto funding rate", "perpetual futures funding rate",
      "binance funding rate bitcoin", "ethereum funding rate",
      "crypto market indicators", "bitcoin sentiment", "btc dominance", "altcoin season index",
    ],
  },
  zh: {
    title: "加密货币市场指标 | 恐慌贪婪指数 · MVRV · 资金费率实时",
    description:
      "实时比特币恐慌贪婪指数、MVRV比率、哈希率、活跃地址数及永续合约资金费率。一站式链上数据与衍生品指标分析平台。",
    keywords: [
      "恐慌贪婪指数", "比特币恐慌贪婪指数", "加密货币市场情绪",
      "比特币MVRV比率", "MVRV链上指标",
      "比特币哈希率", "活跃地址数", "链上数据", "比特币链上指标",
      "加密货币资金费率", "永续合约资金费率", "币安资金费率",
      "市场情绪指标", "比特币主导地位",
    ],
  },
};

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Bitcoin On-chain & Market Indicators",
    description: "Real-time Bitcoin Fear & Greed Index, MVRV ratio, hash rate, active addresses, and funding rates",
    url: `${BASE_URL}/${locale}/indicators`,
    creator: { "@type": "Organization", name: "KimchiPremium" },
  };

  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/indicators`,
      languages: {
        ko: `${BASE_URL}/ko/indicators`,
        en: `${BASE_URL}/en/indicators`,
        zh: `${BASE_URL}/zh/indicators`,
        "x-default": `${BASE_URL}/en/indicators`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${BASE_URL}/${locale}/indicators`,
      siteName: "KimchiPremium",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [`${BASE_URL}/og?locale=${locale}`],
    },
    other: {
      "script:ld+json": JSON.stringify(jsonLd),
    },
  };
}

export default async function IndicatorsPage() {
  const locale = await getLocale();
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 space-y-4">
      <BTCPremiumHistoryChart locale={locale} />
      <IndicatorsClient locale={locale} />
    </div>
  );
}
