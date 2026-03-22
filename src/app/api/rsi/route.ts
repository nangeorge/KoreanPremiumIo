import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function calcRSI(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null;

  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses += -diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Wilder's smoothing
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(0, diff)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(0, -diff)) / period;
  }

  if (avgLoss === 0) return 100;
  return parseFloat((100 - 100 / (1 + avgGain / avgLoss)).toFixed(2));
}

// OKX candles: [ts, open, high, low, close, vol, volCcy, volCcyQuote, confirm]
// confirm = "1" → 완성된 캔들
async function fetchOkxCloses(bar: string, limit = 100): Promise<number[]> {
  const url = `https://www.okx.com/api/v5/market/candles?instId=BTC-USDT&bar=${bar}&limit=${limit}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const json: { code: string; data: string[][] } = await res.json();
    if (json.code !== "0" || !Array.isArray(json.data)) return [];
    // OKX returns newest first → reverse to chronological order
    // confirm (index 8) = "1" means closed candle
    return json.data
      .filter((k) => k[8] === "1")
      .reverse()
      .map((k) => parseFloat(k[4]));
  } catch {
    return [];
  }
}

export interface RSIResponse {
  daily: number | null;
  weekly: number | null;
  monthly: number | null;
  updatedAt: number;
}

export async function GET() {
  const [dailyCloses, weeklyCloses, monthlyCloses] = await Promise.all([
    fetchOkxCloses("1D", 100),
    fetchOkxCloses("1W", 60),
    fetchOkxCloses("1M", 50),
  ]);

  return NextResponse.json(
    {
      daily: calcRSI(dailyCloses),
      weekly: calcRSI(weeklyCloses),
      monthly: calcRSI(monthlyCloses),
      updatedAt: Date.now(),
    } satisfies RSIResponse,
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } }
  );
}
