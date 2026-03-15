import Link from "next/link";
import { ArrowLeft, Mail, Globe, BarChart2, Zap, Shield } from "lucide-react";
import type { Metadata } from "next";

type Params = { locale: string };

const CONTENT = {
  ko: {
    title: "KimchiPremium 소개",
    back: "돌아가기",
    tagline: "실시간 암호화폐 김치 프리미엄 트래커",
    description:
      "KimchiPremium은 국내 거래소(업비트)와 해외 거래소(바이낸스, Coinbase) 간 암호화폐 가격 차이를 실시간으로 추적하는 무료 데이터 서비스입니다. 김치 프리미엄(김프)을 5초마다 자동 갱신하며, 공포탐욕지수·온체인 지표·최신 뉴스까지 한 곳에서 확인할 수 있습니다.",
    features: [
      { icon: "zap", title: "실시간 데이터", desc: "5초마다 업비트·바이낸스 가격을 자동 갱신" },
      { icon: "chart", title: "130+ 코인 지원", desc: "업비트 KRW 마켓 전체 코인 커버리지" },
      { icon: "globe", title: "3개 언어", desc: "한국어·영어·중국어 완전 지원" },
      { icon: "shield", title: "무료 & 광고 기반", desc: "회원가입 없이 무료 이용, Google AdSense 광고로 운영" },
    ],
    dataSection: {
      heading: "데이터 출처",
      items: [
        "업비트 API — 원화(KRW) 실시간 가격",
        "바이낸스 API — 달러(USD) 실시간 가격",
        "Coinbase API — 달러(USD) 참조 가격",
        "exchangerate-api.com — 실시간 USD/KRW 환율",
        "Alternative.me — 공포탐욕지수",
        "CryptoCompare — 암호화폐 뉴스",
        "CoinMetrics — 온체인 지표(MVRV, 활성 주소 등)",
        "CoinGlass — 펀딩비 데이터",
      ],
    },
    premiumSection: {
      heading: "김치 프리미엄이란?",
      body: "김치 프리미엄(김프)은 한국 암호화폐 거래소와 해외 거래소 간 동일 코인의 가격 차이를 백분율로 나타낸 지표입니다. 한국은 자본 이동 규제와 원화 생태계 특성상 글로벌 시장 대비 높은 가격이 형성되는 경향이 있으며, 이 차이가 양수(+)이면 프리미엄, 음수(-)이면 역프리미엄(역김프)이라고 부릅니다.\n\n프리미엄 계산식:\n김프(%) = (업비트 KRW − 바이낸스 USD × 환율) ÷ (바이낸스 USD × 환율) × 100",
    },
    disclaimer: "본 서비스는 정보 제공 목적으로만 운영됩니다. 제공되는 모든 데이터는 투자 조언이 아니며, 투자 결정에 대한 책임은 사용자 본인에게 있습니다.",
    contactSection: {
      heading: "문의하기",
      body: "버그 제보, 제안, 협업 문의는 아래 이메일로 보내주세요.",
      email: "contact@koreanpremium.io",
    },
    legalLinks: { privacy: "개인정보 처리방침", terms: "이용약관" },
  },
  en: {
    title: "About KimchiPremium",
    back: "Back",
    tagline: "Real-time Cryptocurrency Kimchi Premium Tracker",
    description:
      "KimchiPremium is a free data service that tracks real-time price differences between domestic (Upbit) and international (Binance, Coinbase) cryptocurrency exchanges. The kimchi premium auto-refreshes every 5 seconds, and you can check the Fear & Greed Index, on-chain metrics, and the latest news all in one place.",
    features: [
      { icon: "zap", title: "Real-time Data", desc: "Upbit & Binance prices auto-refresh every 5 seconds" },
      { icon: "chart", title: "130+ Coins", desc: "Full coverage of Upbit KRW market coins" },
      { icon: "globe", title: "3 Languages", desc: "Full support for Korean, English & Chinese" },
      { icon: "shield", title: "Free & Ad-supported", desc: "No registration required, supported by Google AdSense" },
    ],
    dataSection: {
      heading: "Data Sources",
      items: [
        "Upbit API — Real-time KRW prices",
        "Binance API — Real-time USD prices",
        "Coinbase API — USD reference prices",
        "exchangerate-api.com — Real-time USD/KRW exchange rate",
        "Alternative.me — Fear & Greed Index",
        "CryptoCompare — Crypto news",
        "CoinMetrics — On-chain metrics (MVRV, active addresses, etc.)",
        "CoinGlass — Funding rate data",
      ],
    },
    premiumSection: {
      heading: "What is the Kimchi Premium?",
      body: "The kimchi premium refers to the percentage difference in the price of the same cryptocurrency between Korean and international exchanges. Due to capital movement restrictions and the unique KRW ecosystem, Korean exchange prices tend to be higher than global markets. A positive (+) difference is called a premium; a negative (−) difference is called a discount or reverse kimchi premium.\n\nFormula:\nPremium (%) = (Upbit KRW − Binance USD × Rate) ÷ (Binance USD × Rate) × 100",
    },
    disclaimer: "This Service is operated for informational purposes only. All data provided does not constitute investment advice, and all investment decisions are solely the responsibility of the user.",
    contactSection: {
      heading: "Contact",
      body: "For bug reports, suggestions, or partnership inquiries, please email us at:",
      email: "contact@koreanpremium.io",
    },
    legalLinks: { privacy: "Privacy Policy", terms: "Terms of Service" },
  },
  zh: {
    title: "关于 KimchiPremium",
    back: "返回",
    tagline: "实时加密货币泡菜溢价追踪器",
    description:
      "KimchiPremium是一项免费数据服务，实时追踪韩国国内（Upbit）与海外（Binance、Coinbase）加密货币交易所之间的价格差异。泡菜溢价每5秒自动刷新，恐慌贪婪指数、链上指标和最新新闻均可一站式查看。",
    features: [
      { icon: "zap", title: "实时数据", desc: "Upbit和Binance价格每5秒自动刷新" },
      { icon: "chart", title: "130+种加密货币", desc: "全面覆盖Upbit KRW市场币种" },
      { icon: "globe", title: "3种语言", desc: "完整支持韩语、英语和中文" },
      { icon: "shield", title: "免费及广告支持", desc: "无需注册，由Google AdSense广告支持运营" },
    ],
    dataSection: {
      heading: "数据来源",
      items: [
        "Upbit API — 实时韩元价格",
        "Binance API — 实时美元价格",
        "Coinbase API — 美元参考价格",
        "exchangerate-api.com — 实时美元/韩元汇率",
        "Alternative.me — 恐慌贪婪指数",
        "CryptoCompare — 加密货币新闻",
        "CoinMetrics — 链上指标（MVRV、活跃地址等）",
        "CoinGlass — 资金费率数据",
      ],
    },
    premiumSection: {
      heading: "什么是泡菜溢价？",
      body: "泡菜溢价是指韩国加密货币交易所与海外交易所之间同一币种价格差异的百分比指标。由于资本流动限制和韩元生态系统的特殊性，韩国交易所价格往往高于全球市场。正差值(+)称为溢价，负差值(-)称为折价或反向泡菜溢价。\n\n计算公式：\n溢价(%) = (Upbit韩元 − Binance美元 × 汇率) ÷ (Binance美元 × 汇率) × 100",
    },
    disclaimer: "本服务仅供参考。所提供的所有数据不构成投资建议，所有投资决策完全由用户本人负责。",
    contactSection: {
      heading: "联系我们",
      body: "如需报告错误、提出建议或商务合作，请发送邮件至：",
      email: "contact@koreanpremium.io",
    },
    legalLinks: { privacy: "隐私政策", terms: "服务条款" },
  },
};

