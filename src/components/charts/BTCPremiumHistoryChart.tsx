"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, LineSeries, type IChartApi, type ISeriesApi, type LineData } from "lightweight-charts";

type Row = { date: string; premium: number };
type Range = "1m" | "3m" | "6m" | "1y" | "3y" | "all";

const RANGES: { key: Range; label: string }[] = [
  { key: "1m",  label: "1M" },
  { key: "3m",  label: "3M" },
  { key: "6m",  label: "6M" },
  { key: "1y",  label: "1Y" },
  { key: "3y",  label: "3Y" },
  { key: "all", label: "전체" },
];

const LABELS = {
  ko: { title: "BTC 김치 프리미엄 히스토리", loading: "데이터 로딩 중...", empty: "데이터가 없습니다", source: "출처: 업비트 · OKX · FRED" },
  en: { title: "BTC Kimchi Premium History", loading: "Loading...", empty: "No data", source: "Source: Upbit · OKX · FRED" },
  zh: { title: "BTC泡菜溢价历史", loading: "加载中...", empty: "暂无数据", source: "来源: Upbit · OKX · FRED" },
};

export function BTCPremiumHistoryChart({ locale }: { locale: string }) {
  const t = LABELS[locale as keyof typeof LABELS] ?? LABELS.ko;
  const [range, setRange] = useState<Range>("all");
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ max: number; min: number; avg: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  // 데이터 fetch
  useEffect(() => {
    setLoading(true);
    fetch(`/api/btcpremium/history?range=${range}`)
      .then((r) => r.json())
      .then((json) => {
        const rows: Row[] = json.data ?? [];
        setData(rows);
        if (rows.length > 0) {
          const premiums = rows.map((r) => r.premium);
          setStats({
            max: Math.max(...premiums),
            min: Math.min(...premiums),
            avg: parseFloat((premiums.reduce((a, b) => a + b, 0) / premiums.length).toFixed(2)),
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  // 차트 초기화
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { background: { color: "transparent" }, textColor: "#9ca3af" },
      grid: { vertLines: { color: "rgba(255,255,255,0.04)" }, horzLines: { color: "rgba(255,255,255,0.04)" } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.1)" },
      timeScale: { borderColor: "rgba(255,255,255,0.1)", timeVisible: true },
      handleScroll: true,
      handleScale: true,
    });

    const series = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 2,
      priceFormat: { type: "custom", formatter: (v: number) => `${v.toFixed(2)}%` },
      lastValueVisible: true,
      priceLineVisible: false,
    });

    // 0% 기준선
    series.createPriceLine({ price: 0, color: "rgba(255,255,255,0.25)", lineWidth: 1, lineStyle: 2, axisLabelVisible: false });

    chartRef.current = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.resize(containerRef.current.clientWidth, 280);
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); chart.remove(); };
  }, []);

  // 데이터 업데이트
  useEffect(() => {
    if (!seriesRef.current || !data.length) return;

    const lineData: LineData[] = data.map((r) => ({
      time: r.date as unknown as LineData["time"],
      value: r.premium,
    }));

    seriesRef.current.setData(lineData);
    chartRef.current?.timeScale().fitContent();

    // 프리미엄에 따라 색상 변경
    const latest = data[data.length - 1]?.premium ?? 0;
    seriesRef.current.applyOptions({
      color: latest >= 5 ? "#f87171" : latest >= 2 ? "#fb923c" : latest < -2 ? "#60a5fa" : "#f59e0b",
    });
  }, [data]);

  return (
    <div className="glass rounded-2xl p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-[var(--fg)]">{t.title}</h2>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                range === r.key
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 통계 요약 */}
      {stats && !loading && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: locale === "ko" ? "최고" : "Max", value: stats.max, color: "text-rose-400" },
            { label: locale === "ko" ? "평균" : "Avg", value: stats.avg, color: "text-amber-400" },
            { label: locale === "ko" ? "최저" : "Min", value: stats.min, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/4 px-3 py-2 text-center">
              <p className={`text-sm font-bold font-number ${s.color}`}>
                {s.value > 0 ? "+" : ""}{s.value}%
              </p>
              <p className="text-[10px] text-[var(--fg-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* 차트 */}
      <div className="relative" style={{ height: 280 }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-[var(--fg-muted)]">{t.loading}</span>
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-[var(--fg-muted)]">{t.empty}</span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      <p className="mt-2 text-[10px] text-[var(--fg-muted)] text-right">{t.source}</p>
    </div>
  );
}
