"use client";

import { useAppStore } from "@/store";

const EXCHANGE_INFO = {
  binance:  { flag: "🌏", label: "Bybit",  labelEn: "Bybit",  currency: "USD" },
  coinbase: { flag: "🇺🇸", label: "코인베이스", labelEn: "Coinbase", currency: "USD" },
};

export function ExchangeCompare({ locale }: { locale: string }) {
  const selectedExchange = useAppStore((s) => s.selectedExchange);
  const ext = EXCHANGE_INFO[selectedExchange];
  const extLabel = locale === "ko" ? ext.label : ext.labelEn;

  return (
    <div className="mt-8 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/8 px-4 py-2">
        <span className="text-sm">🇰🇷</span>
        <span className="text-sm font-medium text-blue-400">
          {locale === "ko" ? "업비트 (KRW)" : "Upbit (KRW)"}
        </span>
      </div>
      <div className="flex items-center gap-1 text-gray-600 text-sm font-mono">
        <span>vs</span>
        <span className="text-base">🌶️</span>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/8 px-4 py-2">
        <span className="text-sm">{ext.flag}</span>
        <span className="text-sm font-medium text-yellow-400">
          {extLabel} ({ext.currency})
        </span>
      </div>
    </div>
  );
}
