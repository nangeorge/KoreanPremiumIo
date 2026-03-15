import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { CoinPrice } from '../types';
import type { Language, SelectedExchange } from '../types';
import { formatKrw, formatUsd, formatChange, getChangeColor } from '../utils/format';
import { PremiumBadge } from './PremiumBadge';

interface CoinRowProps {
  coin: CoinPrice;
  rank: number;
  language: Language;
  selectedExchange: SelectedExchange;
  onPress?: (coin: CoinPrice) => void;
}

export const CoinRow = React.memo(function CoinRow({
  coin,
  rank,
  language,
  selectedExchange,
  onPress,
}: CoinRowProps) {
  const premium =
    selectedExchange === 'coinbase' ? coin.coinbasePremium : coin.premium;
  const foreignPriceKrw =
    selectedExchange === 'coinbase' ? coin.coinbasePriceKrw : coin.binancePriceKrw;
  const foreignPriceUsd =
    selectedExchange === 'coinbase' ? coin.coinbasePrice : coin.binancePrice;

  const changeColor = getChangeColor(coin.change24h);
  const [imgError, setImgError] = useState(false);

  // Flash animation when upbitPrice changes
  const flashAnim = useRef(new Animated.Value(0)).current;
  const prevPrice = useRef(coin.upbitPrice);

  useEffect(() => {
    if (prevPrice.current !== coin.upbitPrice && prevPrice.current !== 0) {
      const isUp = coin.upbitPrice > prevPrice.current;
      flashAnim.setValue(isUp ? 1 : -1);
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
    prevPrice.current = coin.upbitPrice;
  }, [coin.upbitPrice, flashAnim]);

  const upbitPriceColor = flashAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['#ef4444', '#e8e8f0', '#10b981'],
  });

  const coinName =
    language === 'ko'
      ? coin.nameKo
      : language === 'zh'
      ? coin.nameZh
      : coin.name;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(coin)}
      activeOpacity={0.75}
      style={styles.row}
    >
      {/* Rank */}
      <Text style={styles.rank}>{rank}</Text>

      {/* Logo + Name */}
      <View style={styles.coinInfo}>
        <View style={styles.logoContainer}>
          {imgError || !coin.logoUrl ? (
            // Fallback: show the coin's first letter in a colored circle
            <View style={[styles.logo, styles.logoFallback]}>
              <Text style={styles.logoFallbackText}>
                {coin.symbol.charAt(0)}
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: coin.logoUrl }}
              style={styles.logo}
              onError={() => setImgError(true)}
            />
          )}
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.symbol}>{coin.symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {coinName}
          </Text>
        </View>
      </View>

      {/* Upbit Price (KRW) */}
      <View style={styles.priceBlock}>
        <Animated.Text style={[styles.upbitPrice, { color: upbitPriceColor }]}>
          {formatKrw(coin.upbitPrice, language)}
        </Animated.Text>
        <Text style={styles.foreignPrice}>{formatUsd(foreignPriceUsd)}</Text>
      </View>

      {/* Premium badge */}
      <View style={styles.premiumBlock}>
        <PremiumBadge value={premium} size="sm" />
      </View>

      {/* 24h change */}
      <Text style={[styles.change, { color: changeColor }]}>
        {formatChange(coin.change24h)}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    gap: 8,
  },
  rank: {
    width: 20,
    fontSize: 11,
    color: '#4b5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  coinInfo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  logoFallback: {
    backgroundColor: 'rgba(99,102,241,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoFallbackText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#a5b4fc',
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
  },
  symbol: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e8e8f0',
    letterSpacing: 0.3,
  },
  name: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 1,
  },
  priceBlock: {
    flex: 2,
    alignItems: 'flex-end',
    minWidth: 0,
  },
  upbitPrice: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: '#e8e8f0',
  },
  foreignPrice: {
    fontSize: 10,
    color: '#4b5563',
    fontVariant: ['tabular-nums'],
    marginTop: 1,
  },
  premiumBlock: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  change: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
});
