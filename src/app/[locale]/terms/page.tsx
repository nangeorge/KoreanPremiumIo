import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

type Params = { locale: string };

const CONTENT = {
  ko: {
    title: "이용약관",
    lastUpdated: "최종 업데이트: 2025년 3월",
    back: "돌아가기",
    disclaimer: {
      heading: "⚠️ 투자 위험 고지 (중요)",
      body: "본 서비스에서 제공하는 모든 데이터(가격, 프리미엄, 지표, 뉴스 등)는 정보 제공 목적으로만 제공됩니다.\n\n본 서비스는 금융투자업 등록 사업자가 아니며, 투자 자문·권유·중개 서비스를 제공하지 않습니다. 어떠한 정보도 매수·매도 권유로 해석될 수 없습니다.\n\n암호화폐 투자는 원금 손실 위험을 포함하며, 극단적인 변동성으로 인해 투자 원금 전액 손실이 발생할 수 있습니다. 모든 투자 결정과 그 결과에 대한 책임은 전적으로 투자자 본인에게 있습니다.",
    },
    sections: [
      {
        heading: "1. 서비스 개요",
        body: "KimchiPremium은 업비트(KRW)와 바이낸스(USD) 간 암호화폐 가격 차이(김치 프리미엄)를 실시간으로 표시하는 정보 제공 웹사이트입니다. 서비스 이용은 무료이며, 회원 가입 없이 이용 가능합니다.",
      },
      {
        heading: "2. 서비스 이용 조건",
        body: "• 본 서비스는 개인적, 비상업적 목적으로만 이용할 수 있습니다.\n• 서비스 데이터를 무단으로 크롤링, 스크래핑하거나 상업적 목적으로 재배포하는 행위를 금지합니다.\n• 서비스를 통해 불법적인 활동을 하는 것을 금지합니다.\n• 서비스에 과도한 트래픽을 유발하는 행위를 금지합니다.",
      },
      {
        heading: "3. 데이터 정확성 및 면책",
        body: "본 서비스는 외부 API(업비트, 바이낸스, Coinbase 등)에서 데이터를 수집하여 제공합니다. 다음 사항에 대해 책임지지 않습니다:\n\n• 데이터의 정확성, 완전성, 적시성\n• API 장애로 인한 데이터 누락 또는 오류\n• 네트워크 장애, 서버 점검 등으로 인한 서비스 중단\n• 데이터를 기반으로 한 투자 결정의 결과\n\n가격 데이터에는 수 초의 지연이 있을 수 있으며, 실제 거래 시점의 가격과 다를 수 있습니다.",
      },
      {
        heading: "4. 김치 프리미엄 계산 방식",
        body: "김치 프리미엄(김프)은 다음 공식으로 계산됩니다:\n\n김프(%) = (업비트 KRW 가격 - 바이낸스 USD 가격 × USD/KRW 환율) / (바이낸스 USD 가격 × USD/KRW 환율) × 100\n\n환율은 외부 API에서 실시간으로 가져오며, 환율 오차로 인해 실제 프리미엄과 차이가 있을 수 있습니다.",
      },
      {
        heading: "5. 지식재산권",
        body: "본 서비스의 소스코드, 디자인, 로고 등의 지식재산권은 KimchiPremium에 귀속됩니다. 코인 로고 등 제3자 콘텐츠의 지식재산권은 해당 권리자에게 귀속됩니다.",
      },
      {
        heading: "6. 서비스 변경 및 중단",
        body: "운영자는 사전 고지 없이 서비스의 내용을 변경하거나 일시적 또는 영구적으로 중단할 수 있습니다. 서비스 중단으로 인한 손해에 대해 책임지지 않습니다.",
      },
      {
        heading: "7. 광고",
        body: "본 서비스는 Google AdSense를 통한 광고를 표시할 수 있습니다. 광고 내용에 대한 책임은 해당 광고주에게 있으며, 서비스 운영자는 광고를 통한 투자 결정에 대해 책임지지 않습니다.",
      },
      {
        heading: "8. 채팅 기능 이용 규칙",
        body: "채팅 기능 이용 시 다음 행위를 금지합니다:\n\n• 타인을 비방하거나 명예를 훼손하는 발언\n• 개인정보 노출\n• 불법적이거나 음란한 내용\n• 스팸 또는 광고성 메시지\n• 특정 코인의 매수·매도 권유\n\n운영자는 부적절한 메시지를 삭제할 수 있습니다.",
      },
      {
        heading: "9. 준거법",
        body: "본 약관은 대한민국 법령을 준거법으로 합니다. 서비스 이용과 관련한 분쟁은 서울중앙지방법원을 관할 법원으로 합니다.",
      },
      {
        heading: "10. 약관 변경",
        body: "본 이용약관은 서비스 변경사항 또는 법령 개정에 따라 업데이트될 수 있습니다. 변경사항은 해당 페이지에 공지됩니다.",
      },
      {
        heading: "11. 문의",
        body: "이용약관에 관한 문의는 아래 이메일로 연락해 주세요.\n\ncontact@kimchipremium.com",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: March 2025",
    back: "Back",
    disclaimer: {
      heading: "⚠️ Investment Risk Disclaimer (Important)",
      body: "All data provided by this Service (prices, premiums, indicators, news, etc.) is provided for informational purposes only.\n\nThis Service is not a registered financial investment business and does not provide investment advice, solicitation, or brokerage services. Nothing on this Service should be construed as a recommendation to buy or sell any asset.\n\nCryptocurrency investment carries significant risk including total loss of principal. Extreme volatility may result in complete loss of your investment. All investment decisions and their outcomes are solely your responsibility.",
    },
    sections: [
      {
        heading: "1. Service Overview",
        body: "KimchiPremium is an informational website that displays real-time cryptocurrency price differences (kimchi premium) between Upbit (KRW) and Bybit (USD). The Service is free to use and requires no registration.",
      },
      {
        heading: "2. Terms of Use",
        body: "• This Service may only be used for personal, non-commercial purposes.\n• Unauthorized scraping, crawling, or commercial redistribution of Service data is prohibited.\n• Using the Service for illegal activities is prohibited.\n• Generating excessive traffic to the Service is prohibited.",
      },
      {
        heading: "3. Data Accuracy & Disclaimer",
        body: "This Service collects and provides data from external APIs (Upbit, Bybit, Coinbase, etc.). We are not responsible for:\n\n• Accuracy, completeness, or timeliness of data\n• Data gaps or errors due to API failures\n• Service interruptions due to network failures or maintenance\n• Results of investment decisions based on the data\n\nPrice data may be delayed by a few seconds and may differ from actual transaction prices.",
      },
      {
        heading: "4. Kimchi Premium Calculation",
        body: "The kimchi premium is calculated as follows:\n\nPremium (%) = (Upbit KRW price - Bybit USD price × USD/KRW rate) / (Bybit USD price × USD/KRW rate) × 100\n\nExchange rates are fetched in real-time from external APIs. Discrepancies due to exchange rate fluctuations may cause differences from the actual premium.",
      },
      {
        heading: "5. Intellectual Property",
        body: "The intellectual property rights to the Service's source code, design, and logo belong to KimchiPremium. Third-party content such as coin logos belongs to their respective owners.",
      },
      {
        heading: "6. Service Changes & Interruption",
        body: "The operator may modify the content of the Service or temporarily or permanently discontinue it without prior notice. We are not liable for damages caused by service interruptions.",
      },
      {
        heading: "7. Advertising",
        body: "This Service may display advertisements via Google AdSense. The respective advertisers are responsible for ad content, and the Service operator is not responsible for investment decisions made based on advertisements.",
      },
      {
        heading: "8. Chat Feature Rules",
        body: "The following conduct is prohibited when using the chat feature:\n\n• Defamatory statements or comments that damage others' reputation\n• Sharing personal information\n• Illegal or obscene content\n• Spam or promotional messages\n• Soliciting others to buy or sell specific coins\n\nThe operator may delete inappropriate messages.",
      },
      {
        heading: "9. Governing Law",
        body: "These Terms shall be governed by the laws of the Republic of Korea. Disputes related to the use of the Service shall be subject to the jurisdiction of the Seoul Central District Court.",
      },
      {
        heading: "10. Changes to Terms",
        body: "These Terms of Service may be updated in response to service changes or legal amendments. Changes will be posted on this page.",
      },
      {
        heading: "11. Contact",
        body: "For questions about these Terms, please contact us at:\n\ncontact@kimchipremium.com",
      },
    ],
  },
  zh: {
    title: "服务条款",
    lastUpdated: "最后更新：2025年3月",
    back: "返回",
    disclaimer: {
      heading: "⚠️ 投资风险免责声明（重要）",
      body: "本服务提供的所有数据（价格、溢价、指标、新闻等）仅供参考。\n\n本服务不是注册金融投资业务，不提供投资建议、招揽或中介服务。本服务上的任何内容均不应被解读为买入或卖出任何资产的建议。\n\n加密货币投资具有重大风险，包括本金全部损失。极端波动可能导致您的投资完全损失。所有投资决策及其结果完全由您个人负责。",
    },
    sections: [
      {
        heading: "1. 服务概述",
        body: "KimchiPremium是一个信息类网站，实时显示Upbit（韩元）与Binance（美元）之间的加密货币价格差异（泡菜溢价）。本服务免费使用，无需注册。",
      },
      {
        heading: "2. 使用条款",
        body: "• 本服务仅可用于个人、非商业目的。\n• 禁止未经授权抓取、爬取本服务数据或将其用于商业目的再分发。\n• 禁止利用本服务从事非法活动。\n• 禁止对本服务产生过度流量。",
      },
      {
        heading: "3. 数据准确性及免责声明",
        body: "本服务从外部API（Upbit、Bybit、Coinbase等）收集并提供数据。对以下事项不承担责任：\n\n• 数据的准确性、完整性或及时性\n• 因API故障导致的数据缺失或错误\n• 因网络故障或维护导致的服务中断\n• 基于数据做出投资决策的结果\n\n价格数据可能延迟数秒，可能与实际交易价格不同。",
      },
      {
        heading: "4. 泡菜溢价计算方式",
        body: "泡菜溢价计算公式如下：\n\n溢价(%) = (Upbit韩元价格 - Bybit美元价格 × 美元/韩元汇率) / (Bybit美元价格 × 美元/韩元汇率) × 100\n\n汇率通过外部API实时获取。汇率波动可能导致与实际溢价存在差异。",
      },
      {
        heading: "5. 知识产权",
        body: "本服务源代码、设计及标志的知识产权归KimchiPremium所有。币种标志等第三方内容的知识产权归相应权利人所有。",
      },
      {
        heading: "6. 服务变更及中断",
        body: "运营者可在不事先通知的情况下变更服务内容或临时/永久停止服务。对因服务中断造成的损失不承担责任。",
      },
      {
        heading: "7. 广告",
        body: "本服务可能通过Google AdSense显示广告。广告内容由相应广告主负责，服务运营者对基于广告做出的投资决策不承担责任。",
      },
      {
        heading: "8. 聊天功能使用规则",
        body: "使用聊天功能时，以下行为被禁止：\n\n• 诽谤他人或损害他人名誉的言论\n• 泄露个人信息\n• 违法或淫秽内容\n• 垃圾邮件或促销消息\n• 劝说他人买卖特定加密货币\n\n运营者可删除不当消息。",
      },
      {
        heading: "9. 适用法律",
        body: "本条款受大韩民国法律管辖。与本服务使用相关的纠纷应提交首尔中央地方法院管辖。",
      },
      {
        heading: "10. 条款变更",
        body: "本服务条款可能因服务变更或法律修订而更新。变更内容将在本页面公布。",
      },
      {
        heading: "11. 联系我们",
        body: "如对本条款有任何疑问，请通过以下邮箱联系我们：\n\ncontact@kimchipremium.com",
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const titles = { ko: "이용약관 | KimchiPremium", en: "Terms of Service | KimchiPremium", zh: "服务条款 | KimchiPremium" };
  return { title: titles[locale as keyof typeof titles] ?? titles.en };
}

export default async function TermsPage({ params }: { params: Promise<Params> }) {
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

      <div className="space-y-4">
        {/* 투자 위험 고지 — 최상단 강조 */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-rose-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-base font-bold text-rose-400 mb-2">{c.disclaimer.heading}</h2>
              <p className="text-sm text-[var(--fg)] leading-relaxed whitespace-pre-line">{c.disclaimer.body}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">{c.title}</h1>
          <p className="text-xs text-[var(--fg-muted)] mb-8">{c.lastUpdated}</p>

          <div className="space-y-8">
            {c.sections.map((sec, i) => (
              <div key={i}>
                <h2 className="text-base font-semibold text-[var(--fg)] mb-2">{sec.heading}</h2>
                <p className="text-sm text-[var(--fg-secondary)] leading-relaxed whitespace-pre-line">{sec.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