const iconMap = {
  zap: Zap,
  chart: BarChart2,
  globe: Globe,
  shield: Shield,
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const titles = { ko: "소개 | KimchiPremium", en: "About | KimchiPremium", zh: "关于 | KimchiPremium" };
  return { title: titles[locale as keyof typeof titles] ?? titles.en };
}

export default async function AboutPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const c = CONTENT[locale as keyof typeof CONTENT] ?? CONTENT.en;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 space-y-6">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft size={14} />
        {c.back}
      </Link>

      {/* 헤더 */}
      <div className="glass rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">{c.title}</h1>
        <p className="text-sm text-indigo-400 mb-4">{c.tagline}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{c.description}</p>
      </div>

      {/* 주요 기능 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {c.features.map((f, i) => {
          const Icon = iconMap[f.icon as keyof typeof iconMap];
          return (
            <div key={i} className="glass rounded-xl p-5 flex gap-4">
              <div className="mt-0.5 shrink-0 h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Icon size={16} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">{f.title}</div>
                <div className="text-xs text-gray-500">{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 김치 프리미엄이란 */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-3">{c.premiumSection.heading}</h2>
        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{c.premiumSection.body}</p>
      </div>

      {/* 데이터 출처 */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4">{c.dataSection.heading}</h2>
        <ul className="space-y-2">
          {c.dataSection.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span className="text-sm text-gray-400">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 면책 고지 */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <p className="text-sm text-amber-200/80 leading-relaxed">{c.disclaimer}</p>
      </div>

      {/* 문의 */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-2">{c.contactSection.heading}</h2>
        <p className="text-sm text-gray-400 mb-3">{c.contactSection.body}</p>
        <a
          href={`mailto:${c.contactSection.email}`}
          className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Mail size={14} />
          {c.contactSection.email}
        </a>
      </div>

      {/* 법적 링크 */}
      <div className="flex gap-4 pb-4">
        <Link href={`/${locale}/privacy`} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          {c.legalLinks.privacy}
        </Link>
        <Link href={`/${locale}/terms`} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          {c.legalLinks.terms}
        </Link>
      </div>
    </div>
  );
}
