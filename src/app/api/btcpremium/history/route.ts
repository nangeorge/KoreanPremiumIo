import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") ?? "1y"; // 1m | 3m | 6m | 1y | 3y | all

  const now = new Date();
  let from: string;
  switch (range) {
    case "1m":  from = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split("T")[0]; break;
    case "3m":  from = new Date(now.setMonth(now.getMonth() - 3)).toISOString().split("T")[0]; break;
    case "6m":  from = new Date(now.setMonth(now.getMonth() - 6)).toISOString().split("T")[0]; break;
    case "3y":  from = new Date(now.setFullYear(now.getFullYear() - 3)).toISOString().split("T")[0]; break;
    case "all": from = "2017-01-01"; break;
    default:    from = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split("T")[0];
  }

  const { data, error } = await supabase
    .from("btc_premium_history")
    .select("date, premium, upbit_close, okx_close, exchange_rate")
    .gte("date", from)
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { data: data ?? [], range, from },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
  );
}
