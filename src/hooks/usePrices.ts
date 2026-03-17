"use client";

import useSWR from "swr";
import { useAppStore } from "@/store";
import type { PriceResponse } from "@/types";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePrices() {
  const setCoins = useAppStore((s) => s.setCoins);
  const appendHistory = useAppStore((s) => s.appendHistory);
  const setLoading = useAppStore((s) => s.setLoading);
  const setError = useAppStore((s) => s.setError);

  const { data, error, isLoading } = useSWR<PriceResponse>("/api/prices", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  useEffect(() => {
    if (data && data.exchangeRate && Array.isArray(data.coins)) {
      setCoins(data.coins, data.exchangeRate.usdKrw, data.updatedAt);
      // Append to history
      const historyPoints = data.coins
        .filter((coin) => coin.premium !== null)
        .map((coin) => ({
          timestamp: data.updatedAt,
          premium: coin.premium as number,
          symbol: coin.symbol,
        }));
      appendHistory(historyPoints);
    }
  }, [data, setCoins, appendHistory]);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return { data, error, isLoading };
}
