import { create } from "zustand";
import type { CoinPrice, PremiumHistoryPoint, SortField, SortDirection, AlertConfig, Exchange } from "@/types";

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
}

export const useAppStore = create<AppState>((set) => ({
  coins: [],
  exchangeRate: 0,
  updatedAt: null,
  history: [],
  sortField: "default",
  sortDirection: "asc",
  selectedSymbol: "BTC",
  selectedExchange: "coinbase",
  isLoading: true,
  error: null,
  alerts: [],

  setCoins: (coins, exchangeRate, updatedAt) =>
    set({ coins, exchangeRate, updatedAt, isLoading: false, error: null }),

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
}));
