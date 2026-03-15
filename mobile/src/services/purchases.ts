/**
 * In-app purchase service using RevenueCat.
 *
 * Setup steps:
 *  1. Create a RevenueCat account at https://app.revenuecat.com
 *  2. Create an Entitlement called "premium" in your RevenueCat project
 *  3. Create Products in App Store Connect (iOS) and Google Play Console (Android)
 *  4. Link those products to the "premium" entitlement in RevenueCat
 *  5. Set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS and EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID
 *     in your .env file
 *
 * Subscription tiers:
 *  - Free:    1 alert, ads shown (default)
 *  - Premium: unlimited alerts, no ads
 *
 * Subscription status is cached in SecureStore and refreshed on app foreground.
 */

import { Platform } from 'react-native';
import Purchases, {
  type PurchasesPackage,
  type CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import * as SecureStore from 'expo-secure-store';

// ─── SecureStore keys ─────────────────────────────────────────────────────────

const PREMIUM_STATUS_KEY = 'kp_is_premium';

// ─── Entitlement / Product IDs ────────────────────────────────────────────────

const ENTITLEMENT_ID =
  process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? 'premium';

// ─── Setup ────────────────────────────────────────────────────────────────────

let _initialized = false;

/**
 * Initialize the RevenueCat SDK. Call once at app startup (in _layout.tsx).
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export async function initializePurchases(): Promise<void> {
  if (_initialized) return;

  const apiKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS
      : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID;

  if (!apiKey) {
    if (__DEV__) {
      console.warn(
        '[Purchases] RevenueCat API key not set. ' +
        'Set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS / _ANDROID in your .env file.',
      );
    }
    return;
  }

  // In development, enable verbose logging for easier debugging
  if (__DEV__) {
    await Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  Purchases.configure({ apiKey });
  _initialized = true;

  if (__DEV__) console.log('[Purchases] RevenueCat initialized');
}

// ─── Subscription Status ──────────────────────────────────────────────────────

/**
 * Check whether the current user has an active premium entitlement.
 * Fetches fresh customer info from RevenueCat and caches the result
 * in SecureStore for offline use.
 *
 * Returns false (free tier) if RevenueCat is not initialized or errors occur.
 */
export async function checkPremiumStatus(): Promise<boolean> {
  if (!_initialized) {
    // Fall back to cached value
    return getCachedPremiumStatus();
  }

  try {
    const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
    const isPremium =
      customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    // Persist to SecureStore
    await SecureStore.setItemAsync(PREMIUM_STATUS_KEY, isPremium ? '1' : '0');

    if (__DEV__) console.log('[Purchases] Premium status:', isPremium);
    return isPremium;
  } catch (err) {
    if (__DEV__) console.warn('[Purchases] Failed to fetch customer info:', err);
    // Use cached value on error
    return getCachedPremiumStatus();
  }
}

/**
 * Read the cached premium status from SecureStore.
 * Returns false if no cache exists (conservative default).
 */
export async function getCachedPremiumStatus(): Promise<boolean> {
  try {
    const val = await SecureStore.getItemAsync(PREMIUM_STATUS_KEY);
    return val === '1';
  } catch {
    return false;
  }
}

// ─── Offering / Package Fetching ──────────────────────────────────────────────

export interface OfferingPackage {
  identifier: string;
  productIdentifier: string;
  priceString: string;
  description: string;
  rcPackage: PurchasesPackage;
}

/**
 * Fetch the current RevenueCat offering and return available packages.
 * Returns an empty array if nothing is configured or an error occurs.
 */
export async function fetchOfferings(): Promise<OfferingPackage[]> {
  if (!_initialized) return [];

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) return [];

    return current.availablePackages.map((pkg) => ({
      identifier: pkg.identifier,
      productIdentifier: pkg.storeProduct.identifier,
      priceString: pkg.storeProduct.priceString,
      description: pkg.storeProduct.description,
      rcPackage: pkg,
    }));
  } catch (err) {
    if (__DEV__) console.warn('[Purchases] Failed to fetch offerings:', err);
    return [];
  }
}

// ─── Purchase ─────────────────────────────────────────────────────────────────

export interface PurchaseResult {
  success: boolean;
  isPremium: boolean;
  error?: string;
  cancelled?: boolean;
}

/**
 * Purchase a package from the current offering.
 * Returns the updated premium status on success.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<PurchaseResult> {
  if (!_initialized) {
    return { success: false, isPremium: false, error: 'purchases_not_initialized' };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPremium =
      customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    await SecureStore.setItemAsync(PREMIUM_STATUS_KEY, isPremium ? '1' : '0');

    return { success: true, isPremium };
  } catch (err: unknown) {
    // RevenueCat throws a PurchasesError with a userCancelled flag
    if (
      err !== null &&
      typeof err === 'object' &&
      'userCancelled' in err &&
      (err as { userCancelled: boolean }).userCancelled
    ) {
      return { success: false, isPremium: false, cancelled: true };
    }
    const message = err instanceof Error ? err.message : String(err);
    if (__DEV__) console.warn('[Purchases] Purchase failed:', message);
    return { success: false, isPremium: false, error: message };
  }
}

// ─── Restore Purchases ────────────────────────────────────────────────────────

/**
 * Restore previously purchased subscriptions.
 * Required by Apple App Store guidelines — must be accessible to users.
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  if (!_initialized) {
    return { success: false, isPremium: false, error: 'purchases_not_initialized' };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium =
      customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    await SecureStore.setItemAsync(PREMIUM_STATUS_KEY, isPremium ? '1' : '0');

    if (__DEV__) console.log('[Purchases] Restored. isPremium:', isPremium);
    return { success: true, isPremium };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (__DEV__) console.warn('[Purchases] Restore failed:', message);
    return { success: false, isPremium: false, error: message };
  }
}
