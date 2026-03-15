/**
 * Global Zustand store.
 *
 * Persistence strategy (security-first):
 *  - We do NOT use zustand/middleware/persist because it defaults to AsyncStorage,
 *    which is unencrypted and readable by anyone with file-system access on a
 *    rooted/jailbroken device.
 *  - Instead, we manually persist sensitive fields (alerts, language,
 *    selectedExchange) to expo-secure-store, which is backed by the platform
 *    Keychain (iOS) or EncryptedSharedPreferences (Android).
 *  - Non-sensitive runtime state (coins, isLoading, etc.) is in-memory only.
 *
 * Hydration:
 *  Call `hydrateStore()` once at app startup (in _layout.tsx) before rendering
 *  the navigator. It reads persisted values from SecureStore and populates
 *  the store. It's async but the app can render with defaults while it runs.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { getLocales } from 'expo-localization';
import type { AppState, Alert, CoinPrice, Language, SelectedExchange } from '../types';

// ─── SecureStore keys ─────────────────────────────────────────────────────────

const STORE_ALERTS_KEY = 'kp_alerts';
const STORE_LANGUAGE_KEY = 'kp_language';
const STORE_EXCHANGE_KEY = 'kp_exchange';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectDeviceLanguage(): Language {
  try {
    const locales = getLocales();
    const tag = locales[0]?.languageTag ?? 'en';
    if (tag.startsWith('ko')) return 'ko';
    if (tag.startsWith('zh')) return 'zh';
    return 'en';
  } catch {
    return 'en';
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  // Runtime state (in-memory only)
  coins: [],
  exchangeRate: 0,
  updatedAt: null,
  isLoading: false,
  error: null,

  // Persisted state (defaults — overwritten by hydrateStore)
  language: detectDeviceLanguage(),
  selectedExchange: 'binance',
  alerts: [],
  isPremium: false,

  // ─── Setters ───────────────────────────────────────────────────────────────

  setCoins: (coins: CoinPrice[], exchangeRate: number, updatedAt: number) => {
    set({ coins, exchangeRate, updatedAt, error: null });
  },

  setLanguage: (language: Language) => {
    set({ language });
    SecureStore.setItemAsync(STORE_LANGUAGE_KEY, language).catch(() => {});
  },

  setSelectedExchange: (selectedExchange: SelectedExchange) => {
    set({ selectedExchange });
    SecureStore.setItemAsync(STORE_EXCHANGE_KEY, selectedExchange).catch(() => {});
  },

  addAlert: (alertData: Omit<Alert, 'id' | 'createdAt'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: generateId(),
      createdAt: Date.now(),
    };
    const alerts = [...get().alerts, newAlert];
    set({ alerts });
    _persistAlerts(alerts);
  },

  removeAlert: (id: string) => {
    const alerts = get().alerts.filter((a) => a.id !== id);
    set({ alerts });
    _persistAlerts(alerts);
  },

  toggleAlert: (id: string) => {
    const alerts = get().alerts.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a,
    );
    set({ alerts });
    _persistAlerts(alerts);
  },

  updateAlertTriggered: (id: string) => {
    const alerts = get().alerts.map((a) =>
      a.id === id ? { ...a, lastTriggeredAt: Date.now() } : a,
    );
    set({ alerts });
    // Note: we don't persist lastTriggeredAt — it's transient
  },

  setIsPremium: (isPremium: boolean) => {
    set({ isPremium });
    // Premium status is managed by SecureStore in purchases.ts — not duplicated here
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),
}));

// ─── Persistence helpers ───────────────────────────────────────────────────────

function _persistAlerts(alerts: Alert[]): void {
  try {
    SecureStore.setItemAsync(STORE_ALERTS_KEY, JSON.stringify(alerts)).catch(() => {});
  } catch {
    // ignore write failures — alerts will be lost on next launch but app continues
  }
}

// ─── Hydration ────────────────────────────────────────────────────────────────

/**
 * Read persisted values from SecureStore and populate the store.
 * Call once at app startup. Safe to call multiple times.
 */
export async function hydrateStore(): Promise<void> {
  const store = useAppStore.getState();

  await Promise.allSettled([
    // Language
    SecureStore.getItemAsync(STORE_LANGUAGE_KEY).then((val) => {
      if (val === 'ko' || val === 'en' || val === 'zh') {
        useAppStore.setState({ language: val });
      }
    }),

    // Exchange
    SecureStore.getItemAsync(STORE_EXCHANGE_KEY).then((val) => {
      if (val === 'binance' || val === 'coinbase') {
        useAppStore.setState({ selectedExchange: val });
      }
    }),

    // Alerts
    SecureStore.getItemAsync(STORE_ALERTS_KEY).then((val) => {
      if (val) {
        try {
          const parsed: Alert[] = JSON.parse(val);
          if (Array.isArray(parsed)) {
            useAppStore.setState({ alerts: parsed });
          }
        } catch {
          if (__DEV__) console.warn('[Store] Failed to parse stored alerts');
        }
      }
    }),
  ]);

  if (__DEV__) {
    const state = useAppStore.getState();
    console.log('[Store] Hydrated:', {
      language: state.language,
      selectedExchange: state.selectedExchange,
      alertCount: state.alerts.length,
    });
  }

  // suppress unused variable warning
  void store;
}
