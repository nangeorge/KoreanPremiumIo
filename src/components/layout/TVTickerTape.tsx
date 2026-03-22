"use client";

import { useEffect, useRef, useState } from "react";

const SYMBOLS = [
  // ── 글로벌 주요 지수 ──
  { proName: "FOREXCOM:SPXUSD",  title: "S&P 500"  },
  { proName: "FOREXCOM:NSXUSD",  title: "NASDAQ"   },
  { proName: "FOREXCOM:DJI",     title: "DOW"      },
  { proName: "KRX:KOSDAQ",       title: "KOSDAQ"   },
  // ── NASDAQ Top 10 ──
  { proName: "NASDAQ:NVDA",  title: "NVDA"  },
  { proName: "NASDAQ:AAPL",  title: "AAPL"  },
  { proName: "NASDAQ:MSFT",  title: "MSFT"  },
  { proName: "NASDAQ:AMZN",  title: "AMZN"  },
  { proName: "NASDAQ:META",  title: "META"  },
  { proName: "NASDAQ:GOOGL", title: "GOOGL" },
  { proName: "NASDAQ:TSLA",  title: "TSLA"  },
  { proName: "NASDAQ:AVGO",  title: "AVGO"  },
  { proName: "NASDAQ:NFLX",  title: "NFLX"  },
  { proName: "NASDAQ:COST",  title: "COST"  },
  // ── 주요 암호화폐 ──
  { proName: "BINANCE:BTCUSDT",  title: "BTC"     },
  { proName: "BINANCE:ETHUSDT",  title: "ETH"     },
  { proName: "BINANCE:SOLUSDT",  title: "SOL"     },
  { proName: "BINANCE:XRPUSDT",  title: "XRP"     },
  { proName: "FX_IDC:USDKRW",   title: "USD/KRW" },
];

export function TVTickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [colorTheme, setColorTheme] = useState<"dark" | "light">("dark");

  // 초기 테마 로드
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as "dark" | "light") ?? "dark";
    setColorTheme(stored);
  }, []);

  // data-theme 속성 변경 감지
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute("data-theme");
      setColorTheme(theme === "light" ? "light" : "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // 테마 변경 시 위젯 재인젝션
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 기존 위젯 제거
    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: SYMBOLS,
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "regular",
      colorTheme,
      locale: "en",
    });
    container.appendChild(script);
  }, [colorTheme]);

  return (
    <div className="w-full border-b border-[var(--divider)]">
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
