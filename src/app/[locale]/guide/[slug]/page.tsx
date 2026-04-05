import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckSquare, Download } from "lucide-react";
import { getGuide, GUIDE_SLUGS } from "@/lib/guideContent";
import { GuideTOC } from "@/components/guide/GuideTOC";
import { cn } from "@/lib/utils";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export default async function GuideDetailPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const isKo = locale === "ko";
  const isZh = locale === "zh";

  const t = (ko: string, en: string, zh?: string) => {
    if (isZh) return zh ?? en;
    if (isKo) return ko;
    return en;
  };

  const title = isKo || isZh ? guide.title : guide.titleEn;
  const subtitle = isKo || isZh ? guide.subtitle : guide.subtitleEn;
  const summary = isKo || isZh ? guide.summary : guide.summaryEn;

  const difficultyColor =
    guide.difficulty === "입문" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
    guide.difficulty === "초급" ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
    guide.difficulty === "중급" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
    "text-red-400 bg-red-400/10 border-red-400/20";

  // TOC 아이템 구성
  const tocItems = [
    { id: "toc-why",       label: t("왜 중요한가?", "Why This Matters?", "为什么重要？") },
    { id: "toc-concepts",  label: t("핵심 개념", "Key Concepts", "核心概念") },
    ...guide.sections.map((s, i) => ({
      id: `toc-section-${i}`,
      label: isKo || isZh ? s.title : s.titleEn,
    })),
    { id: "toc-checklist", label: t("학습 체크리스트", "Checklist", "学习检查清单") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
      {/* 뒤로가기 */}
      <Link
        href={`/${locale}/guide`}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] mb-5 transition-colors"
      >
        <ArrowLeft size={13} />
        {t("가이드 목록", "Back to Guides", "返回指南")}
      </Link>

      {/* 2컬럼 레이아웃: TOC + 본문 */}
      <div className="flex gap-8 items-start">
        {/* 왼쪽 TOC (xl 이상에서만 표시) */}
        <GuideTOC items={tocItems} />

        {/* 본문 */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {/* 타이틀 섹션 */}
          <div className="glass rounded-xl p-5 sm:p-6 mb-5">
            <div className="flex items-start gap-4">
              <span className="text-4xl leading-none mt-1">{guide.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded border", difficultyColor)}>
                    {t(guide.difficulty, guide.difficultyEn)}
                  </span>
                  <span className="text-[11px] text-[var(--fg-muted)]">
                    {t(`읽기 ${guide.timeRead}`, `${guide.timeRead} read`, `阅读 ${guide.timeRead}`)}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-[var(--fg)] leading-snug mb-1">{title}</h1>
                <p className="text-sm text-[var(--fg-muted)]">{subtitle}</p>
              </div>
            </div>

            {/* 요약 */}
            <div className="mt-5 p-4 rounded-lg bg-orange-500/5 border border-orange-500/15">
              <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{summary}</p>
            </div>
          </div>

          {/* 왜 중요한가 */}
          <div id="toc-why" className="glass rounded-xl p-5 sm:p-6 mb-5 scroll-mt-32">
            <h2 className="text-base font-semibold text-[var(--fg)] mb-4">
              {t("왜 중요한가?", "Why Does This Matter?", "为什么重要？")}
            </h2>
            <ul className="space-y-3">
              {(isKo || isZh ? guide.whyMatters : guide.whyMattersEn).map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-orange-400/20 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-orange-400">{i + 1}</span>
                  </span>
                  <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* 핵심 개념 카드 */}
          <div id="toc-concepts" className="glass rounded-xl p-5 sm:p-6 mb-5 scroll-mt-32">
            <h2 className="text-base font-semibold text-[var(--fg)] mb-4">
              {t("핵심 개념", "Key Concepts", "核心概念")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guide.concepts.map((concept, i) => (
                <div key={i} className="rounded-lg border border-[var(--border-color)] p-3.5 bg-white/2">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-xs font-bold text-orange-300">
                      {isKo || isZh ? concept.term : concept.termEn}
                    </span>
                    {isKo && (
                      <span className="text-[10px] text-[var(--fg-muted)]">{concept.termEn}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">
                    {isKo || isZh ? concept.desc : concept.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 본문 섹션들 */}
          {guide.sections.map((section, si) => (
            <div key={si} id={`toc-section-${si}`} className="glass rounded-xl p-5 sm:p-6 mb-5 scroll-mt-32">
              <h2 className="text-base font-semibold text-[var(--fg)] mb-4">
                {isKo || isZh ? section.title : section.titleEn}
              </h2>
              <ul className="space-y-2.5">
                {(isKo || isZh ? section.points : section.pointsEn).map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400/50" />
                    <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 체크리스트 */}
          <div id="toc-checklist" className="glass rounded-xl p-5 sm:p-6 mb-5 scroll-mt-32">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare size={16} className="text-emerald-400" />
              <h2 className="text-base font-semibold text-[var(--fg)]">
                {t("학습 체크리스트", "Learning Checklist", "学习检查清单")}
              </h2>
            </div>
            <ul className="space-y-2">
              {guide.checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border border-[var(--border-color)] bg-white/3" />
                  <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                    {isKo || isZh ? item.label : item.labelEn}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF 다운로드 + 네비게이션 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {guide.pdfFile && (
              <a
                href={guide.pdfFile}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/5 border border-[var(--border-color)] text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/8 transition-colors"
              >
                <Download size={13} />
                {guide.pdfLabel ?? t("원본 PDF 다운로드", "Download original PDF", "下载原版PDF")}
              </a>
            )}
            <Link
              href={`/${locale}/guide`}
              className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            >
              ← {t("다른 가이드 보기", "View other guides", "查看其他指南")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
