"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LiqEvent {
  id: number;
  symbol: string;
  side: "LONG" | "SHORT"; // LONG = 롱 청산(빨강), SHORT = 숏 청산(초록)
  price: number;
  qty: number;
  usdValue: number;
  ts: number;
}

let idCounter = 0;
const MIN_USD = 50_000;

function formatUsdShort(v: number) {
  if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(2) + "M";
  if (v >= 1_000) return "$" + (v / 1_000).toFixed(0) + "K";
  return "$" + v.toFixed(0);
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m`;
}

export function LiquidationFeed({ locale = "ko" }: { locale?: string }) {
  const [events, setEvents] = useState<LiqEvent[]>([]);
  const [totalLong, setTotalLong] = useState(0);
  const [totalShort, setTotalShort] = useState(0);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      try {
        const ws = new WebSocket(
          "wss://fstream.binance.com/ws/!forceOrder@arr"
        );
        wsRef.current = ws;

        ws.onopen = () => !cancelled && setConnected(true);
        ws.onclose = () => {
          if (!cancelled) {
            setConnected(false);
            reconnectRef.current = setTimeout(connect, 3000);
          }
        };
        ws.onerror = () => ws.close();

        ws.onmessage = (e) => {
          if (cancelled) return;
          try {
            const msg = JSON.parse(e.data);
            const o = msg.o;
            if (!o || o.X !== "FILLED") return;

            const price = parseFloat(o.ap || o.p);
            const qty = parseFloat(o.z || o.q);
            const usdValue = price * qty;

            if (usdValue < MIN_USD) return;

            // S: "SELL" = LONG position liquidated; S: "BUY" = SHORT liquidated
            const side: "LONG" | "SHORT" = o.S === "SELL" ? "LONG" : "SHORT";

            const ev: LiqEvent = {
              id: ++idCounter,
              symbol: o.s.replace("USDT", ""),
              side,
              price,
              qty,
              usdValue,
              ts: o.T || Date.now(),
            };

            setEvents((prev) => [ev, ...prev].slice(0, 30));
            if (side === "LONG") {
              setTotalLong((p) => p + usdValue);
            } else {
              setTotalShort((p) => p + usdValue);
            }
          } catch { /* ignore */ }
        };
      } catch { /* ignore */ }
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, []);

  const title =
    locale === "ko"
      ? "실시간 대형 청산"
      : locale === "zh"
      ? "实时大额清算"
      : "Real-time Liquidations";
  const subtitle =
    locale === "ko"
      ? `$${(MIN_USD / 1000).toFixed(0)}K+ 이상만 표시`
      : locale === "zh"
      ? `仅显示$${(MIN_USD / 1000).toFixed(0)}K+以上`
      : `Only $${(MIN_USD / 1000).toFixed(0)}K+ shown`;
  const longLabel = locale === "ko" ? "롱 청산" : locale === "zh" ? "多头清算" : "Long Liq";
  const shortLabel = locale === "ko" ? "숏 청산" : locale === "zh" ? "空头清算" : "Short Liq";
  const waitingLabel = locale === "ko" ? "대형 청산 대기 중..." : locale === "zh" ? "等待大额清算..." : "Waiting for liquidations...";

  return (
    <div className="glass rounded-lg p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--fg)]">{title}</span>
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                connected ? "bg-emerald-400 live-dot" : "bg-[var(--fg-muted)]"
              )}
            />
          </div>
          <span className="text-xs text-[var(--fg-muted)]">{subtitle}</span>
        </div>
        {/* 롱/숏 합계 */}
        <div className="flex items-center gap-3 text-xs">
          <div className="text-center">
            <div className="text-rose-400 font-number font-bold">{formatUsdShort(totalLong)}</div>
            <div className="text-[var(--fg-muted)]">{longLabel}</div>
          </div>
          <div className="text-center">
            <div className="text-emerald-400 font-number font-bold">{formatUsdShort(totalShort)}</div>
            <div className="text-[var(--fg-muted)]">{shortLabel}</div>
          </div>
        </div>
      </div>

      {/* 이벤트 목록 */}
      <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
        {events.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--fg-muted)]">{waitingLabel}</div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className={cn(
                "flex items-center justify-between rounded px-2.5 py-1.5 text-xs border",
                ev.side === "LONG"
                  ? "bg-rose-500/8 border-rose-500/15"
                  : "bg-emerald-500/8 border-emerald-500/15"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-bold",
                    ev.side === "LONG"
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  )}
                >
                  {ev.side}
                </span>
                <span className="font-semibold text-[var(--fg)]">{ev.symbol}</span>
                <span className="text-[var(--fg-muted)] font-number">
                  @{ev.price >= 1 ? ev.price.toLocaleString("en-US", { maximumFractionDigits: 2 }) : ev.price.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-number font-bold",
                    ev.side === "LONG" ? "text-rose-400" : "text-emerald-400"
                  )}
                >
                  {formatUsdShort(ev.usdValue)}
                </span>
                <span className="text-[var(--fg-muted)] w-6 text-right">{timeAgo(ev.ts)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
