/**
 * API functions for fetching price and candle data.
 * The BASE_URL comes from the environment variable EXPO_PUBLIC_API_BASE_URL,
 * which must be set to the deployed Next.js web app URL (no trailing slash).
 *
 * No secrets live here — all config from env vars.
 */

import Constants from 'expo-constants';
import { apiGet, buildQueryString } from './client';
import type {
  PriceResponse,
  CandleInterval,
  CandleType,
  Exchange,
  CandleResponse,
  IndicatorResponse,
} from '../types';

/**
 * Resolve the API base URL.
 * Falls back through: env var → expoConfig extra → empty string (will throw on use).
 */
function getBaseUrl(): string {
  // EXPO_PUBLIC_ vars are inlined at build time by Expo
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  // Fallback: read from app.json extra (useful for managed workflow OTA)
  const fromConfig = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;
  if (fromConfig) return fromConfig.replace(/\/$/, '');

  if (__DEV__) {
    console.warn('[API] EXPO_PUBLIC_API_BASE_URL is not set. Requests will fail.');
  }
  return '';
}

// Memoize so we don't re-evaluate every call
let _baseUrl: string | null = null;
function baseUrl(): string {
  if (_baseUrl === null) _baseUrl = getBaseUrl();
  return _baseUrl;
}

// ─── Prices ──────────────────────────────────────────────────────────────────

/**
 * Fetch the current prices and exchange rate for all supported coins.
 * GET /api/prices
 */
export async function fetchPrices(): Promise<PriceResponse> {
  const url = `${baseUrl()}/api/prices`;
  const data = await apiGet<PriceResponse>(url);

  // Defensive validation: ensure the response has the expected shape
  if (!data || !Array.isArray(data.coins)) {
    throw new Error('Invalid price response: missing coins array');
  }
  if (typeof data.exchangeRate?.usdKrw !== 'number') {
    throw new Error('Invalid price response: missing exchangeRate.usdKrw');
  }

  return data;
}

// ─── Candles ─────────────────────────────────────────────────────────────────

export interface FetchCandlesOptions {
  interval: CandleInterval;
  type: CandleType;
  exchange?: Exchange;
}

/**
 * Fetch OHLCV candle data.
 * GET /api/candles?interval=1h|4h|1d|1w&type=btc|premium&exchange=upbit|binance|coinbase
 */
export async function fetchCandles(options: FetchCandlesOptions): Promise<CandleResponse> {
  const qs = buildQueryString({
    interval: options.interval,
    type: options.type,
    exchange: options.exchange,
  });
  const url = `${baseUrl()}/api/candles${qs}`;
  const data = await apiGet<CandleResponse>(url);

  if (!data || !Array.isArray(data.candles)) {
    throw new Error('Invalid candle response: missing candles array');
  }

  return data;
}

// ─── Indicators ──────────────────────────────────────────────────────────────

/**
 * Fetch market indicators (Fear & Greed, dominance, funding rates, etc.)
 * GET /api/indicators
 */
export async function fetchIndicators(): Promise<IndicatorResponse> {
  const url = `${baseUrl()}/api/indicators`;
  const data = await apiGet<IndicatorResponse>(url);

  if (!data || typeof data.updatedAt !== 'number') {
    throw new Error('Invalid indicator response: missing updatedAt');
  }

  return data;
}

// ─── SWR fetcher helpers ──────────────────────────────────────────────────────

/**
 * Generic SWR fetcher that proxies through apiGet.
 * Usage: useSWR('/api/prices', swrFetcher)
 * Note: the key must already be the full HTTPS URL when using this fetcher.
 */
export async function swrFetcher<T>(url: string): Promise<T> {
  return apiGet<T>(url);
}

/**
 * Build a full URL key for SWR usage.
 */
export function pricesKey(): string {
  return `${baseUrl()}/api/prices`;
}

export function candlesKey(options: FetchCandlesOptions): string {
  const qs = buildQueryString({
    interval: options.interval,
    type: options.type,
    exchange: options.exchange,
  });
  return `${baseUrl()}/api/candles${qs}`;
}

export function indicatorsKey(): string {
  return `${baseUrl()}/api/indicators`;
}
