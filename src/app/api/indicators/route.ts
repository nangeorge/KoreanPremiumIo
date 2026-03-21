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

export interface RSIData {
  daily: number | null;
  weekly: number | null;
  monthly: number | null;
}

export interface OpenInterestData {
  oiCcy: number;  // base currency (BTC or ETH)
  oiUsd: number;  // USD value
}

export interface LongShortData {
  longRatio: number;  // 0~1
  shortRatio: number; // 0~1
}

export interface StablecoinData {
  total: number;
  usdt: number;
  usdc: number;
  change24h: number; // percentage
}

export interface DefiTvlData {
  total: number;       // current TVL in USD
  change24h: number;   // % change
  history: OnChainPoint[];  // time-series (reuse existing type)
}

export interface MempoolData {
  fastestFee: number;  // sat/vB (next block)
  halfHourFee: number; // sat/vB (~30 min)
  hourFee: number;     // sat/vB (~1 hour)
  minimumFee: number;  // sat/vB
  count: number;       // unconfirmed tx count
  vsize: number;       // mempool size in vbytes
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;       // small image url
  priceChangePercent: number | null; // 24h change if available
  rank: number;        // market cap rank
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
  rsi: RSIData | null;
  openInterest: { btc: OpenInterestData | null; eth: OpenInterestData | null } | null;
  longShort: { btc: LongShortData | null; eth: LongShortData | null } | null;
  stablecoin: StablecoinData | null;
  defiTvl: DefiTvlData | null;
  mempool: MempoolData | null;
  trending: TrendingCoin[];
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

// ── RSI ──────────────────────────────────────────────────────────
function calcRSI(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses += -diff;
  }
  let avgGain = gains / period, avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(0, diff)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(0, -diff)) / period;
  }
  if (avgLoss === 0) return 100;
  return parseFloat((100 - 100 / (1 + avgGain / avgLoss)).toFixed(2));
}

async function fetchRsiCloses(bar: string, limit = 100): Promise<number[]> {
  try {
    const res = await fetch(
      `https://www.okx.com/api/v5/market/candles?instId=BTC-USDT&bar=${bar}&limit=${limit}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    if (json.code !== "0" || !Array.isArray(json.data)) return [];
    return json.data.reverse().map((k: string[]) => parseFloat(k[4]));
  } catch { return []; }
}

// ── Open Interest ─────────────────────────────────────────────────
async function fetchOpenInterest(instId: string): Promise<OpenInterestData | null> {
  try {
    const [oiRes, priceRes] = await Promise.all([
      fetch(`https://www.okx.com/api/v5/public/open-interest?instType=SWAP&instId=${instId}`, { next: { revalidate: 60 } }),
      fetch(`https://www.okx.com/api/v5/public/mark-price?instType=SWAP&instId=${instId}`, { next: { revalidate: 60 } }),
    ]);
    if (!oiRes.ok || !priceRes.ok) return null;
    const [oiJson, priceJson] = await Promise.all([oiRes.json(), priceRes.json()]);
    if (oiJson.code !== "0" || priceJson.code !== "0") return null;
    const oiCcy = parseFloat(oiJson.data?.[0]?.oiCcy ?? "0");
    const markPx = parseFloat(priceJson.data?.[0]?.markPx ?? "0");
    if (!oiCcy || !markPx) return null;
    return { oiCcy, oiUsd: oiCcy * markPx };
  } catch { return null; }
}

