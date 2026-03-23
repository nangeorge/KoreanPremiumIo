const UPBIT_API = "https://api.upbit.com/v1";

export interface UpbitTicker {
  market: string;
  trade_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
  signed_change_rate: number;
}

// 업비트는 목록에 미상장 마켓이 하나라도 있으면 전체 400 에러를 반환함.
// 1) 먼저 bulk 요청 시도
// 2) 실패하면 개별 요청으로 fallback (미상장 코인은 조용히 제외)
export async function fetchUpbitPrices(markets: string[]): Promise<UpbitTicker[]> {
  const opts = {
    next: { revalidate: 0 },
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  };

  // 1) bulk 시도
  try {
    const res = await fetch(
      `${UPBIT_API}/ticker?markets=${markets.join(",")}`,
      opts
    );
    if (res.ok) return res.json();
  } catch {
    // network error → fall through
  }

  // 2) fallback: 10개씩 묶어서 요청 (rate limit 방어)
  const CHUNK = 10;
  const chunks: string[][] = [];
  for (let i = 0; i < markets.length; i += CHUNK) {
    chunks.push(markets.slice(i, i + CHUNK));
  }

  const results = await Promise.allSettled(
    chunks.map(async (chunk) => {
      const res = await fetch(
        `${UPBIT_API}/ticker?markets=${chunk.join(",")}`,
        opts
      );
      if (!res.ok) {
        // chunk 안에 미상장 코인 있음 → 개별로 재시도
        const individual = await Promise.allSettled(
          chunk.map(async (market) => {
            const r = await fetch(`${UPBIT_API}/ticker?markets=${market}`, opts);
            if (!r.ok) return [] as UpbitTicker[];
            return r.json() as Promise<UpbitTicker[]>;
          })
        );
        return individual.flatMap((r) =>
          r.status === "fulfilled" ? r.value : []
        );
      }
      return res.json() as Promise<UpbitTicker[]>;
    })
  );

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
