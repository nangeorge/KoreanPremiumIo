import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store';
import { formatExchangeRate, formatPremium } from '../utils/format';

const LABELS = {
  ko: {
    avgPremium: '평균 프리미엄',
    exchangeRate: '환율 (USD/KRW)',
    coins: '코인 수',
    binance: '바이낸스',
    coinbase: '코인베이스',
  },
  en: {
    avgPremium: 'Avg Premium',
    exchangeRate: 'USD/KRW Rate',
    coins: 'Coins',
    binance: 'Binance',
    coinbase: 'Coinbase',
  },
  zh: {
    avgPremium: '平均溢价',
    exchangeRate: '汇率 (USD/KRW)',
    coins: '币种',
    binance: '币安',
    coinbase: 'Coinbase',
  },
} as const;

export function StatsBar() {
  const { coins, exchangeRate, selectedExchange, language } = useAppStore();
  const t = LABELS[language];

  const premiums = coins.map((c) =>
    selectedExchange === 'coinbase' ? c.coinbasePremium : c.premium,
  );

  const avg =
    premiums.length > 0
      ? premiums.reduce((sum, p) => sum + p, 0) / premiums.length
      : 0;

  const avgColor =
    avg > 0.5 ? '#10b981' : avg < -0.5 ? '#ef4444' : '#6b7280';

  const exchangeLabel =
    selectedExchange === 'coinbase' ? t.coinbase : t.binance;

  return (
    <View style={styles.container}>
      <StatItem
        label={`${t.avgPremium} (${exchangeLabel})`}
        value={coins.length === 0 ? '—' : formatPremium(avg)}
        valueColor={avgColor}
      />
      <View style={styles.divider} />
      <StatItem
        label={t.exchangeRate}
        value={exchangeRate > 0 ? `₩${formatExchangeRate(exchangeRate)}` : '—'}
        valueColor="#e8e8f0"
      />
      <View style={styles.divider} />
      <StatItem
        label={t.coins}
        value={String(coins.length)}
        valueColor="#6366f1"
      />
    </View>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  valueColor: string;
}

function StatItem({ label, value, valueColor }: StatItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 2,
  },
});
