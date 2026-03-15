import type { Language } from '../types';

// ─── Currency Formatters ──────────────────────────────────────────────────────

/**
 * Format a Korean Won amount. Uses compact notation for large numbers.
 * e.g. 95_000_000 → "9,500만원" (ko) / "₩95M" (en/zh)
 */
export function formatKrw(value: number, language: Language = 'ko'): string {
  if (!isFinite(value) || isNaN(value)) return '—';

  if (language === 'ko') {
    if (value >= 100_000_000) {
      return `${(value / 100_000_000).toFixed(2)}억원`;
    }
    if (value >= 10_000) {
      return `${(value / 10_000).toFixed(0)}만원`;
    }
    return `${value.toLocaleString('ko-KR')}원`;
  }

  // en / zh: standard compact notation
  if (value >= 1_000_000_000) {
    return `₩${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `₩${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `₩${(value / 1_000).toFixed(0)}K`;
  }
  return `₩${value.toFixed(0)}`;
}

/**
 * Format a USD price with appropriate decimal places.
 * e.g. 95000.12 → "$95,000.12"
 */
export function formatUsd(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';

  if (value >= 10_000) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  if (value >= 1) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (value >= 0.01) {
    return `$${value.toFixed(4)}`;
  }
  return `$${value.toFixed(6)}`;
}

/**
 * Format a premium percentage.
 * Positive values get a + prefix, always shows 2 decimal places.
 * e.g. 2.345 → "+2.35%"  |  -1.2 → "-1.20%"
 */
export function formatPremium(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  const fixed = value.toFixed(2);
  return value >= 0 ? `+${fixed}%` : `${fixed}%`;
}

/**
 * Format a 24h price change percentage.
 */
export function formatChange(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  const fixed = Math.abs(value).toFixed(2);
  return value >= 0 ? `+${fixed}%` : `-${fixed}%`;
}

/**
 * Format a 24h trading volume in KRW.
 * Returns compact form (조, 억, 억원, etc.) for Korean; B/M/K for others.
 */
export function formatVolume(value: number, language: Language = 'ko'): string {
  if (!isFinite(value) || isNaN(value)) return '—';

  if (language === 'ko') {
    if (value >= 1_000_000_000_000) {
      return `${(value / 1_000_000_000_000).toFixed(1)}조`;
    }
    if (value >= 100_000_000) {
      return `${(value / 100_000_000).toFixed(0)}억`;
    }
    if (value >= 10_000) {
      return `${(value / 10_000).toFixed(0)}만`;
    }
    return value.toLocaleString('ko-KR');
  }

  if (value >= 1_000_000_000) return `₩${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `₩${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₩${(value / 1_000).toFixed(0)}K`;
  return `₩${value.toFixed(0)}`;
}

/**
 * Format the USD/KRW exchange rate.
 * e.g. 1380.5 → "1,380.50"
 */
export function formatExchangeRate(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Format a timestamp (unix ms) to a relative "last updated" string.
 */
export function formatUpdatedAt(timestamp: number | null, language: Language = 'ko'): string {
  if (timestamp == null) return '';
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);

  if (language === 'ko') {
    if (diffSec < 10) return '방금 전';
    if (diffSec < 60) return `${diffSec}초 전`;
    return `${Math.floor(diffSec / 60)}분 전`;
  }
  if (language === 'zh') {
    if (diffSec < 10) return '刚刚';
    if (diffSec < 60) return `${diffSec}秒前`;
    return `${Math.floor(diffSec / 60)}分钟前`;
  }
  // en
  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  return `${Math.floor(diffSec / 60)}m ago`;
}

/**
 * Return a CSS-like color token for a premium or change value.
 * Maps to the app's theme colors.
 */
export function getPremiumColor(value: number): string {
  if (value > 0.5) return '#10b981';   // green
  if (value < -0.5) return '#ef4444';  // red
  return '#6b7280';                    // neutral gray
}

export function getChangeColor(value: number): string {
  if (value > 0) return '#10b981';
  if (value < 0) return '#ef4444';
  return '#6b7280';
}
