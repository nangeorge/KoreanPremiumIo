import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-base)] px-6 text-center">
      <p className="text-6xl font-black text-[var(--fg)] mb-2">404</p>
      <h1 className="text-xl font-semibold text-white mb-1">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">Page not found</p>

      {/* 슬로건 */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-white/4 px-8 py-6 max-w-sm w-full">
        <p className="text-xs text-[var(--fg-muted)] uppercase tracking-widest mb-3">Our Identity</p>
        <p className="text-base font-semibold text-white leading-relaxed">
          The data is{" "}
          <span className="text-yellow-400">KimchiPremium</span>
          ,<br />
          the domain is{" "}
          <span className="text-emerald-400">KoreanPremium.io</span>
        </p>
      </div>

      <Link
        href="/ko"
        className="rounded-xl bg-[var(--fg)] px-6 py-2.5 text-sm font-semibold text-[var(--bg-base)] hover:opacity-90 transition-opacity"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
