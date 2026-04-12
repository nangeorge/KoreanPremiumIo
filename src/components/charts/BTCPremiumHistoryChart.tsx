"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, LineSeries, type IChartApi, type ISeriesApi, type LineData } from "lightweight-charts";

type Row = { date: string; premium: number; upbit_close: number };
type Range = "1m" | "3m" | "6m" | "1y" | "3y" | "all";

const RANGES: { key: Range; label: string }[] = [
  { key: "1m",  label: "1M" },
  { key: "3m",  label: "3M" },
  { key: "6m",  label: "6M" },
  { key: "1y",  label: "1Y" },
  { key: "3y",  label: "3Y" },
  { key: "all", label: "ALL" },
];

const LABELS = {
  ko: {
    title: "BTC 가격 × 김치 프리미엄",
    subtitle: "김프 고점 = BTC 고점 선행지표",
    btcPrice: "BTC 가격 (업비트)",
    kimchi: "김치 프리미엄",
    loading: "데이터 로딩 중...",
    empty: "백필 스크립트를 먼저 실행해주세요",
    source: "출처: 업비트 · OKX · FRED (미국 연방준비제도)",
    maxPremium: "역대 최고 김프",
    minPremium: "역대 최저 김프",
    avgPremium: "기간 평균",
  },
  en: {
    title: "BTC Price × Kimchi Premium",
    subtitle: "Premium peaks historically lead BTC tops",
    btcPrice: "BTC Price (Upbit)",
    kimchi: "Kimchi Premium",
    loading: "Loading...",
    empty: "Run the backfill script first",
    source: "Source: Upbit · OKX · FRED (US Federal Reserve)",
    maxPremium: "All-time High Premium",
    minPremium: "All-time Low Premium",
    avgPremium: "Period Average",
  },
  zh: {
    title: "BTC价格 × 泡菜溢价",
    subtitle: "溢价高点历史上领先BTC顶部",
    btcPrice: "BTC价格 (Upbit)",
    kimchi: "泡菜溢价",
    loading: "加载中...",
    empty: "请先运行回填脚本",
    source: "来源: Upbit · OKX · FRED (美联储)",
    maxPremium: "历史最高溢价",
    minPremium: "历史最低溢价",
    avgPremium: "区间平均",
  },
};

function fmt(n: number) { return n > 0 ? `+${n}%` : `${n}%`; }

