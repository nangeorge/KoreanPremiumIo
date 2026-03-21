"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  LineStyle,
  AreaSeries,
  LineSeries,
  HistogramSeries,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type Time,
  type DeepPartial,
  type ChartOptions,
  type AreaSeriesOptions,
  type LineSeriesOptions,
  type HistogramSeriesOptions,
  type CandlestickSeriesOptions,
} from "lightweight-charts";

export interface TVDataPoint {
  time: Time;
  value: number;
  color?: string;
}

export interface TVCandlePoint {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TVBandLine {
  value: number;
  color: string;
  label?: string;
  style?: "dashed" | "solid" | "dotted";
}

interface TVChartProps {
  data?: TVDataPoint[];
  candleData?: TVCandlePoint[];
  height?: number;
  color?: string;
  type?: "area" | "line" | "histogram" | "candlestick";
  topColor?: string;
  bottomColor?: string;
  bandLines?: TVBandLine[];
  priceFormat?: { type: "price"; precision?: number; minMove?: number };
}

export function TVChart({
  data = [],
  candleData,
  height = 180,
  color = "#e2e8f0",
  type = "area",
  topColor,
  bottomColor,
  bandLines = [],
  priceFormat,
}: TVChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | ISeriesApi<"Line"> | ISeriesApi<"Histogram"> | ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        vertLine: { color: "rgba(255,255,255,0.2)", width: 1, style: LineStyle.Dashed, labelBackgroundColor: "#1e1e2e" },
        horzLine: { color: "rgba(255,255,255,0.2)", width: 1, style: LineStyle.Dashed, labelBackgroundColor: "#1e1e2e" },
      },
      handleScroll: { mouseWheel: false, pressedMouseMove: true },
      handleScale: { mouseWheel: false, pinch: false, axisPressedMouseMove: false },
    };

    const chart = createChart(containerRef.current, {
      ...chartOptions,
      width: containerRef.current.clientWidth,
      height,
    });
    chartRef.current = chart;

    const pf = priceFormat ?? { type: "price" as const, precision: 2, minMove: 0.01 };

    if (type === "area") {
      const opts: DeepPartial<AreaSeriesOptions> = {
        lineColor: color,
        topColor: topColor ?? color + "40",
        bottomColor: bottomColor ?? color + "04",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        priceLineVisible: false,
        lastValueVisible: true,
        priceFormat: pf,
      };
      seriesRef.current = chart.addSeries(AreaSeries, opts);
    } else if (type === "line") {
      const opts: DeepPartial<LineSeriesOptions> = {
        color,
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        priceLineVisible: false,
        lastValueVisible: true,
        priceFormat: pf,
      };
      seriesRef.current = chart.addSeries(LineSeries, opts);
    } else if (type === "candlestick") {
      const opts: DeepPartial<CandlestickSeriesOptions> = {
        upColor: "#10b981",
        downColor: "#ef4444",
        borderUpColor: "#10b981",
        borderDownColor: "#ef4444",
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
        priceLineVisible: false,
        lastValueVisible: true,
        priceFormat: pf,
      };
      seriesRef.current = chart.addSeries(CandlestickSeries, opts);
    } else {
      const opts: DeepPartial<HistogramSeriesOptions> = {
        color,
        priceLineVisible: false,
        lastValueVisible: true,
        priceFormat: pf,
      };
      seriesRef.current = chart.addSeries(HistogramSeries, opts);
    }

    // 밴드 라인
    bandLines.forEach((band) => {
      seriesRef.current?.createPriceLine({
        price: band.value,
        color: band.color,
        lineWidth: 1,
        lineStyle: band.style === "solid" ? LineStyle.Solid : band.style === "dotted" ? LineStyle.Dotted : LineStyle.Dashed,
        axisLabelVisible: true,
        title: band.label ?? "",
      });
    });

    const initialData = type === "candlestick" ? (candleData ?? []) : data;
    if (initialData.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sorted = [...initialData].sort((a, b) => {
        const ta = typeof a.time === "string" ? a.time : Number(a.time);
        const tb = typeof b.time === "string" ? b.time : Number(b.time);
        return ta < tb ? -1 : ta > tb ? 1 : 0;
      });
      const deduped = sorted.filter((d, i) => i === 0 || d.time !== sorted[i - 1].time);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (seriesRef.current as any).setData(deduped);
      chart.timeScale().fitContent();
    }

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
      seriesRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateData = type === "candlestick" ? (candleData ?? []) : data;
    if (!seriesRef.current || !updateData.length) return;
    const sorted = [...updateData].sort((a, b) => {
      const ta = typeof a.time === "string" ? a.time : Number(a.time);
      const tb = typeof b.time === "string" ? b.time : Number(b.time);
      return ta < tb ? -1 : ta > tb ? 1 : 0;
    });
    const deduped = sorted.filter((d, i) => i === 0 || d.time !== sorted[i - 1].time);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (seriesRef.current as any).setData(deduped);
    chartRef.current?.timeScale().fitContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, candleData]);

  return <div ref={containerRef} style={{ height }} className="w-full" />;
}
