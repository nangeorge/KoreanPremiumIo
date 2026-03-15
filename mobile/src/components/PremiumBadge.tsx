import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPremiumColor } from '../utils/format';

interface PremiumBadgeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumBadge({ value, size = 'md' }: PremiumBadgeProps) {
  const color = getPremiumColor(value);
  const isPositive = value > 0;
  const isNegative = value < 0;

  const fontSize = size === 'sm' ? 11 : size === 'lg' ? 15 : 13;
  const paddingH = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const paddingV = size === 'sm' ? 2 : size === 'lg' ? 5 : 3;

  const bgColor = isPositive
    ? 'rgba(16, 185, 129, 0.15)'
    : isNegative
    ? 'rgba(239, 68, 68, 0.15)'
    : 'rgba(107, 114, 128, 0.15)';

  const borderColor = isPositive
    ? 'rgba(16, 185, 129, 0.3)'
    : isNegative
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(107, 114, 128, 0.3)';

  const sign = isPositive ? '+' : '';
  const label = `${sign}${value.toFixed(2)}%`;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
        },
      ]}
    >
      <Text style={[styles.text, { color, fontSize }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
  },
});
