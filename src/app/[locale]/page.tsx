import { PremiumTable } from "@/components/coins/PremiumTable";
import { PremiumChart } from "@/components/charts/PremiumChart";
import { BTCChart } from "@/components/charts/BTCChart";
import { AlertBanner } from "@/components/coins/AlertBanner";
import { TVTickerTape } from "@/components/layout/TVTickerTape";
import { LiquidationFeed } from "@/components/coins/LiquidationFeed";
import { DashboardStrip } from "@/components/coins/DashboardStrip";

type Params = { locale: string };

export default async function HomePage({ params }: { params: Promise<Params> }) {
  await params;

  return (
    <>
      <TVTickerTape />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 space-y-4">
        {/* 컴팩트 대시보드 — 핵심 지표 한눈에 */}
        <DashboardStrip />

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
            <LiquidationFeed />
            <AlertBanner />
          </div>
        </div>
      </div>
    </>
  );
}
