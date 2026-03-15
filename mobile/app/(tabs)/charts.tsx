/**
 * Charts screen — BTC price line chart with interval selector.
 * Uses victory-native for rendering (compatible with Expo managed workflow).
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryArea, VictoryTooltip, VictoryVoronoiContainer } from 'victory-native';
import useSWR from 'swr';
import { useAppStore } from '../../src/store';
import { swrFetcher, candlesKey } from '../../src/api/prices';
import type { CandleResponse, CandleInterval } from '../../src/types';
import { formatKrw, formatUsd } from '../../src/utils/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 260;

const INTERVAL_OPTIONS: { value: CandleInterval; labelKo: string; labelEn: string; labelZh: string }[] = [
  { value: '1h', labelKo: '1시간', labelEn: '1H', labelZh: '1H' },
  { value: '4h', labelKo: '4시간', labelEn: '4H', labelZh: '4H' },
  { value: '1d', labelKo: '1일', labelEn: '1D', labelZh: '1D' },
  { value: '1w', labelKo: '1주', labelEn: '1W', labelZh: '1W' },
];

const SCREEN_LABELS = {
  ko: {
    title: 'BTC 차트',
    btcPrice: 'BTC 가격',
    premium: '프리미엄',
    loading: '차트 로딩 중...',
    error: '차트를 불러올 수 없습니다',
    retry: '다시 시도',
    upbit: '업비트',
    binance: '바이낸스',
    coinbase: '코인베이스',
    noData: '데이터 없음',
    high: '고가',
    low: '저가',
    open: '시가',
    close: '종가',
  },
  en: {
    title: 'BTC Chart',
    btcPrice: 'BTC Price',
    premium: 'Premium',
    loading: 'Loading chart...',
    error: 'Failed to load chart',
    retry: 'Retry',
    upbit: 'Upbit',
    binance: 'Binance',
    coinbase: 'Coinbase',
    noData: 'No data',
    high: 'High',
    low: 'Low',
    open: 'Open',
    close: 'Close',
  },
  zh: {
    title: 'BTC图表',
    btcPrice: 'BTC价格',
    premium: '溢价',
    loading: '加载图表...',
    error: '无法加载图表',
    retry: '重试',
    upbit: 'Upbit',
    binance: '币安',
    coinbase: 'Coinbase',
    noData: '无数据',
    high: '高',
    low: '低',
    open: '开',
    close: '收',
  },
} as const;

type ChartType = 'btc' | 'premium';

export default function ChartsScreen() {
  const { language, selectedExchange } = useAppStore();
  const t = SCREEN_LABELS[language];
  const [interval, setInterval] = useState<CandleInterval>('1d');
  const [chartType, setChartType] = useState<ChartType>('btc');

  const exchange = chartType === 'premium'
    ? (selectedExchange === 'coinbase' ? 'coinbase' : 'binance')
    : 'binance';

  const candleKeyStr = candlesKey({ interval, type: chartType, exchange });

  const { data, error, isValidating, mutate } = useSWR<CandleResponse>(
    candleKeyStr,
    swrFetcher,
    {
      revalidateOnFocus: true,
      errorRetryCount: 2,
    },
  );

  const getIntervalLabel = (opt: typeof INTERVAL_OPTIONS[number]) => {
    if (language === 'ko') return opt.labelKo;
    if (language === 'zh') return opt.labelZh;
    return opt.labelEn;
  };

  // Prepare chart data
  const chartData = data?.candles
    ? data.candles.map((c) => ({
        x: new Date(c.time),
        y: c.close,
      }))
    : [];

  const lastCandle = data?.candles?.at(-1);
  const firstCandle = data?.candles?.[0];

  const priceChange =
    lastCandle && firstCandle
      ? ((lastCandle.close - firstCandle.close) / firstCandle.close) * 100
      : null;

  const isUp = priceChange !== null && priceChange >= 0;
  const lineColor = isUp ? '#10b981' : '#ef4444';
  const areaGradientColor = isUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)';

  const formatYAxis = useCallback(
    (val: number) => {
      if (chartType === 'premium') return `${val.toFixed(1)}%`;
      if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
      if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
      return `$${val.toFixed(0)}`;
    },
    [chartType],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.title}</Text>
        </View>

        {/* Chart type toggle */}
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, chartType === 'btc' && styles.typeBtnActive]}
            onPress={() => setChartType('btc')}
          >
            <Text style={[styles.typeBtnText, chartType === 'btc' && styles.typeBtnTextActive]}>
              📊 {t.btcPrice}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, chartType === 'premium' && styles.typeBtnActive]}
            onPress={() => setChartType('premium')}
          >
            <Text style={[styles.typeBtnText, chartType === 'premium' && styles.typeBtnTextActive]}>
              🌶️ {t.premium}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interval selector */}
        <View style={styles.intervalRow}>
          {INTERVAL_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.intervalBtn,
                interval === opt.value && styles.intervalBtnActive,
              ]}
              onPress={() => setInterval(opt.value)}
            >
              <Text
                style={[
                  styles.intervalText,
                  interval === opt.value && styles.intervalTextActive,
                ]}
              >
                {getIntervalLabel(opt)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart card */}
        <View style={styles.chartCard}>
          {/* Price summary */}
          {lastCandle && (
            <View style={styles.priceSummary}>
              <Text style={styles.currentPrice}>
                {chartType === 'premium'
                  ? `${lastCandle.close >= 0 ? '+' : ''}${lastCandle.close.toFixed(2)}%`
                  : formatUsd(lastCandle.close)}
              </Text>
              {priceChange !== null && (
                <View
                  style={[
                    styles.changeBadge,
                    {
                      backgroundColor: isUp
                        ? 'rgba(16,185,129,0.15)'
                        : 'rgba(239,68,68,0.15)',
                    },
                  ]}
                >
                  <Text style={{ color: isUp ? '#10b981' : '#ef4444', fontSize: 13, fontWeight: '600' }}>
                    {isUp ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* OHLC mini row */}
          {lastCandle && (
            <View style={styles.ohlcRow}>
              <OHLCItem label={t.open} value={formatUsd(lastCandle.open)} />
              <OHLCItem label={t.high} value={formatUsd(lastCandle.high)} color="#10b981" />
              <OHLCItem label={t.low} value={formatUsd(lastCandle.low)} color="#ef4444" />
              <OHLCItem label={t.close} value={formatUsd(lastCandle.close)} />
            </View>
          )}

          {/* Chart */}
          {isValidating && chartData.length === 0 ? (
            <View style={styles.chartLoading}>
              <ActivityIndicator color="#6366f1" />
              <Text style={styles.loadingText}>{t.loading}</Text>
            </View>
          ) : error ? (
            <View style={styles.chartLoading}>
              <Text style={styles.errorText}>{t.error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => mutate()}>
                <Text style={styles.retryText}>{t.retry}</Text>
              </TouchableOpacity>
            </View>
          ) : chartData.length === 0 ? (
            <View style={styles.chartLoading}>
              <Text style={styles.noDataText}>{t.noData}</Text>
            </View>
          ) : (
            <VictoryChart
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              theme={VictoryTheme.material}
              padding={{ top: 16, bottom: 40, left: 60, right: 16 }}
              containerComponent={
                <VictoryVoronoiContainer
                  voronoiDimension="x"
                  labels={({ datum }) =>
                    chartType === 'premium'
                      ? `${datum.y.toFixed(2)}%`
                      : formatUsd(datum.y)
                  }
                  labelComponent={
                    <VictoryTooltip
                      style={{ fontSize: 10, fill: '#e8e8f0' }}
                      flyoutStyle={{
                        fill: '#1a1a2e',
                        stroke: 'rgba(255,255,255,0.12)',
                        strokeWidth: 1,
                      }}
                    />
                  }
                />
              }
            >
              <VictoryAxis
                style={{
                  axis: { stroke: 'rgba(255,255,255,0.08)' },
                  tickLabels: { fill: '#4b5563', fontSize: 9 },
                  grid: { stroke: 'transparent' },
                }}
                tickFormat={(t) => {
                  const d = new Date(t);
                  if (interval === '1h' || interval === '4h') {
                    return `${d.getHours()}:00`;
                  }
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                tickCount={5}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: { stroke: 'transparent' },
                  tickLabels: { fill: '#4b5563', fontSize: 9 },
                  grid: { stroke: 'rgba(255,255,255,0.04)', strokeDasharray: '4,4' },
                }}
                tickFormat={formatYAxis}
                tickCount={5}
              />
              <VictoryArea
                data={chartData}
                style={{
                  data: {
                    fill: areaGradientColor,
                    stroke: lineColor,
                    strokeWidth: 2,
                  },
                }}
                interpolation="monotoneX"
                animate={{ duration: 400 }}
              />
            </VictoryChart>
          )}
        </View>

        {/* Exchange context note */}
        <Text style={styles.exchangeNote}>
          {chartType === 'btc'
            ? `${language === 'ko' ? '데이터 소스' : language === 'zh' ? '数据来源' : 'Data source'}: ${t.binance}`
            : `${language === 'ko' ? '비교 대상' : language === 'zh' ? '对比' : 'vs'}: ${selectedExchange === 'coinbase' ? t.coinbase : t.binance}`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function OHLCItem({ label, value, color = '#6b7280' }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.ohlcItem}>
      <Text style={styles.ohlcLabel}>{label}</Text>
      <Text style={[styles.ohlcValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#e8e8f0',
  },
  typeRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: 'rgba(99,102,241,0.2)',
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  typeBtnTextActive: {
    color: '#a5b4fc',
  },
  intervalRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  intervalBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  intervalBtnActive: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,0.15)',
  },
  intervalText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
  },
  intervalTextActive: {
    color: '#6366f1',
  },
  chartCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    overflow: 'hidden',
  },
  priceSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e8e8f0',
    fontVariant: ['tabular-nums'],
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ohlcRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  ohlcItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  ohlcLabel: {
    fontSize: 9,
    color: '#4b5563',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ohlcValue: {
    fontSize: 10,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  chartLoading: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
  },
  noDataText: {
    fontSize: 14,
    color: '#4b5563',
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  exchangeNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#374151',
    marginTop: 12,
  },
});
