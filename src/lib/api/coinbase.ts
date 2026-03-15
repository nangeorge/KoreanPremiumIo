export interface CoinbaseSpotPrice {
  symbol: string;
  usdPrice: number;
}

// Bulk endpoint: GET /v2/exchange-rates?currency=USD
// Returns { data: { currency: "USD", rates: { "BTC": "0.0000105", ... } } }
// rate = USD per coin (inverted) → coinPrice = 1 / rate
export async function fetchCoinbasePrices(
  pairs: { symbol: string; pair: string }[]
): Promise<CoinbaseSpotPrice[]> {
  try {
    const res = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=USD", {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    const rates: Record<string, string> = json?.data?.rates ?? {};

    return pairs
      .map(({ symbol }) => {
        const rate = parseFloat(rates[symbol] ?? "0");
        // rate = how many coins per 1 USD → price = 1/rate
        const usdPrice = rate > 0 ? 1 / rate : 0;
        return usdPrice > 0 ? { symbol, usdPrice } : null;
      })
      .filter((v): v is CoinbaseSpotPrice => v !== null);
  } catch {
    return [];
  }
}
