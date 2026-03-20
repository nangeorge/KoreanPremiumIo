import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface FearGreedData {
  value: number;
  valueText: string;
  timestamp: number;
  previousValue: number;
  previousValueText: string;
}

export interface GlobalMarketData {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
  activeCryptocurrencies: number;
}

export interface OnChainPoint {
  time: string; // "YYYY-MM-DD"
  value: number;
}

export interface FundingRatePoint {
  time: number; // unix ms
  value: number; // percentage
  symbol: string;
}

export interface VixData {
  value: number;
  change: number; // 1-day change
  history: OnChainPoint[]; // time-series for chart
}

export interface IndicatorsResponse {
  fearGreed: FearGreedData | null;
  vix: VixData | null;
  globalMarket: GlobalMarketData | null;
  mvrv: OnChainPoint[];
  hashRate: OnChainPoint[];
  activeAddresses: OnChainPoint[];
  txCount: OnChainPoint[];
  fundingRates: { btc: FundingRatePoint[]; eth: FundingRatePoint[] };
  updatedAt: number;
}

async function fetchCoinMetrics(metrics: string, days = 90): Promise<Record<string, OnChainPoint[]>> {
  // CoinMetrics community API limits: cap at 365 days
  const limitDays = Math.min(days, 365);
  const url = `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=btc&metrics=${metrics}&frequency=1d&limit_per_asset=${limitDays}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return {};

  const data = await res.json();
  const rows: Record<string, string>[] = data.data ?? [];

  const result: Record<string, OnChainPoint[]> = {};
  const metricKeys = metrics.split(",");

  for (const key of metricKeys) {
    result[key] = rows
      .filter((r) => r[key] != null)
      .map((r) => ({
        time: r.time.slice(0, 10), // "YYYY-MM-DD"
        value: parseFloat(r[key]),
      }));
  }
  return result;
}

async function fetchFundingRates(symbol: string, limit = 24): Promise<FundingRatePoint[]> {
  // symbol: BTCUSDT → BTC-USDT-SWAP (OKX perpetual)
  const okxSymbol = symbol.endsWith("USDT")
    ? symbol.slice(0, -4) + "-USDT-SWAP"
    : symbol;
  try {
    const res = await fetch(
      `https://www.okx.com/api/v5/public/funding-rate-history?instId=${okxSymbol}&limit=${limit}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    if (json.code !== "0") return [];
    return json.data.map((r: { fundingRate: string; fundingTime: string }) => ({
      time: parseInt(r.fundingTime),
      value: parseFloat(r.fundingRate) * 100,
      symbol,
    }));
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(1, parseInt(searchParams.get("days") ?? "90") || 90), 365);

  try {
    const vixRange = days <= 30 ? "1mo" : days <= 90 ? "3mo" : days <= 180 ? "6mo" : "1y";
    const [fngRes, globalRes, onChainData, btcFunding, ethFunding, vixHistRes, vixQuoteRes] = await Promise.allSettled([
      fetch("https://api.alternative.me/fng/?limit=2", { next: { revalidate: 600 } }),
      fetch("https://api.coingecko.com/api/v3/global", { next: { revalidate: 300 } }),
      fetchCoinMetrics("CapMVRVCur,HashRate,AdrActCnt,TxCnt", days),
      fetchFundingRates("BTCUSDT", 24),
      fetchFundingRates("ETHUSDT", 24),
      // 히스토리용 (일봉)
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=${vixRange}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 1800 },
      }),
      // 실시간 현재값용 (quote API)
      fetch("https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EVIX", {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 },
      }),
    ]);

    // Fear & Greed
    let fearGreed: FearGreedData | null = null;
    if (fngRes.status === "fulfilled" && fngRes.value.ok) {
      const data = await fngRes.value.json();
      const current = data.data?.[0];
      const previous = data.data?.[1];
      if (current) {
        fearGreed = {
          value: parseInt(current.value),
          valueText: current.value_classification,
          timestamp: parseInt(current.timestamp) * 1000,
          previousValue: previous ? parseInt(previous.value) : 0,
          previousValueText: previous?.value_classification ?? "",
        };
      }
    }

    // Global Market
    let globalMarket: GlobalMarketData | null = null;
    if (globalRes.status === "fulfilled" && globalRes.value.ok) {
      const data = await globalRes.value.json();
      const d = data.data;
      globalMarket = {
        totalMarketCap: d.total_market_cap?.usd ?? 0,
        totalVolume24h: d.total_volume?.usd ?? 0,
        btcDominance: d.market_cap_percentage?.btc ?? 0,
        ethDominance: d.market_cap_percentage?.eth ?? 0,
        marketCapChange24h: d.market_cap_change_percentage_24h_usd ?? 0,
        activeCryptocurrencies: d.active_cryptocurrencies ?? 0,
      };
    }

    // On-chain
    const onChain = onChainData.status === "fulfilled" ? onChainData.value : {};
    const mvrv = onChain["CapMVRVCur"] ?? [];
    const hashRate = (onChain["HashRate"] ?? []).map((p) => ({
      ...p,
      value: p.value / 1e9, // EH/s
    }));
    const activeAddresses = onChain["AdrActCnt"] ?? [];
    const txCount = onChain["TxCnt"] ?? [];

    // VIX
    let vix: VixData | null = null;
    try {
      // 히스토리 파싱
      let history: OnChainPoint[] = [];
      if (vixHistRes.status === "fulfilled" && vixHistRes.value.ok) {
        const vixData = await vixHistRes.value.json();
        const result = vixData.chart?.result?.[0];
        const timestamps: number[] = result?.timestamp ?? [];
        const closes: number[] = result?.indicators?.quote?.[0]?.close ?? [];
        history = timestamps
          .map((t: number, i: number) => ({ t, v: closes[i] }))
          .filter((p) => p.v != null)
          .map((p) => ({
            time: new Date(p.t * 1000).toISOString().slice(0, 10),
            value: parseFloat(p.v.toFixed(2)),
          }));
      }

      // 실시간 현재값 파싱 (quote API)
      let currentValue: number | null = null;
      if (vixQuoteRes.status === "fulfilled" && vixQuoteRes.value.ok) {
        const quoteData = await vixQuoteRes.value.json();
        const q = quoteData.quoteResponse?.result?.[0];
        if (q?.regularMarketPrice != null) {
          currentValue = parseFloat(q.regularMarketPrice.toFixed(2));
        }
      }

      // 현재값이 있으면 실시간값 우선, 없으면 히스토리 마지막값
      const latestValue = currentValue ?? history[history.length - 1]?.value ?? null;
      const prevValue = history[history.length - 2]?.value ?? history[history.length - 1]?.value ?? null;

      if (latestValue !== null) {
        vix = {
          value: latestValue,
          change: prevValue !== null ? parseFloat((latestValue - prevValue).toFixed(2)) : 0,
          history,
        };
      }
    } catch { /* ignore */ }

    // Funding rates
    const btcFundingData = btcFunding.status === "fulfilled" ? btcFunding.value : [];
    const ethFundingData = ethFunding.status === "fulfilled" ? ethFunding.value : [];

    return NextResponse.json({
      fearGreed,
      vix,
      globalMarket,
      mvrv,
      hashRate,
      activeAddresses,
      txCount,
      fundingRates: { btc: btcFundingData, eth: ethFundingData },
      updatedAt: Date.now(),
    } satisfies IndicatorsResponse);
  } catch (error) {
    console.error("Indicators API error:", error);
    return NextResponse.json({
      fearGreed: null, vix: null, globalMarket: null,
      mvrv: [], hashRate: [], activeAddresses: [], txCount: [],
      fundingRates: { btc: [], eth: [] },
      updatedAt: Date.now(),
    });
  }
}
