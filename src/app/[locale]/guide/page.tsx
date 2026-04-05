import Link from "next/link";
import { GUIDES } from "@/lib/guideContent";

type Params = { locale: string };

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";

  const title = isKo ? "비트코인 가이드" : isZh ? "比特币指南" : "Bitcoin Guide";
  const subtitle = isKo
    ? "셀프 커스터디부터 라이트닝까지 — 비트코인을 직접 운영하는 법을 배웁니다"
    : isZh
    ? "从自托管到闪电网络 — 学习如何自主使用比特币"
    : "From self-custody to Lightning — learn to use Bitcoin on your own terms";
  const creditLabel = isKo
    ? "콘텐츠 출처: 필레몬 (CC0 라이선스 — 자유롭게 복제·배포 가능)"
    : isZh
    ? "内容来源: 필레몬 (CC0许可证 — 可自由复制和分发)"
    : "Content source: 필레몬 (CC0 License — freely copyable and distributable)";

  const difficultyLabel = (d: string, dEn: string) =>
    isKo ? d : isZh ? d : dEn;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--fg)] mb-2">{title}</h1>
        <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{subtitle}</p>
        <p className="mt-3 text-[11px] text-[var(--fg-muted)]">{creditLabel}</p>
      </div>

      {/* 가이드 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GUIDES.map((guide) => (
          <Link key={guide.slug} href={`/${locale}/guide/${guide.slug}`} className="group block">
            <div className="glass rounded-xl p-5 h-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <div className="flex items-start gap-3">
                <span className="text-3xl leading-none mt-0.5">{guide.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      guide.difficulty === "입문" ? "text-emerald-400 bg-emerald-400/10" :
                      guide.difficulty === "초급" ? "text-blue-400 bg-blue-400/10" :
                      guide.difficulty === "중급" ? "text-orange-400 bg-orange-400/10" :
                      "text-red-400 bg-red-400/10"
                    }`}>
                      {difficultyLabel(guide.difficulty, guide.difficultyEn)}
                    </span>
                    <span className="text-[10px] text-[var(--fg-muted)]">
                      {isKo ? `읽기 ${guide.timeRead}` : `${guide.timeRead} read`}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-[var(--fg)] group-hover:text-white transition-colors leading-snug mb-1">
                    {isKo || isZh ? guide.title : guide.titleEn}
                  </h2>
                  <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed line-clamp-2">
                    {isKo || isZh ? guide.subtitle : guide.subtitleEn}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-orange-400/70 group-hover:text-orange-400 transition-colors">
                <span>{isKo ? "학습 시작 →" : isZh ? "开始学习 →" : "Start learning →"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 하단 설명 */}
      <div className="mt-8 glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--fg)] mb-3">
          {isKo ? "📚 이 가이드에 대해" : isZh ? "📚 关于这些指南" : "📚 About These Guides"}
        </h3>
        <p className="text-[12px] text-[var(--fg-secondary)] leading-relaxed">
          {isKo
            ? "이 가이드들은 필레몬이 작성한 7권의 비트코인 가이드 시리즈를 바탕으로 핵심 내용을 재구성한 교육 자료입니다. 원본 가이드는 CC0 라이선스로 공개되어 있어 자유롭게 복제하고 활용할 수 있습니다. 각 페이지 하단에서 원본 PDF를 다운로드할 수 있습니다."
            : isZh
            ? "这些指南是基于필레몬编写的7册比特币指南系列重新整理的教育材料。原始指南以CC0许可证发布，可以自由复制和使用。您可以在每个页面底部下载原始PDF。"
            : "These guides are educational materials reconstructed from 필레몬's 7-volume Bitcoin guide series. The original guides are published under the CC0 license — free to copy and use. Original PDFs are available for download at the bottom of each page."}
        </p>
      </div>
    </div>
  );
}
