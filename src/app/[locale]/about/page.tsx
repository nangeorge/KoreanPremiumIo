import Link from "next/link";
import { ArrowLeft, Mail, Globe, BarChart2, Zap, Shield, TrendingUp, Database, Clock, Users } from "lucide-react";
import type { Metadata } from "next";

type Params = { locale: string };

const CONTENT = {
  ko: {
    title: "KimchiPremium 소개",
    back: "돌아가기",
    tagline: "실시간 암호화폐 김치 프리미엄 트래커",
    description:
      "KimchiPremium은 국내 거래소(업비트)와 해외 거래소(OKX, Coinbase) 간 암호화폐 가격 차이를 실시간으로 추적하는 무료 데이터 서비스입니다. 김치 프리미엄(김프)을 5초마다 자동 갱신하며, 공포탐욕지수·온체인 지표·최신 뉴스까지 한 곳에서 확인할 수 있습니다.",

    mission: {
      heading: "왜 만들었나요?",
      body: "한국은 전 세계에서 암호화폐 참여도가 가장 높은 나라 중 하나입니다. 국내 인구의 약 30%가 암호화폐를 보유하고 있고, 원화 거래량은 글로벌 비트코인 거래량의 약 10%를 차지합니다.\n\n그럼에도 불구하고 '김치 프리미엄'을 실시간으로, 한눈에, 모바일에서 확인할 수 있는 도구가 부족했습니다. 기존 서비스들은 업데이트가 느리거나, 지원 코인이 적거나, 인터페이스가 불편했습니다.\n\nKimchiPremium은 투자자와 트레이더가 한국 시장의 온도를 빠르게 파악할 수 있도록 만들어졌습니다. 데이터는 항상 5초 이내로 최신 상태를 유지하며, 업비트 전체 KRW 마켓(130개 이상 코인)을 완전히 커버합니다.",
    },

    methodology: {
      heading: "프리미엄 계산 방식",
      body: "김치 프리미엄은 다음 공식으로 계산됩니다:",
      formula: "김프(%) = (업비트 KRW − OKX USD × USD/KRW 환율) ÷ (OKX USD × USD/KRW 환율) × 100",
      steps: [
        "업비트 API에서 KRW 가격을 실시간으로 수신",
        "OKX API에서 USDT 가격을 실시간으로 수신",
        "실시간 USD/KRW 환율을 적용해 OKX 가격을 원화로 환산",
        "두 가격의 차이를 백분율로 계산",
        "5초마다 전체 과정을 반복",
      ],
      note: "바이낸스 미상장 코인(BORA, MLK, MBL 등 한국 전용 코인)은 OKX에도 미상장인 경우가 많아 프리미엄이 '—'로 표시됩니다.",
    },

    history: {
      heading: "김치 프리미엄의 역사",
      items: [
        { period: "2017–2018 불장", premium: "+40~50%", desc: "한국 코인 열풍 절정기. 비트코인이 해외 대비 절반 가격으로 국내에서 거래됨." },
        { period: "2018년 12월 폭락", premium: "−3~−5%", desc: "글로벌 하락장 속 한국 시장이 더 빠르게 팔림. 역프리미엄 등장." },
        { period: "2021년 4월 불장", premium: "+20~25%", desc: "다시 한국 시장 과열. 알트코인 중심의 강한 프리미엄." },
        { period: "2022년 FTX 붕괴", premium: "−3~−5%", desc: "글로벌 최악의 하락장. 한국 시장도 동반 급락." },
        { period: "현재", premium: "−2~+3%", desc: "대체로 안정적인 수준. 불장·공포 시기에 즉각 반응." },
      ],
      insight: "💡 역사적으로 김치 프리미엄이 +15% 이상이면 과열 경고, −5% 이하면 극단적 공포의 신호로 해석되어 왔습니다.",
    },

    features: [
      { icon: "zap",    title: "5초 실시간 갱신",   desc: "업비트·OKX 가격을 5초마다 자동 갱신. SWR 폴링 방식으로 안정적 데이터 수신." },
      { icon: "chart",  title: "130+ 코인 전수 커버", desc: "업비트 KRW 마켓의 모든 코인을 지원. 신규 상장 코인도 자동 반영." },
      { icon: "clock",  title: "히스토리 차트",     desc: "1시간·4시간·일봉·주봉 단위로 김치 프리미엄 추이 확인 가능." },
      { icon: "globe",  title: "3개 언어 완전 지원", desc: "한국어·영어·중국어로 전체 서비스 이용 가능." },
      { icon: "trend",  title: "공포탐욕지수·온체인", desc: "BTC 공포탐욕지수, MVRV, 해시레이트 등 핵심 지표 통합 제공." },
      { icon: "shield", title: "무료 & 광고 기반",   desc: "회원가입 없이 완전 무료. Google AdSense 광고로 운영 비용 충당." },
    ],

    faq: {
      heading: "자주 묻는 질문",
      items: [
        {
          q: "김치 프리미엄이 높으면 어떤 의미인가요?",
          a: "김프가 높다는 것은 한국 시장에서의 수요가 해외 대비 과도하게 높다는 의미입니다. 과거 패턴상 +10% 이상은 단기 과열 신호로 해석되는 경우가 많았으나, 이것이 곧 하락의 확정 신호는 아닙니다.",
        },
        {
          q: "역프리미엄(역김프)이란?",
          a: "국내 가격이 해외보다 낮을 때 발생하는 현상입니다. 한국 시장의 공포가 글로벌 대비 크거나, 해외 매수세가 더 강할 때 나타납니다.",
        },
        {
          q: "데이터는 얼마나 정확한가요?",
          a: "업비트·OKX 공식 REST API를 통해 5초마다 최신 체결가를 수신합니다. 환율은 exchangerate-api.com을 사용하며 1분 단위로 갱신됩니다. 단, API 지연이나 일시적 오류로 인해 짧은 시간 동안 부정확한 데이터가 표시될 수 있습니다.",
        },
        {
          q: "어떤 코인이 지원되나요?",
          a: "업비트 KRW 마켓에 상장된 전체 코인(130개 이상)이 지원됩니다. OKX에 미상장된 한국 전용 코인(BORA, MLK, MBL, MED, HUNT 등)은 글로벌 가격 비교가 불가능하므로 프리미엄이 '—'로 표시됩니다.",
        },
      ],
    },

    dataSection: {
      heading: "데이터 출처",
      items: [
        "업비트 API — 원화(KRW) 실시간 가격 (공식 REST API)",
        "OKX API — 달러(USD) 실시간 가격 (공식 REST API)",
        "Coinbase API — 달러(USD) 참조 가격",
        "exchangerate-api.com — 실시간 USD/KRW 환율 (1분 갱신)",
        "Alternative.me — 공포탐욕지수",
        "CryptoCompare — 암호화폐 뉴스 헤드라인",
        "CoinMetrics — 온체인 지표 (MVRV, 활성주소, 해시레이트, 트랜잭션)",
        "CoinGlass — 펀딩비 데이터",
        "CoinGecko — 시가총액 정렬 기준",
      ],
    },

    disclaimer: "본 서비스는 정보 제공 목적으로만 운영됩니다. 제공되는 모든 데이터는 투자 조언이 아니며, 투자 결정에 대한 책임은 사용자 본인에게 있습니다. 암호화폐 투자에는 원금 손실 위험이 있습니다.",

    contactSection: {
      heading: "문의하기",
      body: "버그 제보, 기능 제안, 협업·제휴 문의는 아래 이메일로 보내주세요. 빠른 시일 내에 답변드리겠습니다.",
      email: "contact@kimchipremium.com",
    },
    legalLinks: { privacy: "개인정보 처리방침", terms: "이용약관" },
  },
  en: {
    title: "About KimchiPremium",
    back: "Back",
    tagline: "Real-time Cryptocurrency Kimchi Premium Tracker",
    description:
      "KimchiPremium is a free data service that tracks real-time price differences between the Korean exchange (Upbit) and international exchanges (OKX, Coinbase). The kimchi premium refreshes every 5 seconds, covering 130+ coins with fear & greed index, on-chain metrics, and the latest news — all in one place.",

    mission: {
      heading: "Why We Built This",
      body: "South Korea is one of the most crypto-active nations in the world. Around 30% of the Korean population holds cryptocurrency, and Korean Won trading accounts for roughly 10% of global Bitcoin volume.\n\nDespite this, there was no tool that let traders monitor the 'kimchi premium' in real-time, across all coins, on mobile. Existing services had slow updates, limited coin coverage, or clunky interfaces.\n\nKimchiPremium was built to give investors and traders a fast, clear read on the Korean market's temperature. Data stays within 5 seconds of the latest tick, and we cover the entire Upbit KRW market (130+ coins).",
    },

    methodology: {
      heading: "How the Premium Is Calculated",
      body: "The kimchi premium is calculated using this formula:",
      formula: "Premium (%) = (Upbit KRW − OKX USD × USD/KRW Rate) ÷ (OKX USD × USD/KRW Rate) × 100",
      steps: [
        "Fetch KRW price from Upbit's official REST API",
        "Fetch USDT price from OKX's official REST API",
        "Apply real-time USD/KRW exchange rate to convert OKX price to KRW",
        "Calculate the percentage difference between the two KRW prices",
        "Repeat the entire process every 5 seconds",
      ],
      note: "Coins not listed on OKX (Korean-only coins like BORA, MLK, MBL, etc.) display '—' for the premium since no global reference price exists.",
    },

    history: {
      heading: "History of the Kimchi Premium",
      items: [
        { period: "2017–2018 Bull Run", premium: "+40–50%", desc: "Peak Korea crypto mania. Bitcoin traded at nearly double the global price domestically." },
        { period: "Dec 2018 Crash", premium: "−3–−5%", desc: "Korea sold faster than global markets. First major reverse kimchi premium." },
        { period: "Apr 2021 Bull Run", premium: "+20–25%", desc: "Korean market overheated again, led by altcoins." },
        { period: "Nov 2022 FTX Collapse", premium: "−3–−5%", desc: "Global worst crash. Korean market fell in tandem." },
        { period: "Today", premium: "−2–+3%", desc: "Generally stable. Spikes immediately during greed or fear cycles." },
      ],
      insight: "💡 Historically, a premium above +15% has been interpreted as an overheating warning; below −5% as extreme fear.",
    },

    features: [
      { icon: "zap",    title: "5-Second Live Updates",  desc: "Upbit & OKX prices refresh every 5 seconds via SWR polling for reliable data." },
      { icon: "chart",  title: "130+ Coins",             desc: "Full Upbit KRW market coverage. New listings automatically appear." },
      { icon: "clock",  title: "Historical Charts",      desc: "View premium trends across 1H, 4H, 1D, and 1W timeframes." },
      { icon: "globe",  title: "3 Languages",            desc: "Full Korean, English, and Chinese support throughout." },
      { icon: "trend",  title: "Fear & Greed + On-chain", desc: "BTC Fear & Greed, MVRV, hash rate, and more in one place." },
      { icon: "shield", title: "Free & Ad-supported",    desc: "Completely free, no registration. Supported by Google AdSense." },
    ],

    faq: {
      heading: "Frequently Asked Questions",
      items: [
        {
          q: "What does a high kimchi premium mean?",
          a: "A high kimchi premium means Korean demand is running hotter than global markets. Historically, premiums above +10% have often signaled short-term overheating — but this is not a confirmed reversal signal on its own.",
        },
        {
          q: "What is a reverse kimchi premium?",
          a: "This occurs when Korean prices fall below international prices. It typically appears when Korean fear is greater than global sentiment, or when foreign buying is disproportionately strong.",
        },
        {
          q: "How accurate is the data?",
          a: "We fetch the latest trade price from Upbit and OKX official REST APIs every 5 seconds. Exchange rates are updated every minute via exchangerate-api.com. Brief inaccuracies may occur during API delays or outages.",
        },
        {
          q: "Which coins are supported?",
          a: "All coins listed on Upbit's KRW market (130+). Korean-only coins not listed on OKX (BORA, MLK, MBL, MED, HUNT, etc.) show '—' for the premium since no global comparison is possible.",
        },
      ],
    },

    dataSection: {
      heading: "Data Sources",
      items: [
        "Upbit API — Real-time KRW prices (official REST API)",
        "OKX API — Real-time USD prices (official REST API)",
        "Coinbase API — USD reference prices",
        "exchangerate-api.com — Real-time USD/KRW exchange rate (1-min refresh)",
        "Alternative.me — Fear & Greed Index",
        "CryptoCompare — Cryptocurrency news headlines",
        "CoinMetrics — On-chain metrics (MVRV, active addresses, hash rate, transactions)",
        "CoinGlass — Funding rate data",
        "CoinGecko — Market cap ranking data",
      ],
    },

    disclaimer: "This service is operated for informational purposes only. All data provided does not constitute investment advice. All investment decisions are solely the responsibility of the user. Cryptocurrency investing involves significant risk of loss.",

    contactSection: {
      heading: "Contact",
      body: "For bug reports, feature suggestions, or partnership inquiries, please email us. We'll get back to you promptly.",
      email: "contact@kimchipremium.com",
    },
    legalLinks: { privacy: "Privacy Policy", terms: "Terms of Service" },
  },
  zh: {
    title: "关于 KimchiPremium",
    back: "返回",
    tagline: "实时加密货币泡菜溢价追踪器",
    description:
      "KimchiPremium是一项免费数据服务，实时追踪韩国交易所（Upbit）与海外交易所（OKX、Coinbase）之间的加密货币价格差异。泡菜溢价每5秒自动刷新，支持130+种币种，并整合了恐慌贪婪指数、链上指标和最新新闻。",

    mission: {
      heading: "为什么建立这个网站？",
      body: "韩国是全球加密货币参与度最高的国家之一。约30%的韩国人持有加密货币，韩元交易量约占全球比特币交易量的10%。\n\n尽管如此，当时市面上缺乏能够实时、全面、移动端友好地监控'泡菜溢价'的工具。现有服务更新缓慢、支持币种少或界面不便。\n\nKimchiPremium旨在帮助投资者和交易者快速了解韩国市场温度。数据始终保持5秒内最新，完整覆盖Upbit KRW市场（130+种币种）。",
    },

    methodology: {
      heading: "溢价计算方式",
      body: "泡菜溢价使用以下公式计算：",
      formula: "溢价(%) = (Upbit韩元 − OKX美元 × 美元/韩元汇率) ÷ (OKX美元 × 美元/韩元汇率) × 100",
      steps: [
        "从Upbit官方REST API实时获取韩元价格",
        "从OKX官方REST API实时获取USDT价格",
        "应用实时美元/韩元汇率将OKX价格转换为韩元",
        "计算两个韩元价格之间的百分比差异",
        "每5秒重复整个过程",
      ],
      note: "未在OKX上市的币种（BORA、MLK、MBL等韩国专属币种）由于缺乏全球参考价格，溢价显示为 '--'。",
    },

    history: {
      heading: "泡菜溢价的历史",
      items: [
        { period: "2017–2018 牛市", premium: "+40~50%", desc: "韩国加密货币热潮顶峰。比特币国内价格几乎是海外的两倍。" },
        { period: "2018年12月暴跌", premium: "−3~−5%", desc: "韩国市场抛售速度快于全球市场，出现首次大规模反向溢价。" },
        { period: "2021年4月牛市", premium: "+20~25%", desc: "韩国市场再次过热，以山寨币为主导。" },
        { period: "2022年11月FTX崩溃", premium: "−3~−5%", desc: "全球最严重崩盘，韩国市场同步暴跌。" },
        { period: "当前", premium: "−2~+3%", desc: "总体稳定，在贪婪或恐慌周期中立即反应。" },
      ],
      insight: "💡 历史上，溢价超过+15%被视为过热警告，低于-5%则是极度恐慌的信号。",
    },

    features: [
      { icon: "zap",    title: "5秒实时更新",    desc: "Upbit和OKX价格每5秒自动刷新，通过SWR轮询稳定获取数据。" },
      { icon: "chart",  title: "130+种币种",     desc: "完整覆盖Upbit KRW市场所有币种，新上市币种自动添加。" },
      { icon: "clock",  title: "历史图表",       desc: "可查看1小时、4小时、日线、周线的溢价趋势。" },
      { icon: "globe",  title: "3种语言完整支持", desc: "韩语、英语和中文全程支持。" },
      { icon: "trend",  title: "恐慌贪婪+链上指标", desc: "BTC恐慌贪婪指数、MVRV、哈希率等核心指标一站式提供。" },
      { icon: "shield", title: "免费及广告支持",  desc: "完全免费，无需注册，由Google AdSense广告支持运营。" },
    ],

    faq: {
      heading: "常见问题",
      items: [
        {
          q: "泡菜溢价高意味着什么？",
          a: "溢价高意味着韩国市场需求远超全球水平。历史上，溢价超过+10%通常被视为短期过热信号，但这并不是确认反转的独立信号。",
        },
        {
          q: "什么是反向泡菜溢价？",
          a: "当韩国价格低于国际价格时出现。通常在韩国恐慌情绪大于全球市场，或海外买盘异常强劲时发生。",
        },
        {
          q: "数据有多准确？",
          a: "我们每5秒从Upbit和OKX官方REST API获取最新成交价。汇率通过exchangerate-api.com每分钟更新一次。API延迟或故障期间可能短暂出现不准确数据。",
        },
        {
          q: "支持哪些币种？",
          a: "支持Upbit KRW市场上市的所有币种（130+种）。未在OKX上市的韩国专属币种（BORA、MLK、MBL、MED、HUNT等）由于无法进行全球比较，溢价显示为 '--'。",
        },
      ],
    },

    dataSection: {
      heading: "数据来源",
      items: [
        "Upbit API — 实时韩元价格（官方REST API）",
        "OKX API — 实时美元价格（官方REST API）",
        "Coinbase API — 美元参考价格",
        "exchangerate-api.com — 实时美元/韩元汇率（每分钟更新）",
        "Alternative.me — 恐慌贪婪指数",
        "CryptoCompare — 加密货币新闻标题",
        "CoinMetrics — 链上指标（MVRV、活跃地址、哈希率、交易量）",
        "CoinGlass — 资金费率数据",
        "CoinGecko — 市值排名数据",
      ],
    },

    disclaimer: "本服务仅供参考。所提供的所有数据不构成投资建议，所有投资决策完全由用户本人负责。加密货币投资存在重大亏损风险。",

    contactSection: {
      heading: "联系我们",
      body: "如需报告错误、提出功能建议或商务合作，请发送邮件至以下地址，我们将尽快回复。",
      email: "contact@kimchipremium.com",
    },
    legalLinks: { privacy: "隐私政策", terms: "服务条款" },
  },
};

