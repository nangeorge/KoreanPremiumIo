import { create } from "zustand";
import type { CoinPrice, PremiumHistoryPoint, SortField, SortDirection, AlertConfig, Exchange } from "@/types";

const FAVORITES_KEY = "kp_favorites";

interface AppState {
  // Data
  coins: CoinPrice[];
  exchangeRate: number;
  updatedAt: number | null;
  history: PremiumHistoryPoint[];

  // UI
  sortField: SortField;
  sortDirection: SortDirection;
  selectedSymbol: string | null;
  selectedExchange: Exchange;
  isLoading: boolean;
  error: string | null;

  // Alerts
  alerts: AlertConfig[];

  // Favorites (watchlist)
  favorites: string[];

  // Actions
  setCoins: (coins: CoinPrice[], exchangeRate: number, updatedAt: number) => void;
  appendHistory: (points: PremiumHistoryPoint[]) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (dir: SortDirection) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  setSelectedExchange: (exchange: Exchange) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAlert: (alert: AlertConfig) => void;
  removeAlert: (symbol: string) => void;
  toggleFavorite: (symbol: string) => void;
  initFavorites: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  coins: [],
  exchangeRate: 0,
  updatedAt: null,
  history: [],
  sortField: "marketCap",
  sortDirection: "asc",
  selectedSymbol: "BTC",
  selectedExchange: "binance",
  isLoading: true,
  error: null,
  alerts: [],
  favorites: [],

  setCoins: (newCoins, exchangeRate, updatedAt) =>
    set((state) => {
      // newCoins 순서(= SUPPORTED_COINS 순서)를 기준으로 머지
      // Upbit 일시 실패로 일부 코인이 누락된 경우 → 기존 데이터 뒤에 유지
      const newMap = new Map(newCoins.map((c) => [c.symbol, c]));
      const stale = state.coins.filter((c) => !newMap.has(c.symbol));
      return { coins: [...newCoins, ...stale], exchangeRate, updatedAt, isLoading: false, error: null };
    }),

  appendHistory: (points) =>
    set((state) => {
      const next = state.history.concat(points);
      return { history: next.length > 200 ? next.slice(next.length - 200) : next };
    }),

  setSortField: (sortField) => set({ sortField }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
  setSelectedExchange: (selectedExchange) => set({ selectedExchange }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [...state.alerts.filter((a) => a.symbol !== alert.symbol), alert],
    })),
  removeAlert: (symbol) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.symbol !== symbol) })),

  toggleFavorite: (symbol) =>
    set((state) => {
      const next = state.favorites.includes(symbol)
        ? state.favorites.filter((s) => s !== symbol)
        : [...state.favorites, symbol];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return { favorites: next };
    }),

  initFavorites: () => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) set({ favorites: JSON.parse(raw) });
    } catch { /* ignore */ }
  },
}));
