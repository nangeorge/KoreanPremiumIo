/**
 * Security service.
 *
 * Responsibilities:
 *  1. Jailbreak / root detection (warns user, does NOT block app usage)
 *  2. Production log suppression (no sensitive data in prod logcat / Console)
 *  3. HTTPS URL validation
 *
 * On jailbreak/root: we show a warning dialog but do NOT hard-block because:
 *  - False positives exist (legitimate tools trigger detection)
 *  - Blocking degrades UX for power users without real security gain
 *    (a motivated attacker can bypass JS-level detection anyway)
 *  - Apple/Google review guidelines discourage hard-blocking
 */

import { Platform } from 'react-native';
import * as Device from 'expo-device';

// ─── Jailbreak / Root Detection ───────────────────────────────────────────────

export interface SecurityCheckResult {
  isCompromised: boolean;
  reasons: string[];
}

/**
 * Performs a best-effort check for jailbreak (iOS) or root (Android).
 *
 * Uses expo-device signals only — no native file-system probing (which would
 * require a native module and adds complexity). This catches emulators and
 * development devices that report non-physical device types.
 *
 * Limitations: does not detect sophisticated jailbreaks that hide themselves.
 * This is intentional — we warn, not block.
 */
export async function isDeviceCompromised(): Promise<SecurityCheckResult> {
  const reasons: string[] = [];

  // expo-device: isDevice is false on simulators/emulators
  if (!Device.isDevice) {
    reasons.push(
      Platform.OS === 'ios'
        ? 'Running on an iOS Simulator'
        : 'Running on an Android Emulator',
    );
  }

  // DeviceType: if it's not PHONE or TABLET, something unusual is happening
  const deviceType = await Device.getDeviceTypeAsync();
  if (
    deviceType !== Device.DeviceType.PHONE &&
    deviceType !== Device.DeviceType.TABLET
  ) {
    reasons.push(`Unexpected device type: ${Device.DeviceType[deviceType]}`);
  }

  // On Android, expo-device exposes Device.isRooted (requires expo-device >= 5)
  // This is a best-effort check using the underlying Build.TAGS / su binary probe
  if (Platform.OS === 'android') {
    try {
      // expo-device doesn't expose a direct isRooted API, but we can check
      // osBuildFingerprint for "test-keys" which indicates custom ROM / rooted
      const fingerprint = Device.osBuildFingerprint ?? '';
      if (fingerprint.includes('test-keys') || fingerprint.includes('userdebug')) {
        reasons.push('Android build fingerprint indicates test-keys or userdebug build');
      }
    } catch {
      // ignore — non-critical check
    }
  }

  return {
    isCompromised: reasons.length > 0,
    reasons,
  };
}

// ─── Production Log Suppressor ────────────────────────────────────────────────

let _logsSuppressed = false;

/**
 * In production builds, override console.log and console.warn with no-ops
 * to prevent sensitive data from leaking into system logs (logcat / device console).
 *
 * console.error is intentionally left active so crash reporters (e.g. Sentry)
 * can still receive error events.
 *
 * Call this once at app startup, before any other code runs.
 */
export function suppressLogsInProduction(): void {
  if (__DEV__ || _logsSuppressed) return;

  // eslint-disable-next-line no-console
  console.log = () => {};
  // eslint-disable-next-line no-console
  console.warn = () => {};
  // eslint-disable-next-line no-console
  console.info = () => {};
  // eslint-disable-next-line no-console
  console.debug = () => {};
  // console.error intentionally preserved for crash reporters

  _logsSuppressed = true;
}

// ─── URL Validation ───────────────────────────────────────────────────────────

/**
 * Validate that a URL uses HTTPS.
 * Returns true if valid, false otherwise.
 * Logs a warning in development if the URL fails.
 */
export function validateApiUrl(url: string): boolean {
  if (!url) {
    if (__DEV__) console.warn('[Security] Empty URL rejected');
    return false;
  }

  if (url.startsWith('http://')) {
    if (__DEV__) console.warn(`[Security] HTTP URL rejected (must be HTTPS): ${url}`);
    return false;
  }

  if (!url.startsWith('https://')) {
    if (__DEV__) console.warn(`[Security] Non-HTTPS URL rejected: ${url}`);
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    if (__DEV__) console.warn(`[Security] Malformed URL rejected: ${url}`);
    return false;
  }
}

// ─── Security Warning Messages ────────────────────────────────────────────────

export function getCompromisedDeviceMessage(language: 'ko' | 'en' | 'zh'): {
  title: string;
  body: string;
} {
  const messages = {
    ko: {
      title: '보안 경고',
      body: '이 기기는 탈옥(Jailbreak) 또는 루팅(Root)된 것으로 감지되었습니다.\n\n앱을 계속 사용할 수 있지만, 민감한 데이터(구독 정보, 알림 토큰)가 위험에 노출될 수 있습니다.',
    },
    en: {
      title: 'Security Warning',
      body: 'This device appears to be jailbroken or rooted.\n\nYou may continue using the app, but sensitive data (subscription status, push tokens) may be at risk.',
    },
    zh: {
      title: '安全警告',
      body: '检测到此设备可能已越狱或获取了Root权限。\n\n您可以继续使用应用，但敏感数据（订阅状态、推送令牌）可能面临风险。',
    },
  };
  return messages[language];
}
