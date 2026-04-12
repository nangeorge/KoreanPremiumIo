/**
 * BTC 김치 프리미엄 히스토리 백필 스크립트
 * 실행: npx tsx --env-file=.env.local src/scripts/backfill-btc.ts
 *
 * 데이터 소스:
 *  - 업비트 API     : KRW-BTC 일봉 (2017년 9월~현재)
 *  - OKX API        : BTC-USDT 일봉
 *  - FRED API       : USD/KRW 환율 (미국 연방준비제도, 무료)
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── FRED USD/KRW 환율 (전체 히스토리) ─────────────────────────────────────────
async function fetchFredRates(): Promise<Map<string, number>> {
  console.log("📥 FRED 환율 다운로드 중...");
  const res = await fetch(
    "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DEXKOUS",
    { signal: AbortSignal.timeout(15000) }
  );
  const csv = await res.text();
  const map = new Map<string, number>();
  for (const line of csv.split("\n").slice(1)) {
    const [date, value] = line.split(",");
    if (date && value && value.trim() !== ".") {
      map.set(date.trim(), parseFloat(value.trim()));
    }
  }
  console.log(`   → ${map.size}개 환율 데이터\n`);
  return map;
}

// ── 업비트 KRW-BTC 일봉 전체 ──────────────────────────────────────────────────
async function fetchUpbitAllCandles(): Promise<Map<string, number>> {
  console.log("📥 업비트 BTC/KRW 일봉 다운로드 중...");
  const map = new Map<string, number>();
  let to: string | undefined;

  while (true) {
    const url =
      `https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200` +
      (to ? `&to=${encodeURIComponent(to)}` : "");

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) { console.error("업비트 오류:", res.status); break; }

    const candles: Array<{ candle_date_time_utc: string; trade_price: number }> =
      await res.json();
    if (!candles.length) break;

    for (const c of candles) {
      map.set(c.candle_date_time_utc.split("T")[0], c.trade_price);
    }

    const oldest = candles[candles.length - 1].candle_date_time_utc;
    process.stdout.write(`\r   → ${map.size}개 (가장 오래된 날짜: ${oldest.split("T")[0]})`);

    if (oldest < "2017-08-01T00:00:00") break;
    to = oldest;
    await sleep(300);
  }
  console.log(`\n   → 총 ${map.size}개 업비트 일봉\n`);
  return map;
}

// ── OKX BTC-USDT 일봉 전체 ────────────────────────────────────────────────────
async function fetchOkxAllCandles(): Promise<Map<string, number>> {
  console.log("📥 OKX BTC/USDT 일봉 다운로드 중...");
  const map = new Map<string, number>();
  let after: string | undefined;

  while (true) {
    const url =
      `https://www.okx.com/api/v5/market/history-candles?instId=BTC-USDT&bar=1D&limit=100` +
      (after ? `&after=${after}` : "");

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) { console.error("OKX 오류:", res.status); break; }

    const json = await res.json();
    const candles: string[][] = json.data ?? [];
    if (!candles.length) break;

    for (const [ts, , , , close] of candles) {
      const date = new Date(parseInt(ts)).toISOString().split("T")[0];
      map.set(date, parseFloat(close));
    }

    const oldestTs = candles[candles.length - 1][0];
    const oldestDate = new Date(parseInt(oldestTs)).toISOString().split("T")[0];
    process.stdout.write(`\r   → ${map.size}개 (가장 오래된 날짜: ${oldestDate})`);

    if (oldestDate < "2017-08-01") break;
    after = oldestTs;
    await sleep(300);
  }
  console.log(`\n   → 총 ${map.size}개 OKX 일봉\n`);
  return map;
}

// ── 환율 조회 (주말 등 데이터 없는 날은 최근 영업일로 fallback) ────────────────
function getRate(fredRates: Map<string, number>, date: string): number | null {
  const rate = fredRates.get(date);
  if (rate) return rate;
  // 최대 5일 전 영업일로 fallback
  for (let i = 1; i <= 5; i++) {
    const d = new Date(date);
    d.setDate(d.getDate() - i);
    const prev = d.toISOString().split("T")[0];
    const r = fredRates.get(prev);
    if (r) return r;
  }
  return null;
}

// ── 메인 ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== BTC 김치 프리미엄 히스토리 백필 ===\n");

  // 세 소스 병렬 다운로드 (Upbit/OKX는 내부적으로 순차 페이지네이션)
  const [fredRates, upbitCandles, okxCandles] = await Promise.all([
    fetchFredRates(),
    fetchUpbitAllCandles(),
    fetchOkxAllCandles(),
  ]);

  // 업비트·OKX 공통 날짜만 처리
  const dates = [...upbitCandles.keys()]
    .filter((d) => okxCandles.has(d))
    .sort();

  console.log(`📊 공통 날짜: ${dates.length}일\n`);

  const rows: Array<{
    date: string;
    upbit_close: number;
    okx_close: number;
    exchange_rate: number;
    premium: number;
  }> = [];

  for (const date of dates) {
    const upbitClose = upbitCandles.get(date)!;
    const okxClose = okxCandles.get(date)!;
    const exchangeRate = getRate(fredRates, date);
    if (!exchangeRate) continue;

    const okxKrw = okxClose * exchangeRate;
    const premium = parseFloat(((( upbitClose - okxKrw) / okxKrw) * 100).toFixed(2));
    rows.push({ date, upbit_close: upbitClose, okx_close: okxClose, exchange_rate: exchangeRate, premium });
  }

  console.log(`✅ 유효 데이터: ${rows.length}일\n`);

  // 500개씩 청크로 Supabase upsert
  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("btc_premium_history")
      .upsert(chunk, { onConflict: "date" });

    if (error) {
      console.error(`청크 ${i}~${i + CHUNK} 오류:`, error.message);
    } else {
      console.log(`   💾 ${Math.min(i + CHUNK, rows.length)}/${rows.length}행 저장 완료`);
    }
  }

  // 결과 요약
  const { data: summary } = await supabase
    .from("btc_premium_history")
    .select("date, premium")
    .order("date", { ascending: true })
    .limit(1);
  const { data: latest } = await supabase
    .from("btc_premium_history")
    .select("date, premium")
    .order("date", { ascending: false })
    .limit(1);

  console.log("\n=== 백필 완료 ===");
  console.log(`시작일: ${summary?.[0]?.date} (김프: ${summary?.[0]?.premium}%)`);
  console.log(`종료일: ${latest?.[0]?.date} (김프: ${latest?.[0]?.premium}%)`);
  console.log(`총 ${rows.length}일치 데이터 저장 완료 🎉`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
