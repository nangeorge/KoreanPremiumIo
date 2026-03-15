/**
 * Main screen — Kimchi Premium table.
 * Auto-refreshes every 5 seconds via SWR.
 * Checks alerts on every refresh.
 */
import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import useSWR from 'swr';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppStore } from '../../src/store';
import { swrFetcher, pricesKey } from '../../src/api/prices';
import type { PriceResponse, CoinPrice } from '../../src/types';
import { CoinRow } from '../../src/components/CoinRow';
import { StatsBar } from '../../src/components/StatsBar';
import { formatUpdatedAt } from '../../src/utils/format';
import { checkAndSendAlerts } from '../../src/services/notifications';

const REFRESH_INTERVAL = 5_000; // 5 seconds

const HEADER_LABELS = {
  ko: {
    title: '김치 프리미엄',
    subtitle: '실시간 업비트 vs 해외 거래소',
    live: '실시간',
    exchange: '거래소',
    binance: '바이낸스',
    coinbase: '코인베이스',
    coin: '코인',
    price: '업비트 가격',
    premium: '프리미엄',
    change: '24h 변동',
    langBtn: 'EN',
  },
  en: {
    title: 'Kimchi Premium',
    subtitle: 'Upbit vs Global Exchanges',
    live: 'LIVE',
    exchange: 'Exchange',
    binance: 'Binance',
    coinbase: 'Coinbase',
    coin: 'Coin',
    price: 'Upbit Price',
    premium: 'Premium',
    change: '24h Change',
    langBtn: 'KO',
  },
  zh: {
    title: '泡菜溢价',
    subtitle: 'Upbit vs 海外交易所',
    live: '实时',
    exchange: '交易所',
    binance: '币安',
    coinbase: 'Coinbase',
    coin: '币种',
    price: 'Upbit价格',
    premium: '溢价',
    change: '24h涨跌',
    langBtn: '한',
  },
} as const;

