"use client";

import { usePrices } from "@/hooks/usePrices";

export function DataProvider({ children }: { children: React.ReactNode }) {
  usePrices();
  return <>{children}</>;
}