export function BTCPremiumHistoryChart({ locale }: { locale: string }) {
  const t = LABELS[locale as keyof typeof LABELS] ?? LABELS.ko;
  const [range, setRange] = useState<Range>("all");
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ date: string; btc: number; premium: number } | null>(null);
  const [stats, setStats] = useState<{ max: number; min: number; avg: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const btcSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const premiumSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

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
        } else {
          setStats(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  // 차트 초기화 (한 번만)
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { background: { color: "transparent" }, textColor: "#9ca3af" },
      grid: { vertLines: { color: "rgba(255,255,255,0.03)" }, horzLines: { color: "rgba(255,255,255,0.03)" } },
      crosshair: { mode: 1 },
      leftPriceScale:  { visible: true,  borderColor: "rgba(255,255,255,0.08)", scaleMargins: { top: 0.04, bottom: 0.5 } },
      rightPriceScale: { visible: true,  borderColor: "rgba(255,255,255,0.08)", scaleMargins: { top: 0.58, bottom: 0.04 } },
      timeScale: { borderColor: "rgba(255,255,255,0.08)", timeVisible: true },
    });

    // BTC 가격 시리즈 (왼쪽 축)
    const btcSeries = chart.addSeries(LineSeries, {
      color: "rgba(148, 163, 184, 0.7)", // slate-400
      lineWidth: 1,
      priceScaleId: "left",
      priceFormat: {
        type: "custom",
        formatter: (v: number) =>
          v >= 1_000_000 ? `₩${(v / 1_000_000).toFixed(1)}M` : `₩${(v / 1_000).toFixed(0)}K`,
      },
      lastValueVisible: false,
      priceLineVisible: false,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 3,
    });

    // 김치 프리미엄 시리즈 (오른쪽 축)
    const premiumSeries = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 2,
      priceScaleId: "right",
      priceFormat: { type: "custom", formatter: (v: number) => `${v.toFixed(1)}%` },
      lastValueVisible: true,
      priceLineVisible: false,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
    });

    // 0% 기준선
    premiumSeries.createPriceLine({
      price: 0,
      color: "rgba(255,255,255,0.2)",
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "0%",
    });

    // 크로스헤어 이동 시 툴팁 업데이트
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData) { setTooltip(null); return; }
      const btcVal = param.seriesData.get(btcSeries) as LineData | undefined;
      const premVal = param.seriesData.get(premiumSeries) as LineData | undefined;
      if (btcVal && premVal) {
        setTooltip({
          date: String(param.time),
          btc: (btcVal as LineData).value,
          premium: (premVal as LineData).value,
        });
      }
    });

    chartRef.current = chart;
    btcSeriesRef.current = btcSeries;
    premiumSeriesRef.current = premiumSeries;

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.resize(containerRef.current.clientWidth, 320);
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); chart.remove(); };
  }, []);

  // 데이터 업데이트
  useEffect(() => {
    if (!btcSeriesRef.current || !premiumSeriesRef.current || !data.length) return;

    const btcData: LineData[] = data.map((r) => ({
      time: r.date as unknown as LineData["time"],
      value: r.upbit_close,
    }));
    const premiumData: LineData[] = data.map((r) => ({
      time: r.date as unknown as LineData["time"],
      value: r.premium,
    }));

    btcSeriesRef.current.setData(btcData);
    premiumSeriesRef.current.setData(premiumData);
    chartRef.current?.timeScale().fitContent();

    // 최신 프리미엄에 따라 색상 변경
    const latest = data[data.length - 1]?.premium ?? 0;
    premiumSeriesRef.current.applyOptions({
      color: latest >= 10 ? "#f87171" : latest >= 3 ? "#fb923c" : latest < -2 ? "#60a5fa" : "#f59e0b",
    });
  }, [data]);

  const latestPremium = data[data.length - 1]?.premium;
  const premiumColor = latestPremium == null ? "text-[var(--fg-muted)]"
    : latestPremium >= 10 ? "text-rose-400"
    : latestPremium >= 3  ? "text-orange-400"
    : latestPremium < -2  ? "text-blue-400"
    : "text-amber-400";

  return (
    <div className="glass rounded-2xl p-4">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
        <div>
          <h2 className="text-sm font-bold text-white">{t.title}</h2>
          <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">{t.subtitle}</p>
        </div>
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

      {/* 범례 */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-slate-400 inline-block rounded" />
          <span className="text-[10px] text-[var(--fg-muted)]">{t.btcPrice} <span className="text-white/30">(상단)</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-0.5 w-4 inline-block rounded ${latestPremium != null && latestPremium >= 10 ? "bg-rose-400" : latestPremium != null && latestPremium < -2 ? "bg-blue-400" : "bg-amber-400"}`} />
          <span className="text-[10px] text-[var(--fg-muted)]">{t.kimchi} <span className="text-white/30">(하단)</span></span>
        </div>
        {/* 크로스헤어 툴팁 */}
        {tooltip && (
          <div className="ml-auto flex items-center gap-3 text-[10px]">
            <span className="text-[var(--fg-muted)]">{tooltip.date}</span>
            <span className="text-slate-300">₩{tooltip.btc.toLocaleString()}</span>
            <span className={premiumColor}>{fmt(parseFloat(tooltip.premium.toFixed(2)))}</span>
          </div>
        )}
      </div>

      {/* 통계 */}
      {stats && !loading && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: t.maxPremium, value: stats.max, color: "text-rose-400" },
            { label: t.avgPremium, value: stats.avg, color: "text-amber-400" },
            { label: t.minPremium, value: stats.min, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/4 border border-white/5 px-3 py-2 text-center">
              <p className={`text-sm font-bold font-number ${s.color}`}>{fmt(s.value)}</p>
              <p className="text-[10px] text-[var(--fg-muted)] mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* 차트 */}
      <div className="relative" style={{ height: 320 }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-sm text-[var(--fg-muted)]">{t.loading}</span>
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-sm text-[var(--fg-muted)]">{t.empty}</span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      <p className="mt-2 text-[10px] text-[var(--fg-muted)] text-right">{t.source}</p>
    </div>
  );
}
