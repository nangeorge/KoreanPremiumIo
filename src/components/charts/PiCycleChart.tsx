"use client";

import { useEffect, useRef } from "react";
import useSWR from "swr";
import {
  createChart,
  ColorType,
  LineStyle,
  LineSeries,
  type IChartApi,
  type Time,
  type DeepPartial,
  type ChartOptions,
  type LineSeriesOptions,
} from "lightweight-charts";
import type { PiCycleData } from "@/app/api/pi-cycle/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatUsd(v: number) {
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3) return "$" + (v / 1e3).toFixed(1) + "K";
  return "$" + v.toFixed(0);
}

export function PiCycleChart({ locale = "ko" }: { locale?: string }) {
  const { data, isLoading } = useSWR<PiCycleData>("/api/pi-cycle", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 3600_000,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data?.history.length) return;

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#6b7280",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)", style: LineStyle.Solid },
        horzLines: { color: "rgba(255,255,255,0.04)", style: LineStyle.Solid },
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.06)",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.06)",
        timeVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        vertLine: {
          color: "rgba(255,255,255,0.2)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#1e1e2e",
        },
        horzLine: {
          color: "rgba(255,255,255,0.2)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#1e1e2e",
        },
      },
      handleScroll: { mouseWheel: false, pressedMouseMove: true },
      handleScale: { mouseWheel: false, pinch: false, axisPressedMouseMove: false },
    };

    const chart = createChart(containerRef.current, {
      ...chartOptions,
      width: containerRef.current.clientWidth,
      height: 260,
    });
    chartRef.current = chart;

    const priceFormat = {
      type: "price" as const,
      precision: 0,
      minMove: 1,
    };

    // Price series (gray)
    const priceOpts: DeepPartial<LineSeriesOptions> = {
      color: "rgba(200,200,200,0.45)",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      priceFormat,
    };
    const priceSeries = chart.addSeries(LineSeries, priceOpts);

    // MA111 series (orange)
    const ma111Opts: DeepPartial<LineSeriesOptions> = {
      color: "#f97316",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      title: "111DMA",
      priceFormat,
    };
    const ma111Series = chart.addSeries(LineSeries, ma111Opts);

    // 2×350DMA series (purple)
    const ma350Opts: DeepPartial<LineSeriesOptions> = {
      color: "#8b5cf6",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      title: "2×350DMA",
      priceFormat,
    };
    const ma350x2Series = chart.addSeries(LineSeries, ma350Opts);

    priceSeries.setData(
      data.history.map((p) => ({ time: p.time as Time, value: p.price }))
    );
    ma111Series.setData(
      data.history
        .filter((p) => p.ma111 !== null)
        .map((p) => ({ time: p.time as Time, value: p.ma111! }))
    );
    ma350x2Series.setData(
      data.history
        .filter((p) => p.ma350x2 !== null)
        .map((p) => ({ time: p.time as Time, value: p.ma350x2! }))
    );

    chart.timeScale().fitContent();

    let rafId: number | null = null;
    const ro = new ResizeObserver((entries) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        for (const entry of entries) {
          chart.applyOptions({ width: entry.contentRect.width });
        }
      });
    });
    ro.observe(containerRef.current);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const crossed = data?.crossed ?? false;
  const gapPct = data?.gapPct ?? null;
  const ma111Value = data?.ma111Value ?? null;
  const ma350x2Value = data?.ma350x2Value ?? null;

  const signalLabel =
    locale === "ko"
      ? crossed ? "⚠️ 사이클 탑 신호" : "안전 구간"
      : locale === "zh"
      ? crossed ? "⚠️ 周期顶部信号" : "安全区间"
      : crossed ? "⚠️ Cycle Top Signal" : "Safe Zone";

  const signalBg = crossed
    ? "bg-red-500/10 border-red-500/20 text-red-400"
    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";

  return (
    <div>
      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 rounded" style={{ background: "rgba(200,200,200,0.45)" }} />
          <span className="text-xs text-[var(--fg-muted)]">BTC Price</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 rounded bg-orange-500" />
          <span className="text-xs text-orange-400">111DMA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 rounded bg-violet-500" />
          <span className="text-xs text-violet-400">2×350DMA</span>
        </div>
        {!isLoading && (
          <span className={`ml-auto rounded-full border px-2.5 py-1 text-xs font-bold ${signalBg}`}>
            {signalLabel}
          </span>
        )}
      </div>

      {/* 현재값 */}
      {!isLoading && ma111Value !== null && ma350x2Value !== null && (
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="rounded-lg bg-white/4 px-3 py-1.5">
            <span className="text-[10px] text-[var(--fg-muted)] block">111DMA</span>
            <span className="text-sm font-number font-bold text-orange-400">{formatUsd(ma111Value)}</span>
          </div>
          <div className="rounded-lg bg-white/4 px-3 py-1.5">
            <span className="text-[10px] text-[var(--fg-muted)] block">2×350DMA</span>
            <span className="text-sm font-number font-bold text-violet-400">{formatUsd(ma350x2Value)}</span>
          </div>
          {gapPct !== null && (
            <div className="rounded-lg bg-white/4 px-3 py-1.5">
              <span className="text-[10px] text-[var(--fg-muted)] block">Gap</span>
              <span className={`text-sm font-number font-bold ${gapPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {gapPct >= 0 ? "+" : ""}{gapPct.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}

      {isLoading || !data?.history.length ? (
        <div className="skeleton w-full rounded-lg" style={{ height: 260 }} />
      ) : (
        <div ref={containerRef} className="w-full" style={{ height: 260 }} />
      )}
    </div>
  );
}