const iconMap = { zap: Zap, chart: BarChart2, globe: Globe, shield: Shield, trend: TrendingUp, clock: Clock, users: Users, db: Database };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const titles = { ko: "소개 | KimchiPremium", en: "About | KimchiPremium", zh: "关于 | KimchiPremium" };
  const descs = {
    ko: "KimchiPremium 서비스 소개, 김치 프리미엄 계산 방식, 데이터 출처, 역사적 맥락을 확인하세요.",
    en: "Learn about KimchiPremium — how we calculate the kimchi premium, our data sources, and the historical context of Korea's crypto market.",
    zh: "了解KimchiPremium — 泡菜溢价的计算方式、数据来源以及韩国加密货币市场的历史背景。",
  };
  return {
    title: titles[locale as keyof typeof titles] ?? titles.en,
    description: descs[locale as keyof typeof descs] ?? descs.en,
  };
}

export default async function AboutPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const c = CONTENT[locale as keyof typeof CONTENT] ?? CONTENT.en;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 space-y-6">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
      >
        <ArrowLeft size={14} />
        {c.back}
      </Link>

      {/* 헤더 */}
      <div className="glass rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">{c.title}</h1>
        <p className="text-sm text-[var(--fg-secondary)] mb-4">{c.tagline}</p>
        <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{c.description}</p>
      </div>

      {/* 왜 만들었나 */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-3">{c.mission.heading}</h2>
        <p className="text-sm text-[var(--fg-secondary)] leading-relaxed whitespace-pre-line">{c.mission.body}</p>
      </div>

      {/* 계산 방식 */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-3">{c.methodology.heading}</h2>
        <p className="text-sm text-[var(--fg-secondary)] mb-4">{c.methodology.body}</p>
        <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 mb-4">
          <code className="text-xs text-emerald-400 leading-relaxed">{c.methodology.formula}</code>
        </div>
        <ol className="space-y-2 mb-4">
          {c.methodology.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-[var(--fg-secondary)]">
              <span className="shrink-0 h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{c.methodology.note}</p>
      </div>

      {/* 역사 */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4">{c.history.heading}</h2>
        <div className="space-y-3 mb-4">
          {c.history.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="shrink-0 w-28 text-right">
                <span className="text-[10px] font-semibold text-[var(--fg-muted)]">{item.period}</span>
              </div>
              <div className="shrink-0 w-20 text-center">
                <span className={`text-xs font-bold font-number ${item.premium.startsWith("+") ? "text-rose-400" : item.premium.startsWith("−") || item.premium.startsWith("-") ? "text-blue-400" : "text-[var(--fg-secondary)]"}`}>
                  {item.premium}
                </span>
              </div>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed flex-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-amber-500/8 border border-amber-500/20 px-4 py-3">
          <p className="text-xs text-amber-200/80 leading-relaxed">{c.history.insight}</p>
        </div>
      </div>

      {/* 주요 기능 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {c.features.map((f, i) => {
          const Icon = iconMap[f.icon as keyof typeof iconMap] ?? Zap;
          return (
            <div key={i} className="glass rounded-xl p-5 flex gap-4">
              <div className="mt-0.5 shrink-0 h-8 w-8 rounded-lg bg-white/8 flex items-center justify-center">
                <Icon size={16} className="text-[var(--fg)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">{f.title}</div>
                <div className="text-xs text-[var(--fg-muted)]">{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4">{c.faq.heading}</h2>
        <div className="space-y-4">
          {c.faq.items.map((item, i) => (
            <div key={i} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
              <p className="text-sm font-semibold text-white mb-1.5">Q. {item.q}</p>
              <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 데이터 출처 */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4">{c.dataSection.heading}</h2>
        <ul className="space-y-2">
          {c.dataSection.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40 shrink-0" />
              <span className="text-sm text-[var(--fg-secondary)]">{item}</span>
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
        <p className="text-sm text-[var(--fg-secondary)] mb-3">{c.contactSection.body}</p>
        <a
          href={`mailto:${c.contactSection.email}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--fg-secondary)] hover:text-white transition-colors"
        >
          <Mail size={14} />
          {c.contactSection.email}
        </a>
      </div>

      {/* 법적 링크 */}
      <div className="flex gap-4 pb-4">
        <Link href={`/${locale}/privacy`} className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors">
          {c.legalLinks.privacy}
        </Link>
        <Link href={`/${locale}/terms`} className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors">
          {c.legalLinks.terms}
        </Link>
      </div>
    </div>
  );
}
