/**
 * Secure fetch wrapper for the Kimchi Premium API.
 *
 * Security guarantees:
 *  - Enforces HTTPS-only (throws on http:// URLs)
 *  - 10-second AbortController timeout
 *  - Retries once on network error (not on 4xx/5xx — those are caller's problem)
 *  - All logging gated behind __DEV__
 *  - Returns typed responses via generics
 */

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 1; // one retry on network error

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

/**
 * Enforce that a URL uses HTTPS. Throws SecurityError if not.
 */
function assertHttps(url: string): void {
  if (url.startsWith('http://')) {
    throw new SecurityError(
      `Insecure HTTP request blocked: ${url}. Only HTTPS is permitted.`,
    );
  }
  if (!url.startsWith('https://')) {
    throw new SecurityError(
      `Invalid URL scheme: ${url}. Must begin with https://.`,
    );
  }
}

/**
 * Core fetch with timeout and single retry on network failure.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  attempt: number = 0,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (err: unknown) {
    clearTimeout(timer);

    const isAbort =
      err instanceof Error && (err.name === 'AbortError' || err.message.includes('aborted'));

    if (isAbort) {
      throw new NetworkError(`Request timed out after ${REQUEST_TIMEOUT_MS}ms: ${url}`);
    }

    // Retry once on network error (not timeout)
    if (attempt < MAX_RETRIES) {
      if (__DEV__) {
        console.warn(`[API] Network error on attempt ${attempt + 1}, retrying...`, err);
      }
      // Small delay before retry
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fetchWithTimeout(url, options, attempt + 1);
    }

    throw new NetworkError(
      `Network request failed: ${url}`,
      err,
    );
  }
}

/**
 * Typed GET request.
 * Enforces HTTPS, applies timeout, retries once on network failure.
 */
export async function apiGet<T>(url: string, headers?: Record<string, string>): Promise<T> {
  assertHttps(url);

  if (__DEV__) {
    console.log(`[API] GET ${url}`);
  }

  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    if (__DEV__) {
      console.warn(`[API] Error ${response.status} from ${url}:`, text);
    }
    throw new ApiError(response.status, response.statusText, `HTTP ${response.status}: ${text}`);
  }

  const data: T = await response.json();

  if (__DEV__) {
    console.log(`[API] Response from ${url}:`, data);
  }

  return data;
}

/**
 * Build a query string from a params object, omitting undefined/null values.
 */
export function buildQueryString(params: Record<string, string | number | undefined | null>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}
