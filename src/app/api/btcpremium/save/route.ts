import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fetchUsdKrwRate } from "@/lib/api/exchangeRate";

export const dynamic = "force-dynamic";

async function fetchUpbitBtc(): Promise<number | null> {
  try {
    const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC", {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0]?.trade_price ?? null;
  } catch { return null; }
}

async function fetchOkxBtc(): Promise<number | null> {
  try {
    const res = await fetch("https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT", {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const price = parseFloat(json?.data?.[0]?.last ?? "0");
    return price > 0 ? price : null;
  } catch { return null; }
}

// GitHub Actions에서 매일 호출: Authorization: Bearer {CRON_SECRET}
export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [upbitKrw, okxUsd, exchangeRate] = await Promise.all([
    fetchUpbitBtc(),
    fetchOkxBtc(),
    fetchUsdKrwRate(),
  ]);

  if (!upbitKrw || !okxUsd) {
    return NextResponse.json({ error: "price fetch failed" }, { status: 502 });
  }

  const okxKrw = okxUsd * exchangeRate;
  const premium = parseFloat(((( upbitKrw - okxKrw) / okxKrw) * 100).toFixed(2));
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("btc_premium_history").upsert(
    { date: today, upbit_close: upbitKrw, okx_close: okxUsd, exchange_rate: exchangeRate, premium },
    { onConflict: "date" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, date: today, premium, upbitKrw, okxUsd, exchangeRate });
}
