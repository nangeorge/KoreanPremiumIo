// 인메모리 rate limiter (userId 기반 — 인증된 사용자 전용)
// Vercel 서버리스에서도 동작하나, 인스턴스가 여러 개면 각각 독립적으로 동작함.
// 프로덕션 트래픽이 커지면 Upstash Redis로 교체 권장.

declare global {
  // eslint-disable-next-line no-var
  var __userRateLimit: Map<string, number[]> | undefined;
}
if (!global.__userRateLimit) global.__userRateLimit = new Map();
const store = global.__userRateLimit;

interface RateLimitOpts {
  windowMs: number; // 시간 윈도우 (ms)
  max: number;      // 윈도우 내 최대 허용 횟수
}

/**
 * userId 기반 rate limit 체크
 * @returns true = 제한 초과 (차단), false = 통과
 */
export function isUserRateLimited(userId: string, key: string, opts: RateLimitOpts): boolean {
  const mapKey = `${key}:${userId}`;
  const now = Date.now();
  const times = (store.get(mapKey) ?? []).filter((t) => now - t < opts.windowMs);

  if (times.length >= opts.max) return true;

  times.push(now);
  store.set(mapKey, times);

  // 메모리 누수 방지: 5000개 초과 시 만료된 항목 정리
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (v.every((t) => now - t >= opts.windowMs)) store.delete(k);
    }
  }

  return false;
}

// 편의 함수들
export const postRateLimit = (userId: string) =>
  isUserRateLimited(userId, "post", { windowMs: 60_000, max: 2 });   // 1분에 2개

export const commentRateLimit = (userId: string) =>
  isUserRateLimited(userId, "comment", { windowMs: 30_000, max: 3 }); // 30초에 3개

export const likeRateLimit = (userId: string) =>
  isUserRateLimited(userId, "like", { windowMs: 10_000, max: 10 });   // 10초에 10개