// ── Long/Short Ratio ──────────────────────────────────────────────
async function fetchLongShort(instId: string): Promise<LongShortData | null> {
  try {
    const res = await fetch(
      `https://www.okx.com/api/v5/rubik/stat/contracts/long-short-account-ratio?instId=${instId}&period=5m&limit=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code !== "0" || !json.data?.[0]) return null;
    const longRatio = parseFloat(json.data[0][1]);
    if (isNaN(longRatio)) return null;
    return { longRatio, shortRatio: parseFloat((1 - longRatio).toFixed(4)) };
  } catch { return null; }
}

// ── Stablecoin Supply ─────────────────────────────────────────────
async function fetchStablecoinSupply(): Promise<StablecoinData | null> {
  try {
    const res = await fetch("https://stablecoins.llama.fi/stablecoins", { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    const coins: Array<{
      symbol: string;
      circulating?: { peggedUSD?: number };
      circulatingPrevDay?: { peggedUSD?: number };
    }> = json.peggedAssets ?? [];
    let total = 0, totalPrev = 0, usdt = 0, usdc = 0;
    for (const c of coins) {
      const cur = c.circulating?.peggedUSD ?? 0;
      const prev = c.circulatingPrevDay?.peggedUSD ?? cur;
      total += cur;
      totalPrev += prev;
      if (c.symbol === "USDT") usdt = cur;
      if (c.symbol === "USDC") usdc = cur;
    }
    const change24h = totalPrev > 0 ? parseFloat((((total - totalPrev) / totalPrev) * 100).toFixed(3)) : 0;
    return { total, usdt, usdc, change24h };
  } catch { return null; }
}

async function fetchDefiTvl(): Promise<DefiTvlData | null> {
  try {
    const res = await fetch("https://api.llama.fi/v2/historicalChainTvl", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: Array<{ date: number; tvl: number }> = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const recent = data.slice(-2);
    const current = recent[recent.length - 1]?.tvl ?? 0;
    const prev = recent[recent.length - 2]?.tvl ?? current;
    const change24h = prev > 0 ? parseFloat((((current - prev) / prev) * 100).toFixed(2)) : 0;
    // Return last 90 days of history
    const history: OnChainPoint[] = data.slice(-90).map((d) => ({
      time: new Date(d.date * 1000).toISOString().slice(0, 10),
      value: parseFloat((d.tvl / 1e9).toFixed(2)), // billions
    }));
    return { total: current, change24h, history };
  } catch { return null; }
}

async function fetchMempoolFees(): Promise<MempoolData | null> {
  try {
    const [feesRes, mempoolRes] = await Promise.all([
      fetch("https://mempool.space/api/v1/fees/recommended", { next: { revalidate: 60 } }),
      fetch("https://mempool.space/api/mempool", { next: { revalidate: 60 } }),
    ]);
    if (!feesRes.ok || !mempoolRes.ok) return null;
    const [fees, mempool] = await Promise.all([feesRes.json(), mempoolRes.json()]);
    return {
      fastestFee: fees.fastestFee ?? 0,
      halfHourFee: fees.halfHourFee ?? 0,
      hourFee: fees.hourFee ?? 0,
      minimumFee: fees.minimumFee ?? 1,
      count: mempool.count ?? 0,
      vsize: mempool.vsize ?? 0,
    };
  } catch { return null; }
}

async function fetchTrending(): Promise<TrendingCoin[]> {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/search/trending", {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.coins ?? []).slice(0, 7).map((c: {
      item: {
        id: string; name: string; symbol: string; thumb: string;
        market_cap_rank: number;
        data?: { price_change_percentage_24h?: { usd?: number } };
      }
    }) => ({
      id: c.item.id,
      name: c.item.name,
      symbol: c.item.symbol,
      thumb: c.item.thumb,
      priceChangePercent: c.item.data?.price_change_percentage_24h?.usd ?? null,
      rank: c.item.market_cap_rank ?? 0,
    }));
  } catch { return []; }
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
    const [
      fngRes, globalRes, onChainData, btcFunding, ethFunding, vixHistRes, vixQuoteRes,
      rsiDailyCloses, rsiWeeklyCloses, rsiMonthlyCloses,
      btcOI, ethOI, btcLS, ethLS, stablecoinRes,
      defiTvlRes, mempoolRes, trendingRes,
    ] = await Promise.allSettled([
      fetch("https://api.alternative.me/fng/?limit=2", { next: { revalidate: 600 } }),
      fetch("https://api.coingecko.com/api/v3/global", { next: { revalidate: 300 } }),
      fetchCoinMetrics("CapMVRVCur,HashRate,AdrActCnt,TxCnt", days),
      fetchFundingRates("BTCUSDT", 24),
      fetchFundingRates("ETHUSDT", 24),
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=${vixRange}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 1800 },
      }),
      fetch("https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EVIX", {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 },
      }),
      fetchRsiCloses("1D", 100),
      fetchRsiCloses("1W", 100),
      fetchRsiCloses("1M", 50),
      fetchOpenInterest("BTC-USDT-SWAP"),
      fetchOpenInterest("ETH-USDT-SWAP"),
      fetchLongShort("BTC-USDT-SWAP"),
      fetchLongShort("ETH-USDT-SWAP"),
      fetchStablecoinSupply(),
      fetchDefiTvl(),
      fetchMempoolFees(),
      fetchTrending(),
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

    // RSI
    const rsi: RSIData = {
      daily:   calcRSI(rsiDailyCloses.status   === "fulfilled" ? rsiDailyCloses.value   : []),
      weekly:  calcRSI(rsiWeeklyCloses.status  === "fulfilled" ? rsiWeeklyCloses.value  : []),
      monthly: calcRSI(rsiMonthlyCloses.status === "fulfilled" ? rsiMonthlyCloses.value : []),
    };

    // Open Interest
    const openInterest = {
      btc: btcOI.status === "fulfilled" ? btcOI.value : null,
      eth: ethOI.status === "fulfilled" ? ethOI.value : null,
    };

    // Long/Short
    const longShort = {
      btc: btcLS.status === "fulfilled" ? btcLS.value : null,
      eth: ethLS.status === "fulfilled" ? ethLS.value : null,
    };

    // Stablecoin
    const stablecoin = stablecoinRes.status === "fulfilled" ? stablecoinRes.value : null;

    return NextResponse.json({
      fearGreed,
      vix,
      globalMarket,
      mvrv,
      hashRate,
      activeAddresses,
      txCount,
      fundingRates: { btc: btcFundingData, eth: ethFundingData },
      rsi,
      openInterest,
      longShort,
      stablecoin,
      defiTvl: defiTvlRes.status === "fulfilled" ? defiTvlRes.value : null,
      mempool: mempoolRes.status === "fulfilled" ? mempoolRes.value : null,
      trending: trendingRes.status === "fulfilled" ? trendingRes.value : [],
      updatedAt: Date.now(),
    } satisfies IndicatorsResponse);
  } catch (error) {
    console.error("Indicators API error:", error);
    return NextResponse.json({
      fearGreed: null, vix: null, globalMarket: null,
      mvrv: [], hashRate: [], activeAddresses: [], txCount: [],
      fundingRates: { btc: [], eth: [] },
      rsi: null, openInterest: null, longShort: null, stablecoin: null,
      defiTvl: null, mempool: null, trending: [],
      updatedAt: Date.now(),
    });
  }
}
