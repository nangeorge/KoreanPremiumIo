import { NextResponse } from "next/server";

export const revalidate = 300;

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

// Binance klines: [openTime, open, high, low, close, vol, closeTime, ...]
// closeTime < now 인 캔들만 사용 (미완성 캔들 제외)
async function fetchBinanceCloses(interval: string, limit = 100): Promise<number[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=${limit}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data: Array<[number, string, string, string, string, string, number]> = await res.json();
    const now = Date.now();
    // closeTime(index 6) < now → 완성된 캔들만
    return data
      .filter((k) => k[6] < now)
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
    fetchBinanceCloses("1d", 100),
    fetchBinanceCloses("1w", 60),
    fetchBinanceCloses("1M", 50),
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
