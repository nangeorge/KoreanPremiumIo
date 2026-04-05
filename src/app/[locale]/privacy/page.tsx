import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

type Params = { locale: string };

const CONTENT = {
  ko: {
    title: "개인정보 처리방침",
    lastUpdated: "최종 업데이트: 2025년 3월",
    back: "돌아가기",
    sections: [
      {
        heading: "1. 개요",
        body: "KimchiPremium(이하 '서비스')은 실시간 암호화폐 김치 프리미엄 정보를 제공하는 무료 데이터 서비스입니다. 본 개인정보 처리방침은 서비스 이용 과정에서 수집되는 정보와 그 처리 방법을 설명합니다.",
      },
      {
        heading: "2. 수집하는 정보",
        body: "본 서비스는 개인 식별 정보를 직접 수집하지 않습니다. 다음 정보는 서비스 품질 향상 목적으로 제3자 도구를 통해 자동 수집될 수 있습니다:\n\n• 방문 페이지, 체류 시간, 클릭 경로 등 이용 통계 (Google Analytics)\n• 브라우저 종류, 운영체제, 화면 해상도 등 기기 정보\n• 대략적인 접속 국가/지역 (IP 기반, 개인 식별 불가)\n• 광고 노출 및 클릭 데이터 (Google AdSense)",
      },
      {
        heading: "3. 쿠키 및 로컬 스토리지",
        body: "서비스는 다음 목적으로 쿠키 및 브라우저 로컬 스토리지를 사용합니다:\n\n• 언어 설정 저장 (ko/en/zh)\n• 채팅 닉네임 유지\n• Google Analytics 이용 통계 수집\n• Google AdSense 맞춤 광고 제공\n\n브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수 있습니다.",
      },
      {
        heading: "4. Google Analytics",
        body: "본 서비스는 Google LLC의 웹 분석 서비스인 Google Analytics를 사용합니다. Google Analytics는 쿠키를 통해 익명화된 이용 데이터를 수집합니다. 수집된 데이터는 Google의 서버로 전송되며, Google의 개인정보 처리방침에 따라 처리됩니다.\n\nGoogle Analytics 데이터 수집을 거부하려면 Google Analytics Opt-out Browser Add-on을 설치하거나, 브라우저의 Do Not Track 기능을 활성화하세요.",
      },
      {
        heading: "5. Google AdSense",
        body: "본 서비스는 Google LLC의 광고 서비스인 Google AdSense를 사용할 수 있습니다. Google AdSense는 쿠키를 사용하여 사용자의 관심사를 기반으로 맞춤 광고를 표시합니다. Google의 광고 데이터 사용 방식은 Google 개인정보처리방침(policies.google.com)에서 확인할 수 있습니다.\n\n광고 개인화를 원하지 않는 경우 aboutads.info/choices 또는 youronlinechoices.eu에서 설정할 수 있습니다.",
      },
      {
        heading: "6. 외부 API 및 데이터",
        body: "서비스는 다음 외부 소스에서 가격 데이터를 가져옵니다:\n\n• 업비트(Upbit) API — 원화 시세\n• Bybit API — 달러 시세\n• Coinbase API — 달러 시세\n• exchangerate-api.com — 환율 데이터\n• Alternative.me — 공포탐욕지수\n• CryptoCompare — 뉴스\n\n이 과정에서 사용자의 개인정보는 전달되지 않습니다.",
      },
      {
        heading: "7. 채팅 기능",
        body: "서비스의 채팅 기능은 사용자가 직접 입력한 닉네임과 메시지를 인메모리 방식으로 임시 저장합니다. 닉네임은 브라우저 로컬 스토리지에 저장됩니다. 채팅 메시지에 개인정보를 입력하지 않도록 주의하세요. 서버 재시작 시 모든 채팅 메시지는 삭제됩니다.",
      },
      {
        heading: "8. 미성년자",
        body: "본 서비스는 만 14세 미만의 어린이를 대상으로 하지 않으며, 의도적으로 미성년자의 개인정보를 수집하지 않습니다.",
      },
      {
        heading: "9. 보안",
        body: "서비스는 HTTPS 암호화 통신을 사용합니다. 다만, 인터넷을 통한 전송이나 전자적 저장 방법은 100% 안전하지 않을 수 있습니다.",
      },
      {
        heading: "10. 방침 변경",
        body: "본 개인정보 처리방침은 서비스 변경사항이나 법령 변경에 따라 업데이트될 수 있습니다. 중요한 변경사항이 있을 경우 해당 페이지를 통해 안내합니다.",
      },
      {
        heading: "11. 문의",
        body: "개인정보 처리방침에 관한 문의사항은 아래 이메일로 연락해 주세요.\n\ncontact@kimchipremium.com",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: March 2025",
    back: "Back",
    sections: [
      {
        heading: "1. Overview",
        body: "KimchiPremium ('Service') is a free data service providing real-time cryptocurrency kimchi premium information. This Privacy Policy explains what information is collected during use of the Service and how it is handled.",
      },
      {
        heading: "2. Information We Collect",
        body: "This Service does not directly collect personally identifiable information. The following information may be automatically collected through third-party tools for service improvement purposes:\n\n• Usage statistics such as pages visited, time spent, and click paths (Google Analytics)\n• Device information such as browser type, operating system, and screen resolution\n• Approximate access country/region (IP-based, not personally identifiable)\n• Ad impression and click data (Google AdSense)",
      },
      {
        heading: "3. Cookies & Local Storage",
        body: "The Service uses cookies and browser local storage for the following purposes:\n\n• Storing language preferences (ko/en/zh)\n• Maintaining chat nicknames\n• Collecting usage statistics via Google Analytics\n• Serving personalized ads via Google AdSense\n\nYou can disable cookies in your browser settings, but some features may be limited.",
      },
      {
        heading: "4. Google Analytics",
        body: "This Service uses Google Analytics, a web analytics service provided by Google LLC. Google Analytics collects anonymized usage data through cookies. Collected data is transmitted to Google's servers and processed according to Google's Privacy Policy.\n\nTo opt out of Google Analytics data collection, install the Google Analytics Opt-out Browser Add-on or enable your browser's Do Not Track feature.",
      },
      {
        heading: "5. Google AdSense",
        body: "This Service may use Google AdSense, an advertising service provided by Google LLC. Google AdSense uses cookies to display personalized ads based on user interests. You can learn how Google uses advertising data at policies.google.com.\n\nTo opt out of personalized advertising, visit aboutads.info/choices or youronlinechoices.eu.",
      },
      {
        heading: "6. External APIs & Data",
        body: "The Service fetches price data from the following external sources:\n\n• Upbit API — KRW prices\n• Bybit API — USD prices\n• Coinbase API — USD prices\n• exchangerate-api.com — Exchange rate data\n• Alternative.me — Fear & Greed Index\n• CryptoCompare — News\n\nNo personal information is transmitted in this process.",
      },
      {
        heading: "7. Chat Feature",
        body: "The Service's chat feature temporarily stores user-provided nicknames and messages in-memory on the server. Nicknames are stored in browser local storage. Please avoid entering personal information in chat messages. All chat messages are deleted upon server restart.",
      },
      {
        heading: "8. Minors",
        body: "This Service is not directed at children under the age of 13, and we do not intentionally collect personal information from minors.",
      },
      {
        heading: "9. Security",
        body: "The Service uses HTTPS encrypted communication. However, no method of transmission over the internet or electronic storage is 100% secure.",
      },
      {
        heading: "10. Changes to This Policy",
        body: "This Privacy Policy may be updated in response to service changes or legal requirements. We will notify users of significant changes through this page.",
      },
      {
        heading: "11. Contact",
        body: "For questions about this Privacy Policy, please contact us at:\n\ncontact@kimchipremium.com",
      },
    ],
  },
  zh: {
    title: "隐私政策",
    lastUpdated: "最后更新：2025年3月",
    back: "返回",
    sections: [
      {
        heading: "1. 概述",
        body: "KimchiPremium（以下简称\"服务\"）是一项提供实时加密货币泡菜溢价信息的免费数据服务。本隐私政策说明在使用本服务过程中收集的信息及其处理方式。",
      },
      {
        heading: "2. 我们收集的信息",
        body: "本服务不直接收集个人身份信息。以下信息可能通过第三方工具自动收集，用于改善服务质量：\n\n• 访问页面、停留时间、点击路径等使用统计数据（Google Analytics）\n• 浏览器类型、操作系统、屏幕分辨率等设备信息\n• 大致访问国家/地区（基于IP，无法识别个人身份）\n• 广告展示和点击数据（Google AdSense）",
      },
      {
        heading: "3. Cookie及本地存储",
        body: "本服务出于以下目的使用Cookie和浏览器本地存储：\n\n• 存储语言偏好（ko/en/zh）\n• 保存聊天昵称\n• 通过Google Analytics收集使用统计数据\n• 通过Google AdSense提供个性化广告\n\n您可以在浏览器设置中禁用Cookie，但部分功能可能受到限制。",
      },
      {
        heading: "4. Google Analytics",
        body: "本服务使用Google LLC提供的网站分析服务Google Analytics。Google Analytics通过Cookie收集匿名化使用数据。收集的数据将传输至Google服务器，并依据Google隐私政策进行处理。\n\n如需停止Google Analytics数据收集，请安装Google Analytics退出浏览器插件或启用浏览器的\"请勿追踪\"功能。",
      },
      {
        heading: "5. Google AdSense",
        body: "本服务可能使用Google LLC提供的广告服务Google AdSense。Google AdSense使用Cookie根据用户兴趣展示个性化广告。您可以访问policies.google.com了解Google如何使用广告数据。\n\n如需停止个性化广告，请访问aboutads.info/choices或youronlinechoices.eu进行设置。",
      },
      {
        heading: "6. 外部API及数据",
        body: "本服务从以下外部来源获取价格数据：\n\n• Upbit API — 韩元价格\n• Bybit API — 美元价格\n• Coinbase API — 美元价格\n• exchangerate-api.com — 汇率数据\n• Alternative.me — 恐慌贪婪指数\n• CryptoCompare — 新闻\n\n此过程中不传输任何个人信息。",
      },
      {
        heading: "7. 聊天功能",
        body: "本服务的聊天功能在服务器内存中临时存储用户提供的昵称和消息。昵称存储在浏览器本地存储中。请避免在聊天消息中输入个人信息。服务器重启时所有聊天消息将被删除。",
      },
      {
        heading: "8. 未成年人",
        body: "本服务不面向13岁以下儿童，我们不会故意收集未成年人的个人信息。",
      },
      {
        heading: "9. 安全",
        body: "本服务使用HTTPS加密通信。但通过互联网传输或电子存储的方式无法保证100%安全。",
      },
      {
        heading: "10. 政策变更",
        body: "本隐私政策可能因服务变更或法律要求而更新。如有重大变更，我们将通过本页面通知用户。",
      },
      {
        heading: "11. 联系我们",
        body: "如对本隐私政策有任何疑问，请通过以下邮箱联系我们：\n\ncontact@kimchipremium.com",
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const titles = { ko: "개인정보 처리방침 | KimchiPremium", en: "Privacy Policy | KimchiPremium", zh: "隐私政策 | KimchiPremium" };
  return { title: titles[locale as keyof typeof titles] ?? titles.en };
}

export default async function PrivacyPage({ params }: { params: Promise<Params> }) {
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
  );
}
