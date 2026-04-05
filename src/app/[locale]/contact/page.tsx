import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Bug, Handshake } from "lucide-react";
import type { Metadata } from "next";

type Params = { locale: string };

const CONTENT = {
  ko: {
    title: "문의하기",
    back: "돌아가기",
    subtitle: "버그 제보, 기능 제안, 협업 문의 등 무엇이든 환영합니다.",
    email: "contact@kimchipremium.com",
    responseTime: "보통 1–2 영업일 내에 답변 드립니다.",
    topics: [
      { icon: "bug", title: "버그 제보", desc: "데이터 오류, 화면 깨짐, 기능 오작동 등" },
      { icon: "message", title: "기능 제안", desc: "추가되었으면 하는 코인, 지표, 기능 아이디어" },
      { icon: "handshake", title: "협업 / 광고 문의", desc: "제휴, 스폰서십, 광고 관련 비즈니스 문의" },
    ],
    emailLabel: "이메일 보내기",
  },
  en: {
    title: "Contact Us",
    back: "Back",
    subtitle: "Bug reports, feature requests, partnership inquiries — all welcome.",
    email: "contact@kimchipremium.com",
    responseTime: "We typically respond within 1–2 business days.",
    topics: [
      { icon: "bug", title: "Bug Reports", desc: "Data errors, display issues, or broken functionality" },
      { icon: "message", title: "Feature Requests", desc: "Coins, indicators, or features you'd like to see" },
      { icon: "handshake", title: "Business Inquiries", desc: "Partnerships, sponsorships, or advertising" },
    ],
    emailLabel: "Send an Email",
  },
  zh: {
    title: "联系我们",
    back: "返回",
    subtitle: "欢迎提交错误报告、功能建议或商务合作咨询。",
    email: "contact@kimchipremium.com",
    responseTime: "我们通常在1–2个工作日内回复。",
    topics: [
      { icon: "bug", title: "错误反馈", desc: "数据错误、显示问题或功能异常" },
      { icon: "message", title: "功能建议", desc: "您希望添加的币种、指标或功能" },
      { icon: "handshake", title: "商务合作", desc: "合作、赞助或广告相关咨询" },
    ],
    emailLabel: "发送邮件",
  },
};

const iconMap = { bug: Bug, message: MessageSquare, handshake: Handshake };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const titles = { ko: "문의하기 | KimchiPremium", en: "Contact | KimchiPremium", zh: "联系我们 | KimchiPremium" };
  return { title: titles[locale as keyof typeof titles] ?? titles.en };
}

export default async function ContactPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const c = CONTENT[locale as keyof typeof CONTENT] ?? CONTENT.en;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 space-y-6">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
      >
        <ArrowLeft size={14} />
        {c.back}
      </Link>

      {/* 헤더 */}
      <div className="glass rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">{c.title}</h1>
        <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{c.subtitle}</p>
      </div>

      {/* 문의 유형 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {c.topics.map((topic) => {
          const Icon = iconMap[topic.icon as keyof typeof iconMap];
          return (
            <div key={topic.icon} className="glass rounded-xl p-5 flex flex-col gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/8 flex items-center justify-center">
                <Icon size={16} className="text-[var(--fg)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">{topic.title}</div>
                <div className="text-xs text-[var(--fg-muted)] leading-relaxed">{topic.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 이메일 */}
      <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-white/8 flex items-center justify-center">
          <Mail size={22} className="text-[var(--fg)]" />
        </div>
        <div>
          <p className="text-xs text-[var(--fg-muted)] mb-1">{c.responseTime}</p>
          <a
            href={`mailto:${c.email}`}
            className="text-base font-semibold text-white hover:text-[var(--fg-secondary)] transition-colors"
          >
            {c.email}
          </a>
        </div>
        <a
          href={`mailto:${c.email}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium text-white transition-colors"
        >
          <Mail size={14} />
          {c.emailLabel}
        </a>
      </div>
    </div>
  );
}
