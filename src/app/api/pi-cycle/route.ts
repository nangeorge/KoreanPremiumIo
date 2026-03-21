import { NextResponse } from "next/server";

export const revalidate = 3600;

export interface PiCyclePoint {
  time: string; // YYYY-MM-DD
  price: number;
  ma111: number | null;
  ma350x2: number | null;
}

export interface PiCycleData {
  history: PiCyclePoint[];
  crossed: boolean;
  ma111Value: number | null;
  ma350x2Value: number | null;
  gapPct: number | null;
  currentPrice: number | null;
}

function calcMA(closes: number[], period: number, idx: number): number | null {
  if (idx < period - 1) return null;
  const slice = closes.slice(idx - period + 1, idx + 1);
  return slice.reduce((a, b) => a + b, 0) / period;
}

export async function GET() {
  try {
    const res = await fetch(
      "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=500",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Binance klines fetch failed");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any[][] = await res.json();
    const closes = raw.map((k) => parseFloat(k[4]));
    const dates = raw.map((k) =>
      new Date(k[0]).toISOString().slice(0, 10)
    );

    const history: PiCyclePoint[] = closes.map((price, i) => {
      const ma111 = calcMA(closes, 111, i);
      const rawMa350 = calcMA(closes, 350, i);
      const ma350x2 = rawMa350 !== null ? rawMa350 * 2 : null;
      return { time: dates[i], price, ma111, ma350x2 };
    });

    const last = history.at(-1);
    const ma111Value = last?.ma111 ?? null;
    const ma350x2Value = last?.ma350x2 ?? null;
    const crossed =
      ma111Value !== null && ma350x2Value !== null && ma111Value >= ma350x2Value;
    const gapPct =
      ma111Value !== null && ma350x2Value !== null
        ? parseFloat(
            (((ma111Value - ma350x2Value) / ma350x2Value) * 100).toFixed(2)
          )
        : null;

    return NextResponse.json({
      history,
      crossed,
      ma111Value,
      ma350x2Value,
      gapPct,
      currentPrice: closes.at(-1) ?? null,
    } satisfies PiCycleData);
  } catch (e) {
    console.error("Pi Cycle API error:", e);
    return NextResponse.json({
      history: [],
      crossed: false,
      ma111Value: null,
      ma350x2Value: null,
      gapPct: null,
      currentPrice: null,
    } satisfies PiCycleData);
  }
}
