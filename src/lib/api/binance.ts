const BINANCE_API = "https://api.binance.com/api/v3";

export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
}

const CHUNK = 40;

async function fetchChunk(symbols: string[]): Promise<BinanceTicker[]> {
  const res = await fetch(
    `${BINANCE_API}/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}&type=MINI`,
    { next: { revalidate: 5 } }
  );
  if (res.ok) return res.json();

  // 청크 실패 → 개별 요청으로 fallback (미상장 심볼 있을 경우)
  const individual = await Promise.allSettled(
    symbols.map(async (sym) => {
      const r = await fetch(
        `${BINANCE_API}/ticker/24hr?symbol=${sym}&type=MINI`,
        { next: { revalidate: 5 } }
      );
      if (!r.ok) return null;
      return r.json() as Promise<BinanceTicker>;
    })
  );
  return individual.flatMap((r) =>
    r.status === "fulfilled" && r.value ? [r.value] : []
  );
}

export async function fetchBinancePrices(symbols: string[]): Promise<BinanceTicker[]> {
  const valid = symbols.filter(Boolean);
  if (valid.length === 0) return [];

  const chunks: string[][] = [];
  for (let i = 0; i < valid.length; i += CHUNK) {
    chunks.push(valid.slice(i, i + CHUNK));
  }

  const results = await Promise.allSettled(chunks.map(fetchChunk));
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
