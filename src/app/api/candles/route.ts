import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface OHLCCandle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

type Interval = "1h" | "4h" | "1d" | "1w";
type BtcExchange = "upbit" | "binance" | "coinbase";

const UPBIT_UNIT: Record<Interval, string> = {
  "1h":  "minutes/60",
  "4h":  "minutes/240",
  "1d":  "days",
  "1w":  "weeks",
};

const OKX_INTERVAL: Record<Interval, string> = {
  "1h":  "1H",
  "4h":  "4H",
  "1d":  "1D",
  "1w":  "1W",
};

// Coinbase Exchange supports: 60, 300, 900, 3600, 21600, 86400 seconds
const COINBASE_GRANULARITY: Record<Interval, number> = {
  "1h":  3600,
  "4h":  21600, // closest supported is 6H
  "1d":  86400,
  "1w":  86400, // fetch daily then aggregate weekly
};

async function fetchUpbitOHLC(market: string, interval: Interval, count = 200): Promise<OHLCCandle[]> {
  const unit = UPBIT_UNIT[interval];
  const url = `https://api.upbit.com/v1/candles/${unit}?market=${market}&count=${count}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data
    .map((c: {
      candle_date_time_utc: string;
      opening_price: number;
      high_price: number;
      low_price: number;
      trade_price: number;
    }) => ({
      time: Math.floor(new Date(c.candle_date_time_utc).getTime() / 1000),
      open:  c.opening_price,
      high:  c.high_price,
      low:   c.low_price,
      close: c.trade_price,
    }))
    .sort((a, b) => a.time - b.time);
}

async function fetchOkxOHLC(symbol: string, interval: Interval, limit = 200): Promise<OHLCCandle[]> {
  // BTCUSDT → BTC-USDT
  const instId = symbol.endsWith("USDT") ? symbol.slice(0, -4) + "-USDT" : symbol;
  const iv = OKX_INTERVAL[interval];
  const url = `https://www.okx.com/api/v5/market/candles?instId=${instId}&bar=${iv}&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const json = await res.json();
  if (json.code !== "0" || !Array.isArray(json.data)) return [];

  // OKX returns [ts, open, high, low, close, vol, volCcy, volCcyQuote, confirm] newest first
  return json.data
    .map((k: string[]) => ({
      time:  Math.floor(parseInt(k[0]) / 1000),
      open:  parseFloat(k[1]),
      high:  parseFloat(k[2]),
      low:   parseFloat(k[3]),
      close: parseFloat(k[4]),
    }))
    .sort((a: OHLCCandle, b: OHLCCandle) => a.time - b.time);
}

async function fetchCoinbaseOHLC(product: string, interval: Interval, limit = 200): Promise<OHLCCandle[]> {
  const granularity = COINBASE_GRANULARITY[interval];
  // For 1W: fetch enough daily candles to cover ~limit weeks
  const fetchLimit = interval === "1w" ? Math.min(limit * 7, 300) : Math.min(limit, 300);
  const url = `https://api.exchange.coinbase.com/products/${product}/candles?granularity=${granularity}&limit=${fetchLimit}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  // Coinbase returns [time, low, high, open, close, volume] sorted descending
  const candles: OHLCCandle[] = data
    .map((k: number[]) => ({
      time:  k[0],
      low:   k[1],
      high:  k[2],
      open:  k[3],
      close: k[4],
    }))
    .sort((a: OHLCCandle, b: OHLCCandle) => a.time - b.time);

  if (interval !== "1w") return candles;

  // Aggregate daily → weekly (week starts Monday)
  const weekMap = new Map<number, OHLCCandle>();
  for (const c of candles) {
    const d = new Date(c.time * 1000);
    const day = d.getUTCDay(); // 0=Sun
    const diff = (day === 0 ? -6 : 1 - day); // offset to Monday
    d.setUTCDate(d.getUTCDate() + diff);
    d.setUTCHours(0, 0, 0, 0);
    const weekTs = Math.floor(d.getTime() / 1000);
    const existing = weekMap.get(weekTs);
    if (!existing) {
      weekMap.set(weekTs, { ...c, time: weekTs });
    } else {
      existing.high  = Math.max(existing.high, c.high);
      existing.low   = Math.min(existing.low,  c.low);
      existing.close = c.close; // last candle in week = close
    }
  }
  return Array.from(weekMap.values()).sort((a, b) => a.time - b.time);
}

function calcPremiumOHLC(
  upbit: OHLCCandle[],
  binance: OHLCCandle[],
  usdToKrw: number
): OHLCCandle[] {
  const binanceMap = new Map(binance.map((c) => [c.time, c]));

  return upbit
    .map((uc) => {
      // find closest binance candle within 5 minutes
      let bc = binanceMap.get(uc.time);
      if (!bc) {
        for (const [t, c] of binanceMap) {
          if (Math.abs(t - uc.time) <= 300) { bc = c; break; }
        }
      }
      if (!bc) return null;

      const pct = (v: number, b: number) =>
        parseFloat(((v / (b * usdToKrw) - 1) * 100).toFixed(3));

      return {
        time:  uc.time,
        open:  pct(uc.open,  bc.open),
        high:  pct(uc.high,  bc.low),   // worst-case premium for high
        low:   pct(uc.low,   bc.high),  // worst-case premium for low
        close: pct(uc.close, bc.close),
      };
    })
    .filter((c): c is OHLCCandle => c !== null);
}

const VALID_INTERVALS = new Set<Interval>(["1h", "4h", "1d", "1w"]);
const VALID_EXCHANGES = new Set<BtcExchange>(["upbit", "binance", "coinbase"]);
const VALID_TYPES = new Set(["premium", "btc"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const intervalParam = searchParams.get("interval") ?? "1h";
  const interval: Interval = VALID_INTERVALS.has(intervalParam as Interval) ? (intervalParam as Interval) : "1h";
  const typeParam = searchParams.get("type") ?? "premium";
  const type = VALID_TYPES.has(typeParam) ? typeParam : "premium";
  const exchangeParam = searchParams.get("exchange") ?? "upbit";
  const exchange: BtcExchange = VALID_EXCHANGES.has(exchangeParam as BtcExchange) ? (exchangeParam as BtcExchange) : "upbit";

  try {
    if (type === "btc") {
      let candles: OHLCCandle[] = [];
      if (exchange === "binance") {
        candles = await fetchOkxOHLC("BTCUSDT", interval);
      } else if (exchange === "coinbase") {
        candles = await fetchCoinbaseOHLC("BTC-USD", interval);
      } else {
        candles = await fetchUpbitOHLC("KRW-BTC", interval);
      }
      return NextResponse.json({ candles, exchange }, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
      });
    }

    // premium OHLC — always needs upbit + reference exchange
    const [upbitBTC, bybitBTC, fxRes] = await Promise.all([
      fetchUpbitOHLC("KRW-BTC", interval),
      fetchOkxOHLC("BTCUSDT", interval),
      fetch("https://api.exchangerate-api.com/v4/latest/USD", { next: { revalidate: 300 } }),
    ]);
    const fxData = fxRes.ok ? await fxRes.json() : null;
    const usdToKrw: number = fxData?.rates?.KRW ?? 1350;
    const premiumCandles = calcPremiumOHLC(upbitBTC, bybitBTC, usdToKrw);

    return NextResponse.json({ candles: premiumCandles }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
    });
  } catch (err) {
    console.error("Candles API error:", err);
    return NextResponse.json({ candles: [] }, { status: 500 });
  }
}
