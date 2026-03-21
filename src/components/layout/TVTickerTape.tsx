"use client";

import { useEffect, useRef } from "react";

export function TVTickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || containerRef.current.querySelector("script")) return;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BINANCE:BTCUSDT",  title: "BTC"     },
        { proName: "BINANCE:ETHUSDT",  title: "ETH"     },
        { proName: "BINANCE:SOLUSDT",  title: "SOL"     },
        { proName: "BINANCE:XRPUSDT",  title: "XRP"     },
        { proName: "BINANCE:BNBUSDT",  title: "BNB"     },
        { proName: "BINANCE:DOGEUSDT", title: "DOGE"    },
        { proName: "FX_IDC:USDKRW",   title: "USD/KRW" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full border-b border-white/5 bg-[var(--bg-base)]">
      <div
        ref={containerRef}
        className="tradingview-widget-container mx-auto max-w-7xl"
        style={{ minHeight: 46 }}
      >
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}
