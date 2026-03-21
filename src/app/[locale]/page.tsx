import { StatsBar } from "@/components/coins/StatsBar";
import { RSIBar } from "@/components/coins/RSIBar";
import { PremiumTable } from "@/components/coins/PremiumTable";
import { PremiumChart } from "@/components/charts/PremiumChart";
import { BTCChart } from "@/components/charts/BTCChart";
import { AlertBanner } from "@/components/coins/AlertBanner";
import { MarketPulse } from "@/components/coins/MarketPulse";
import { TrendingBanner } from "@/components/coins/TrendingBanner";
import { TVTickerTape } from "@/components/layout/TVTickerTape";

type Params = { locale: string };

export default async function HomePage({ params }: { params: Promise<Params> }) {
  await params;

  return (
    <>
      <TVTickerTape />
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* 트렌딩 배너 */}
      <TrendingBanner />

      {/* 시장 상태 펄스 */}
      <MarketPulse />

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
    </>
  );
}
