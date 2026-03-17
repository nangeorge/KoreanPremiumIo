// Use multiple fallback sources for exchange rate
const FALLBACK_RATE = 1350; // fallback if all APIs fail

let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_TTL = 300 * 1000; // 5 minutes

export async function fetchUsdKrwRate(): Promise<number> {
  // Return cached rate if fresh
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_TTL) {
    return cachedRate.rate;
  }

  try {
    // Primary: use Upbit BTC price vs Binance BTC price to infer rate
    // This is actually what we calculate in the API route itself
    // Here we use an open exchange rate API
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const rate = data.rates?.KRW as number;
      if (rate && rate > 0) {
        cachedRate = { rate, timestamp: Date.now() };
        return rate;
      }
    }
  } catch {
    // fallthrough to next source
  }

  try {
    // Fallback: use free currency API
    const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const rate = data.usd?.krw as number;
      if (rate && rate > 0) {
        cachedRate = { rate, timestamp: Date.now() };
        return rate;
      }
    }
  } catch {
    // fallthrough
  }

  // Return stale cache or fallback
  return cachedRate?.rate ?? FALLBACK_RATE;
}
