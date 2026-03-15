import { getLocale } from "next-intl/server";
import { NewsClient } from "@/components/news/NewsClient";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kimchipremium.com";

const META: Record<string, { title: string; description: string; keywords: string[] }> = {
  ko: {
    title: "암호화폐 뉴스 | 비트코인 · 업비트 · 코인 최신 뉴스",
    description:
      "비트코인, 이더리움, 업비트 관련 최신 암호화폐 뉴스를 한 곳에서. 코인별 필터로 원하는 뉴스만 빠르게 확인하세요.",
    keywords: [
      "암호화폐 뉴스", "코인 뉴스", "비트코인 뉴스", "이더리움 뉴스",
      "업비트 뉴스", "가상자산 뉴스", "코인 시장 뉴스", "한국 코인 뉴스",
      "블록체인 뉴스", "암호화폐 최신 소식",
    ],
  },
  en: {
    title: "Crypto News Today | Bitcoin, Ethereum & Korea Crypto Updates",
    description:
      "Latest cryptocurrency news for Bitcoin, Ethereum, XRP and more. Filter by coin, stay updated on Korean crypto market news, Upbit announcements, and global blockchain developments.",
    keywords: [
      "crypto news today", "bitcoin news", "ethereum news live", "cryptocurrency news",
      "korea crypto news", "upbit news", "cryptocurrency market news", "blockchain news",
      "latest crypto updates", "bitcoin news today", "XRP news", "south korea crypto news",
    ],
  },
  zh: {
    title: "加密货币新闻 | 比特币 · 以太坊 · 韩国币圈最新资讯",
    description:
      "汇聚比特币、以太坊、XRP等加密货币最新新闻。支持按币种筛选，实时关注韩国加密货币市场动态与Upbit最新公告。",
    keywords: [
      "加密货币新闻", "比特币新闻", "以太坊新闻", "韩国加密货币",
      "虚拟资产新闻", "区块链新闻", "Upbit公告", "数字货币新闻",
    ],
  },
};

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;

  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/news`,
      languages: {
        ko: `${BASE_URL}/ko/news`,
        en: `${BASE_URL}/en/news`,
        zh: `${BASE_URL}/zh/news`,
        "x-default": `${BASE_URL}/en/news`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${BASE_URL}/${locale}/news`,
      siteName: "KimchiPremium",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [`${BASE_URL}/og?locale=${locale}`],
    },
  };
}

export default async function NewsPage() {
  const locale = await getLocale();
  return <NewsClient locale={locale} />;
}
