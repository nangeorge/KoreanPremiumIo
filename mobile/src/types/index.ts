// ─── Coin & Price Types ───────────────────────────────────────────────────────

export interface CoinPrice {
  symbol: string;
  name: string;
  nameKo: string;
  nameZh: string;
  upbitPrice: number;       // KRW
  binancePrice: number;     // USD
  binancePriceKrw: number;  // USD × exchangeRate
  coinbasePrice: number;    // USD
  coinbasePriceKrw: number; // USD × exchangeRate
  premium: number;          // vs Binance, percentage
  coinbasePremium: number;  // vs Coinbase, percentage
  change24h: number;        // percentage
  volume24h: number;        // KRW
  logoUrl: string;
}

export interface ExchangeRate {
  usdKrw: number;
  timestamp: number;
}

export interface PriceResponse {
  coins: CoinPrice[];
  exchangeRate: ExchangeRate;
  updatedAt: number;
}

// ─── Candle Types ─────────────────────────────────────────────────────────────

export type CandleInterval = '1h' | '4h' | '1d' | '1w';
export type CandleType = 'btc' | 'premium';
export type Exchange = 'upbit' | 'binance' | 'coinbase';
export type SelectedExchange = 'binance' | 'coinbase';

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandleResponse {
  candles: CandleData[];
  interval: CandleInterval;
  type: CandleType;
  exchange: Exchange;
}

// ─── Indicator Types ──────────────────────────────────────────────────────────

export interface IndicatorResponse {
  fearGreedIndex?: { value: number; classification: string };
  dominance?: { btc: number; eth: number };
  funding?: Record<string, number>;
  openInterest?: Record<string, number>;
  updatedAt: number;
}

// ─── Alert Types ─────────────────────────────────────────────────────────────

export interface Alert {
  id: string;
  symbol: string;
  threshold: number;
  direction: 'above' | 'below';
  enabled: boolean;
  exchange: SelectedExchange;
  createdAt: number;
  lastTriggeredAt?: number;
}

// ─── Language / i18n ─────────────────────────────────────────────────────────

export type Language = 'ko' | 'en' | 'zh';

// ─── Supported coins (matches web app) ───────────────────────────────────────

export const SUPPORTED_COINS = [
  { symbol: 'BTC',  name: 'Bitcoin',   nameKo: '비트코인',  nameZh: '比特币'   },
  { symbol: 'ETH',  name: 'Ethereum',  nameKo: '이더리움',  nameZh: '以太坊'   },
  { symbol: 'XRP',  name: 'XRP',       nameKo: '리플',      nameZh: '瑞波币'   },
  { symbol: 'SOL',  name: 'Solana',    nameKo: '솔라나',    nameZh: '索拉纳'   },
  { symbol: 'ADA',  name: 'Cardano',   nameKo: '에이다',    nameZh: '卡尔达诺' },
  { symbol: 'DOGE', name: 'Dogecoin',  nameKo: '도지코인',  nameZh: '狗狗币'   },
  { symbol: 'POL',  name: 'Polygon',   nameKo: '폴리곤',    nameZh: 'Polygon'  },
  { symbol: 'LINK', name: 'Chainlink', nameKo: '체인링크',  nameZh: '链环'     },
  { symbol: 'DOT',  name: 'Polkadot',  nameKo: '폴카닷',    nameZh: '波卡'     },
  { symbol: 'AVAX', name: 'Avalanche', nameKo: '아발란체',  nameZh: '雪崩'     },
] as const;

export type SupportedSymbol = (typeof SUPPORTED_COINS)[number]['symbol'];

// ─── Store Shape ──────────────────────────────────────────────────────────────

export interface AppState {
  coins: CoinPrice[];
  exchangeRate: number;
  updatedAt: number | null;
  language: Language;
  selectedExchange: SelectedExchange;
  alerts: Alert[];
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  setCoins: (coins: CoinPrice[], exchangeRate: number, updatedAt: number) => void;
  setLanguage: (language: Language) => void;
  setSelectedExchange: (exchange: SelectedExchange) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  updateAlertTriggered: (id: string) => void;
  setIsPremium: (isPremium: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}
