import { PremiumTable } from "@/components/coins/PremiumTable";
import { PremiumChart } from "@/components/charts/PremiumChart";
import { BTCChart } from "@/components/charts/BTCChart";
import { AlertBanner } from "@/components/coins/AlertBanner";
import { TVTickerTape } from "@/components/layout/TVTickerTape";
import { LiquidationFeed } from "@/components/coins/LiquidationFeed";
import { DashboardStrip } from "@/components/coins/DashboardStrip";
import { AdUnit } from "@/components/ads/AdUnit";

type Params = { locale: string };

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;

  return (
    <>
      <TVTickerTape />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 space-y-4">
        {/* 컴팩트 대시보드 — 핵심 지표 한눈에 */}
        <DashboardStrip />

        {/* 광고 — 상단 배너 */}
        <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ?? ""} format="horizontal" className="w-full" />

        {/* Chart + Table grid */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-5">
          {/* Table - wider */}
          <div className="xl:col-span-3">
            <PremiumTable />
          </div>

          {/* Charts */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <BTCChart />
            <PremiumChart />
            <LiquidationFeed locale={locale} />
            <AlertBanner />
          </div>
        </div>
      </div>
    </>
  );
}
