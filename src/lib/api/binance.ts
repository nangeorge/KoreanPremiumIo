// OKX API — Binance/Bybit 대체 (Vercel에서 IP 차단 대응)
const OKX_API = "https://www.okx.com/api/v5/market/tickers?instType=SPOT";

export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
}

interface OkxTicker {
  instId: string;
  last: string;
  open24h: string;
  volCcy24h: string;
}

interface OkxResponse {
  code: string;
  data: OkxTicker[];
}

let cache: { data: Map<string, BinanceTicker>; ts: number } | null = null;
const CACHE_MS = 5000;

// BTCUSDT → BTC-USDT 변환
function toOkxSymbol(symbol: string): string {
  if (symbol.endsWith("USDT")) return symbol.slice(0, -4) + "-USDT";
  return symbol;
}

export async function fetchBinancePrices(symbols: string[]): Promise<BinanceTicker[]> {
  const valid = symbols.filter(Boolean);
  if (valid.length === 0) return [];

  // 5초 캐시
  if (cache && Date.now() - cache.ts < CACHE_MS) {
    return valid.flatMap((s) => {
      const t = cache!.data.get(s);
      return t ? [t] : [];
    });
  }

  try {
    const res = await fetch(OKX_API, { next: { revalidate: 5 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];

    const json: OkxResponse = await res.json();
    if (json.code !== "0") return [];

    const map = new Map<string, BinanceTicker>();
    for (const t of json.data) {
      // BTC-USDT → BTCUSDT 역변환해서 map에 저장
      const binanceSymbol = t.instId.replace("-", "");
      const open = parseFloat(t.open24h);
      const last = parseFloat(t.last);
      const changePct = open > 0 ? ((last - open) / open) * 100 : 0;
      map.set(binanceSymbol, {
        symbol: binanceSymbol,
        lastPrice: t.last,
        priceChangePercent: changePct.toFixed(2),
        quoteVolume: t.volCcy24h,
      });
    }

    cache = { data: map, ts: Date.now() };
    return valid.flatMap((s) => {
      const t = map.get(s);
      return t ? [t] : [];
    });
  } catch {
    return [];
  }
}
