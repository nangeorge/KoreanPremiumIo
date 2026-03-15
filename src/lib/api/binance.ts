// Bybit API — Binance 대체 (Vercel에서 Binance IP 차단 대응)
const BYBIT_API = "https://api.bybit.com/v5/market/tickers?category=spot";

export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
}

interface BybitTicker {
  symbol: string;
  lastPrice: string;
  price24hPcnt: string;
  volume24h: string;
  turnover24h: string;
}

interface BybitResponse {
  retCode: number;
  result: { list: BybitTicker[] };
}

let cache: { data: BinanceTicker[]; ts: number } | null = null;
const CACHE_MS = 5000;

export async function fetchBinancePrices(symbols: string[]): Promise<BinanceTicker[]> {
  const valid = symbols.filter(Boolean);
  if (valid.length === 0) return [];

  // 5초 캐시
  if (cache && Date.now() - cache.ts < CACHE_MS) {
    return cache.data.filter((t) => valid.includes(t.symbol));
  }

  try {
    const res = await fetch(BYBIT_API, { next: { revalidate: 5 } });
    if (!res.ok) return [];

    const json: BybitResponse = await res.json();
    if (json.retCode !== 0) return [];

    const all: BinanceTicker[] = json.result.list.map((t) => ({
      symbol: t.symbol,
      lastPrice: t.lastPrice,
      priceChangePercent: (parseFloat(t.price24hPcnt) * 100).toFixed(2),
      quoteVolume: t.turnover24h,
    }));

    cache = { data: all, ts: Date.now() };
    return all.filter((t) => valid.includes(t.symbol));
  } catch {
    return [];
  }
}
