import type { Metadata } from "next";
import { SUPPORTED_COINS } from "@/types";
import CoinDetailClient from "./CoinDetailClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://koreanpremium.io";

interface Props {
  params: Promise<{ locale: string; symbol: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  const coin = SUPPORTED_COINS.find((c) => c.symbol === symbol);

  if (!coin) {
    return { title: "Coin Not Found | KimchiPremium" };
  }

  const name =
    locale === "ko" ? coin.nameKo :
    locale === "zh" ? coin.nameZh :
    coin.name;

  const title =
    locale === "ko" ? `${name}(${symbol}) 김치 프리미엄 실시간 | KimchiPremium` :
    locale === "zh" ? `${name}(${symbol}) 泡菜溢价实时 | KimchiPremium` :
    `${name} (${symbol}) Kimchi Premium Live | KimchiPremium`;

  const description =
    locale === "ko"
      ? `${name} 업비트 vs Bybit 실시간 가격 차이. ${symbol} 김치 프리미엄, 24시간 변동, 거래량을 한눈에 확인하세요.`
      : locale === "zh"
      ? `${name} Upbit vs Bybit 实时价差。查看 ${symbol} 泡菜溢价、24小时涨跌、交易量。`
      : `${name} Upbit vs Bybit real-time price difference. Track ${symbol} kimchi premium, 24h change and volume.`;

  const canonicalUrl = `${BASE_URL}/${locale}/coin/${rawSymbol.toLowerCase()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "KimchiPremium",
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ko: `${BASE_URL}/ko/coin/${rawSymbol.toLowerCase()}`,
        en: `${BASE_URL}/en/coin/${rawSymbol.toLowerCase()}`,
        zh: `${BASE_URL}/zh/coin/${rawSymbol.toLowerCase()}`,
      },
    },
  };
}

export default async function CoinDetailPage({ params }: Props) {
  const { locale, symbol } = await params;
  return <CoinDetailClient locale={locale} symbol={symbol.toUpperCase()} />;
}
