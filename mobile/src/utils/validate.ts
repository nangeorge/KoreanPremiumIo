// ─── Input Validation ─────────────────────────────────────────────────────────

export const ALERT_THRESHOLD_MIN = 0.1;
export const ALERT_THRESHOLD_MAX = 50.0;
export const FREE_TIER_ALERT_LIMIT = 1;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate an alert threshold percentage.
 * Must be a finite number between ALERT_THRESHOLD_MIN and ALERT_THRESHOLD_MAX.
 */
export function validateAlertThreshold(
  value: unknown,
  language: 'ko' | 'en' | 'zh' = 'en',
): ValidationResult {
  const messages = {
    ko: {
      required: '임계값을 입력해주세요.',
      type: '숫자를 입력해주세요.',
      min: `임계값은 최소 ${ALERT_THRESHOLD_MIN}%이어야 합니다.`,
      max: `임계값은 최대 ${ALERT_THRESHOLD_MAX}%이어야 합니다.`,
      finite: '유효한 숫자를 입력해주세요.',
    },
    en: {
      required: 'Please enter a threshold value.',
      type: 'Threshold must be a number.',
      min: `Threshold must be at least ${ALERT_THRESHOLD_MIN}%.`,
      max: `Threshold cannot exceed ${ALERT_THRESHOLD_MAX}%.`,
      finite: 'Please enter a valid number.',
    },
    zh: {
      required: '请输入阈值。',
      type: '阈值必须是数字。',
      min: `阈值至少为 ${ALERT_THRESHOLD_MIN}%。`,
      max: `阈值不能超过 ${ALERT_THRESHOLD_MAX}%。`,
      finite: '请输入有效数字。',
    },
  };

  const msg = messages[language];

  if (value === null || value === undefined || value === '') {
    return { valid: false, error: msg.required };
  }

  const num = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (typeof num !== 'number' || isNaN(num)) {
    return { valid: false, error: msg.type };
  }

  if (!isFinite(num)) {
    return { valid: false, error: msg.finite };
  }

  if (num < ALERT_THRESHOLD_MIN) {
    return { valid: false, error: msg.min };
  }

  if (num > ALERT_THRESHOLD_MAX) {
    return { valid: false, error: msg.max };
  }

  return { valid: true };
}

/**
 * Validate a coin symbol against our supported list.
 */
export function validateCoinSymbol(symbol: unknown): ValidationResult {
  const SUPPORTED = ['BTC', 'ETH', 'XRP', 'SOL', 'ADA', 'DOGE', 'POL', 'LINK', 'DOT', 'AVAX'];
  if (typeof symbol !== 'string' || !SUPPORTED.includes(symbol)) {
    return { valid: false, error: `Unsupported coin symbol: ${String(symbol)}` };
  }
  return { valid: true };
}

/**
 * Validate an alert direction value.
 */
export function validateAlertDirection(direction: unknown): ValidationResult {
  if (direction !== 'above' && direction !== 'below') {
    return { valid: false, error: 'Direction must be "above" or "below".' };
  }
  return { valid: true };
}

/**
 * Validate an HTTPS URL. Throws if the URL uses http:// or is malformed.
 */
export function validateHttpsUrl(url: string): ValidationResult {
  if (!url) return { valid: false, error: 'URL is required.' };

  if (url.startsWith('http://')) {
    return { valid: false, error: 'Insecure HTTP URLs are not allowed. Use HTTPS.' };
  }

  if (!url.startsWith('https://')) {
    return { valid: false, error: 'URL must start with https://.' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Malformed URL.' };
  }
}

/**
 * Sanitize a numeric string input — strip non-numeric chars except . and -
 * Returns a string safe to parse with parseFloat().
 */
export function sanitizeNumericInput(input: string): string {
  // Allow digits, one decimal point, and a leading minus sign
  return input.replace(/[^0-9.\-]/g, '').replace(/(?<=.)-/g, '').replace(/(\..*)\./g, '$1');
}
