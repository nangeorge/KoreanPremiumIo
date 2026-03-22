import { StatsBar } from "@/components/coins/StatsBar";
import { RSIBar } from "@/components/coins/RSIBar";
import { PremiumTable } from "@/components/coins/PremiumTable";
import { PremiumChart } from "@/components/charts/PremiumChart";
import { BTCChart } from "@/components/charts/BTCChart";
import { AlertBanner } from "@/components/coins/AlertBanner";
import { TVTickerTape } from "@/components/layout/TVTickerTape";
import { LiquidationFeed } from "@/components/coins/LiquidationFeed";
import { HeroSection } from "@/components/coins/HeroSection";

type Params = { locale: string };

export default async function HomePage({ params }: { params: Promise<Params> }) {
  await params;

  return (
    <>
      <TVTickerTape />
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* Hero */}
      <HeroSection />

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
          <LiquidationFeed />
          <AlertBanner />
        </div>
      </div>
    </div>
    </>
  );
}
