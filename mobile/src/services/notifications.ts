/**
 * Push notification service.
 *
 * Responsibilities:
 *  - Request notification permissions
 *  - Register and persist the Expo push token via SecureStore
 *  - Check alert thresholds against live coin data and fire local notifications
 *
 * Background fetch note (iOS):
 *  iOS severely limits background execution. expo-background-fetch / TaskManager
 *  can register a background fetch task, but iOS will only wake the app
 *  roughly once every 15+ minutes (or less). The OS decides when to run it —
 *  there is no way to guarantee 5-second checks while backgrounded on iOS.
 *
 *  For production-grade background alerts you would need:
 *   a) A server-side worker that polls prices and sends push notifications
 *      via the Expo Push API (the recommended approach), OR
 *   b) A paid background location (always-on) entitlement from Apple.
 *
 *  On Android, background fetch is more permissive but still not real-time.
 *
 *  This implementation provides foreground alert checking (reliable) and
 *  registers a background task for best-effort background checks.
 */

import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import type { CoinPrice, Alert } from '../types';

// ─── SecureStore key ──────────────────────────────────────────────────────────

const PUSH_TOKEN_KEY = 'kp_push_token';

// ─── Notification handler setup ───────────────────────────────────────────────

/**
 * Configure how notifications behave when the app is in the foreground.
 * Call once at app startup (in _layout.tsx before the navigator renders).
 */
export function configureForegroundNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ─── Permission + Token Registration ─────────────────────────────────────────

export interface PushSetupResult {
  granted: boolean;
  token: string | null;
  error?: string;
}

/**
 * Request notification permissions and retrieve the Expo push token.
 * Stores the token in SecureStore. Returns the token on success.
 *
 * Must be called from a physical device (simulators/emulators cannot receive
 * real push notifications, though local notifications still work).
 */
export async function registerForPushNotifications(): Promise<PushSetupResult> {
  // Only physical devices can receive remote pushes
  if (!Device.isDevice) {
    if (__DEV__) console.log('[Notifications] Skipping push registration on simulator/emulator');
    return { granted: false, token: null, error: 'not_a_physical_device' };
  }

  // On Android, create a notification channel (required for Android 8+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('kimchi-alerts', {
      name: '김치 프리미엄 알림',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366f1',
      sound: 'default',
    });
  }

  // Check current permission status
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return { granted: false, token: null, error: 'permission_denied' };
  }

  // Get Expo push token
  try {
    const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    const token = tokenData.data;

    // Store securely — never in AsyncStorage
    await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);

    if (__DEV__) console.log('[Notifications] Push token registered:', token);

    return { granted: true, token };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (__DEV__) console.warn('[Notifications] Failed to get push token:', message);
    return { granted: false, token: null, error: message };
  }
}

/**
 * Retrieve the cached push token from SecureStore.
 * Returns null if no token has been stored yet.
 */
export async function getStoredPushToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
  } catch {
    return null;
  }
}

// ─── Alert Checking ───────────────────────────────────────────────────────────

// Cooldown: don't re-trigger the same alert within 5 minutes
const ALERT_COOLDOWN_MS = 5 * 60 * 1000;
const _lastTriggered: Map<string, number> = new Map();

/**
 * Check all enabled alerts against the current coin prices.
 * Fires a local notification for any alert whose threshold has been crossed,
 * subject to a cooldown per alert ID.
 *
 * @param coins   Current coin prices from the API
 * @param alerts  User-configured alerts from the Zustand store
 * @param onTriggered  Callback to update the store's lastTriggeredAt
 */
export async function checkAndSendAlerts(
  coins: CoinPrice[],
  alerts: Alert[],
  onTriggered: (alertId: string) => void,
): Promise<void> {
  const enabledAlerts = alerts.filter((a) => a.enabled);
  if (enabledAlerts.length === 0) return;

  const coinMap = new Map(coins.map((c) => [c.symbol, c]));

  for (const alert of enabledAlerts) {
    const coin = coinMap.get(alert.symbol);
    if (!coin) continue;

    const premium =
      alert.exchange === 'coinbase' ? coin.coinbasePremium : coin.premium;

    const triggered =
      alert.direction === 'above'
        ? premium >= alert.threshold
        : premium <= alert.threshold;

    if (!triggered) continue;

    // Enforce cooldown
    const lastTime = _lastTriggered.get(alert.id) ?? 0;
    if (Date.now() - lastTime < ALERT_COOLDOWN_MS) continue;

    _lastTriggered.set(alert.id, Date.now());
    onTriggered(alert.id);

    await sendAlertNotification(alert, premium, coin);
  }
}

async function sendAlertNotification(
  alert: Alert,
  currentPremium: number,
  coin: CoinPrice,
): Promise<void> {
  const directionLabel = alert.direction === 'above' ? '↑' : '↓';
  const premiumStr = `${currentPremium >= 0 ? '+' : ''}${currentPremium.toFixed(2)}%`;
  const thresholdStr = `${alert.direction === 'above' ? '≥' : '≤'}${alert.threshold}%`;
  const exchangeLabel = alert.exchange === 'coinbase' ? 'Coinbase' : 'Binance';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${directionLabel} ${coin.symbol} 김치 프리미엄 알림`,
      body: `${coin.name} 프리미엄이 ${thresholdStr} 조건 달성: ${premiumStr} (vs ${exchangeLabel})`,
      data: {
        alertId: alert.id,
        symbol: alert.symbol,
        premium: currentPremium,
      },
      sound: 'default',
      ...(Platform.OS === 'android' && { channelId: 'kimchi-alerts' }),
    },
    trigger: null, // fire immediately
  });
}

// ─── Background task registration ────────────────────────────────────────────

/**
 * Note on background fetch:
 *
 * iOS severely restricts when background tasks run (typically every 15–30+ min,
 * at OS discretion). For real-time premium alerts while backgrounded, you must
 * implement server-side push notifications using the Expo Push API.
 *
 * The function below registers a background fetch task using TaskManager.
 * It will be called by the OS opportunistically. The actual alert-checking
 * logic must call fetchPrices() and checkAndSendAlerts() inside the task.
 *
 * We intentionally do NOT import TaskManager / BackgroundFetch at the top
 * of this file to avoid bundling those modules unless explicitly needed,
 * because they require additional native configuration.
 *
 * To enable: uncomment the code below and add expo-background-fetch to deps.
 */
export async function scheduleBackgroundCheck(): Promise<void> {
  /*
  // Uncomment to enable background fetch:

  import * as BackgroundFetch from 'expo-background-fetch';
  import * as TaskManager from 'expo-task-manager';

  const BACKGROUND_FETCH_TASK = 'kimchi-premium-background-check';

  // Define the task (must be called at the top level, outside any function)
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      const { fetchPrices } = await import('../api/prices');
      const store = await import('../store').then(m => m.useAppStore.getState());
      const data = await fetchPrices();
      await checkAndSendAlerts(data.coins, store.alerts, store.updateAlertTriggered);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });

  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // 15 minutes (iOS minimum; OS may run less frequently)
    stopOnTerminate: false,
    startOnBoot: true,
  });
  */
  if (__DEV__) {
    console.log(
      '[Notifications] Background fetch not enabled. ' +
      'Use server-side push for reliable background alerts.',
    );
  }
}