export default function HomeScreen() {
  const {
    coins,
    exchangeRate,
    updatedAt,
    language,
    selectedExchange,
    alerts,
    setCoins,
    setSelectedExchange,
    setLanguage,
    updateAlertTriggered,
  } = useAppStore();

  const t = HEADER_LABELS[language];
  const liveDotAnim = useRef(new Animated.Value(1)).current;

  // ─── SWR data fetching ─────────────────────────────────────────────────────

  const { data, error, isValidating, mutate } = useSWR<PriceResponse>(
    pricesKey(),
    swrFetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: true,
      errorRetryCount: 3,
      errorRetryInterval: 3_000,
      dedupingInterval: 4_000,
    },
  );

  // Sync SWR data into Zustand store + check alerts
  useEffect(() => {
    if (data) {
      setCoins(data.coins, data.exchangeRate.usdKrw, data.updatedAt);

      // Check alerts in the foreground
      if (alerts.length > 0) {
        checkAndSendAlerts(data.coins, alerts, updateAlertTriggered).catch(
          () => {},
        );
      }
    }
  }, [data, alerts, setCoins, updateAlertTriggered]);

  // ─── Live dot pulse animation ──────────────────────────────────────────────

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(liveDotAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [liveDotAnim]);

  // ─── Language cycler ──────────────────────────────────────────────────────

  const cycleLanguage = useCallback(() => {
    const order: Array<typeof language> = ['ko', 'en', 'zh'];
    const next = order[(order.indexOf(language) + 1) % order.length];
    setLanguage(next);
  }, [language, setLanguage]);

  // ─── Renderers ────────────────────────────────────────────────────────────

  const renderCoinRow = useCallback(
    ({ item, index }: { item: CoinPrice; index: number }) => (
      <CoinRow
        coin={item}
        rank={index + 1}
        language={language}
        selectedExchange={selectedExchange}
      />
    ),
    [language, selectedExchange],
  );

  const keyExtractor = useCallback((item: CoinPrice) => item.symbol, []);

  const ListHeader = (
    <View>
      {/* Hero header */}
      <LinearGradient
        colors={['#0f0f1e', '#111128', '#0a0a18']}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroEmoji}>🌶️</Text>
            <View>
              <Text style={styles.heroTitle}>{t.title}</Text>
              <Text style={styles.heroSubtitle}>{t.subtitle}</Text>
            </View>
          </View>

          {/* Language + Live indicator */}
          <View style={styles.heroRight}>
            <TouchableOpacity onPress={cycleLanguage} style={styles.langButton}>
              <Text style={styles.langButtonText}>{t.langBtn}</Text>
            </TouchableOpacity>
            <View style={styles.liveBadge}>
              <Animated.View
                style={[styles.liveDot, { opacity: liveDotAnim }]}
              />
              <Text style={styles.liveText}>{t.live}</Text>
            </View>
          </View>
        </View>

        {/* Exchange selector */}
        <View style={styles.exchangeRow}>
          <TouchableOpacity
            style={[
              styles.exchangeBtn,
              selectedExchange === 'binance' && styles.exchangeBtnActive,
            ]}
            onPress={() => setSelectedExchange('binance')}
          >
            <Text
              style={[
                styles.exchangeBtnText,
                selectedExchange === 'binance' && styles.exchangeBtnTextActive,
              ]}
            >
              🌏 {t.binance}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.exchangeBtn,
              selectedExchange === 'coinbase' && styles.exchangeBtnActive,
            ]}
            onPress={() => setSelectedExchange('coinbase')}
          >
            <Text
              style={[
                styles.exchangeBtnText,
                selectedExchange === 'coinbase' && styles.exchangeBtnTextActive,
              ]}
            >
              🇺🇸 {t.coinbase}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last updated */}
        {updatedAt && (
          <Text style={styles.updatedAt}>
            {formatUpdatedAt(updatedAt, language)}
          </Text>
        )}
      </LinearGradient>

      {/* Stats bar */}
      <View style={styles.statsWrapper}>
        <StatsBar />
      </View>

      {/* Column headers */}
      <View style={styles.colHeaders}>
        <Text style={[styles.colHeader, { width: 20 }]}>#</Text>
        <Text style={[styles.colHeader, { flex: 2 }]}>{t.coin}</Text>
        <Text style={[styles.colHeader, { flex: 2, textAlign: 'right' }]}>{t.price}</Text>
        <Text style={[styles.colHeader, { flex: 1.5, textAlign: 'right' }]}>{t.premium}</Text>
        <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>{t.change}</Text>
      </View>
    </View>
  );

  // ─── Error state ──────────────────────────────────────────────────────────

  if (error && coins.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>
            {language === 'ko'
              ? '데이터를 불러올 수 없습니다'
              : language === 'zh'
              ? '无法加载数据'
              : 'Failed to load data'}
          </Text>
          <Text style={styles.errorSubtitle}>
            {language === 'ko'
              ? '네트워크 연결을 확인해주세요'
              : language === 'zh'
              ? '请检查网络连接'
              : 'Check your network connection'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => mutate()}>
            <Text style={styles.retryText}>
              {language === 'ko' ? '다시 시도' : language === 'zh' ? '重试' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Loading skeleton ─────────────────────────────────────────────────────

  const showSkeleton = coins.length === 0 && !error;

  return (
    <SafeAreaView style={styles.safeArea}>
      {showSkeleton ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>
            {language === 'ko' ? '데이터 로딩 중...' : language === 'zh' ? '加载中...' : 'Loading...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={coins}
          renderItem={renderCoinRow}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isValidating && coins.length > 0}
              onRefresh={() => mutate()}
              tintColor="#6366f1"
              colors={['#6366f1']}
            />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroEmoji: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e8e8f0',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  heroRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  langButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.3)',
    backgroundColor: 'rgba(249,115,22,0.1)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f97316',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f97316',
    letterSpacing: 0.8,
  },
  exchangeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  exchangeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  exchangeBtnActive: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,0.15)',
  },
  exchangeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  exchangeBtnTextActive: {
    color: '#a5b4fc',
  },
  updatedAt: {
    fontSize: 11,
    color: '#4b5563',
    alignSelf: 'flex-end',
  },
  statsWrapper: {
    marginTop: 12,
    marginBottom: 4,
  },
  colHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4b5563',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e8e8f0',
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#6366f1',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
