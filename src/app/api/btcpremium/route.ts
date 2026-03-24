import { NextResponse } from "next/server";
import { fetchUsdKrwRate } from "@/lib/api/exchangeRate";

export const dynamic = "force-dynamic";

async function fetchUpbitBtc(): Promise<number | null> {
  try {
    const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC", {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0]?.trade_price ?? null;
  } catch {
    return null;
  }
}

async function fetchOkxBtc(): Promise<number | null> {
  try {
    const res = await fetch("https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT", {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const price = parseFloat(json?.data?.[0]?.last ?? "0");
    return price > 0 ? price : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const [upbitKrw, okxUsd, exchangeRate] = await Promise.all([
    fetchUpbitBtc(),
    fetchOkxBtc(),
    fetchUsdKrwRate(),
  ]);

  const okxKrw = okxUsd !== null ? okxUsd * exchangeRate : null;
  const premium =
    upbitKrw !== null && okxKrw !== null && okxKrw > 0
      ? parseFloat(((( upbitKrw - okxKrw) / okxKrw) * 100).toFixed(2))
      : null;

  return NextResponse.json(
    { premium, upbitKrw, okxUsd, exchangeRate, updatedAt: Date.now() },
    { headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10" } }
  );
}
