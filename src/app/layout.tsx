import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://koreanpremium.io";
// Google AdSense 발급 후 아래 ID 교체
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "8327952774757997";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Korea Premium Index | 김치 프리미엄 실시간 — 업비트 vs 바이낸스",
    template: "%s | Korea Premium Index",
  },
  description:
    "Korea Premium Index — 실시간 김치 프리미엄(김프) 추적기. 업비트(KRW) vs 바이낸스(USD) BTC·ETH·XRP 등 130개 코인 가격 차이, 공포탐욕지수, MVRV, 펀딩비, 온체인 지표를 한눈에. Real-time Korea crypto premium tracker — upbit vs binance, bitcoin korea premium index live.",
  keywords: [
    // KO 핵심
    "Korea Premium Index", "코리아 프리미엄", "한국 프리미엄 지수",
    "김치프리미엄", "김프", "김프가", "실시간 김프", "김프 트래커",
    "업비트 바이낸스 차이", "비트코인 김프", "이더리움 김프", "리플 김프",
    "역프리미엄", "역김프", "코인 프리미엄", "암호화폐 프리미엄",
    "업비트 BTC 가격", "국내외 코인 차이", "코인 차익거래",
    "공포탐욕지수", "비트코인 MVRV", "펀딩비 실시간", "해시레이트",
    "온체인 지표", "비트코인 도미넌스", "암호화폐 뉴스",
    // EN 핵심
    "Korea Premium Index", "korea premium index crypto", "korea premium index live",
    "korea premium index bitcoin", "KPI crypto", "korean crypto premium index",
    "kimchi premium", "kimchi premium live", "kimchi premium tracker",
    "kimchi premium crypto", "korea crypto premium", "bitcoin kimchi premium",
    "upbit vs binance", "upbit binance price difference", "korean crypto exchange premium",
    "crypto arbitrage korea", "KRW USD bitcoin premium", "upbit bitcoin price usd",
    "bitcoin korea premium live", "korea bitcoin price",
    "crypto fear greed index", "bitcoin MVRV ratio", "bitcoin funding rate live",
    "bitcoin hash rate", "bitcoin on-chain metrics", "btc dominance",
    // ZH 핵심
    "韩国溢价指数", "泡菜溢价", "韩国加密货币溢价", "比特币泡菜溢价", "实时泡菜溢价",
    "韩国溢价", "Upbit Binance差价", "韩国比特币溢价", "加密货币套利",
    "恐慌贪婪指数", "比特币MVRV比率", "资金费率", "链上数据",
  ],
  authors: [{ name: "KimchiPremium" }],
  creator: "KimchiPremium",
  publisher: "KimchiPremium",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KP Index",
  },
  openGraph: {
    type: "website",
    siteName: "KimchiPremium",
    locale: "ko_KR",
    alternateLocale: ["en_US", "zh_CN"],
    images: [{ url: "/og", width: 1200, height: 630, alt: "Korea Premium Index — Real-time Kimchi Premium Tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kimchi Premium Live | 실시간 김프 트래커",
    description: "Real-time Kimchi Premium — Upbit vs Binance price difference for BTC, ETH, XRP & 40 coins. 업비트 바이낸스 실시간 김프.",
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google142258d97f185908",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={BASE_URL} />
        {ADSENSE_ID && (
          <meta name="google-adsense-account" content={`ca-pub-${ADSENSE_ID}`} />
        )}
      </head>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* Google AdSense Script */}
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}

        {/* Google Analytics — NEXT_PUBLIC_GA_ID 환경변수 설정 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
