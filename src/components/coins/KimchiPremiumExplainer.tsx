import Link from "next/link";

const CONTENT = {
  ko: {
    heading: "김치 프리미엄이란?",
    body: "김치 프리미엄(김프)은 같은 암호화폐가 한국 거래소(업비트)와 해외 거래소(OKX) 사이에서 얼마나 다른 가격으로 거래되는지를 나타내는 지표입니다. 한국은 자본 이동 규제와 원화 중심의 폐쇄적 거래 생태계로 인해 글로벌 시장과 독립적인 가격 흐름이 형성됩니다.",
    whyMatters: {
      heading: "왜 중요한가요?",
      items: [
        { label: "시장 심리 바로미터", desc: "김프가 높으면 한국 투자자들이 과도하게 매수하고 있다는 신호. 역사적으로 +15% 이상은 과열 경보였습니다." },
        { label: "글로벌 vs 한국 시장 온도 차이", desc: "역김프(-값)는 글로벌 시장보다 한국 시장의 공포가 더 크다는 의미로, 바닥 신호로 해석되기도 합니다." },
        { label: "차익거래 기회 지표", desc: "프리미엄이 클수록 이론적 차익거래 기회가 존재하지만, 한국의 자본 규제로 인해 실제 실행은 제한적입니다." },
      ],
    },
    history: {
      heading: "역사적 사례",
      items: [
        { year: "2018 불장", value: "+40~50%", color: "text-rose-400" },
        { year: "2021 불장", value: "+20~25%", color: "text-orange-400" },
        { year: "2022 FTX", value: "−3~−5%", color: "text-blue-400" },
        { year: "현재", value: "−2~+3%", color: "text-emerald-400" },
      ],
    },
    learnMore: "자세히 알아보기 →",
    learnMoreHref: "/ko/about",
  },
  en: {
    heading: "What is the Kimchi Premium?",
    body: "The kimchi premium measures how much the same cryptocurrency costs more (or less) on Korean exchange Upbit versus global exchange OKX. South Korea's capital controls and closed KRW ecosystem create a partially independent price dynamic from global markets.",
    whyMatters: {
      heading: "Why It Matters",
      items: [
        { label: "Market Sentiment Barometer", desc: "A high premium signals Korean investors are buying aggressively. Historically, +15% or more has been an overheating alarm." },
        { label: "Korea vs Global Temperature Gap", desc: "A negative premium (discount) means Korean fear exceeds global sentiment — sometimes interpreted as a local bottom signal." },
        { label: "Arbitrage Indicator", desc: "Large premiums imply theoretical arbitrage opportunities, though Korean capital controls significantly limit execution in practice." },
      ],
    },
    history: {
      heading: "Historical Reference",
      items: [
        { year: "2018 Bull Run", value: "+40–50%", color: "text-rose-400" },
        { year: "2021 Bull Run", value: "+20–25%", color: "text-orange-400" },
        { year: "2022 FTX",      value: "−3–−5%",  color: "text-blue-400" },
        { year: "Today",         value: "−2–+3%",  color: "text-emerald-400" },
      ],
    },
    learnMore: "Learn more →",
    learnMoreHref: "/en/about",
  },
  zh: {
    heading: "什么是泡菜溢价？",
    body: "泡菜溢价衡量同一加密货币在韩国交易所（Upbit）与全球交易所（OKX）之间的价格差异百分比。由于韩国的资本管制和封闭的韩元交易生态系统，韩国市场形成了相对独立于全球市场的价格走势。",
    whyMatters: {
      heading: "为什么重要",
      items: [
        { label: "市场情绪晴雨表", desc: "溢价高意味着韩国投资者正在积极买入。历史上+15%以上曾是过热警报。" },
        { label: "韩国与全球市场温差", desc: "负溢价（折价）意味着韩国恐慌情绪超过全球水平，有时被解读为局部底部信号。" },
        { label: "套利机会指标", desc: "大溢价意味着理论上的套利机会，但韩国资本管制在实践中大大限制了执行。" },
      ],
    },
    history: {
      heading: "历史参考",
      items: [
        { year: "2018 牛市", value: "+40~50%", color: "text-rose-400" },
        { year: "2021 牛市", value: "+20~25%", color: "text-orange-400" },
        { year: "2022 FTX", value: "−3~−5%",  color: "text-blue-400" },
        { year: "当前",     value: "−2~+3%",  color: "text-emerald-400" },
      ],
    },
    learnMore: "了解更多 →",
    learnMoreHref: "/zh/about",
  },
};

export function KimchiPremiumExplainer({ locale }: { locale: string }) {
  const c = CONTENT[locale as keyof typeof CONTENT] ?? CONTENT.en;

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-base font-bold text-white mb-2">{c.heading}</h2>
        <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{c.body}</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">{c.whyMatters.heading}</h3>
        <div className="space-y-3">
          {c.whyMatters.items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/30 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-white">{item.label} — </span>
                <span className="text-xs text-[var(--fg-muted)] leading-relaxed">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">{c.history.heading}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {c.history.items.map((item, i) => (
            <div key={i} className="rounded-xl bg-white/4 border border-white/6 px-3 py-2.5 text-center">
              <p className={`text-sm font-bold font-number mb-0.5 ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-[var(--fg-muted)]">{item.year}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={c.learnMoreHref}
        className="inline-flex items-center text-xs text-[var(--fg-secondary)] hover:text-white transition-colors"
      >
        {c.learnMore}
      </Link>
    </div>
  );
}
