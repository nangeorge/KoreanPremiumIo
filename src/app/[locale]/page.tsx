import { getTranslations } from "next-intl/server";
import { StatsBar } from "@/components/coins/StatsBar";
import { RSIBar } from "@/components/coins/RSIBar";
import { PremiumTable } from "@/components/coins/PremiumTable";
import { PremiumChart } from "@/components/charts/PremiumChart";
import { BTCChart } from "@/components/charts/BTCChart";
import { AlertBanner } from "@/components/coins/AlertBanner";
import { ExchangeCompare } from "@/components/coins/ExchangeCompare";

type Params = { locale: string };

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f0f1e] via-[#111128] to-[#0a0a18] border border-white/5 p-5 sm:p-8 md:p-12">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-red-500/6 blur-2xl" />
          {/* 김치 이모지 장식 */}
          <div className="absolute top-6 right-8 text-5xl opacity-10 select-none rotate-12">🌶️</div>
          <div className="absolute bottom-6 right-24 text-4xl opacity-8 select-none -rotate-6">🥬</div>
        </div>

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/8 px-3 py-1 text-xs text-orange-300">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-400" />
            🌶️ {t("liveUpdate")}
          </div>

          {/* Exchange comparison — 선택된 거래소 반영 */}
          <ExchangeCompare locale={locale} />
        </div>
      </section>

      {/* Stats */}
      <StatsBar />

      {/* BTC RSI (일/주/월봉) */}
      <RSIBar />

      {/* Chart + Table grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-5">
        {/* Table - wider */}
        <div className="xl:col-span-3">
          <PremiumTable />
        </div>

        {/* Charts */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <BTCChart />
          <PremiumChart />
          <AlertBanner />
        </div>
      </div>
    </div>
  );
}
