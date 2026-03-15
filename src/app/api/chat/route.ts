import { NextResponse } from "next/server";

export interface ChatMessage {
  id: string;
  nickname: string;
  text: string;
  locale: string;
  timestamp: number;
  badge?: "whale" | "bear" | "bull";
}

// 개발/단일 서버용 인메모리 스토어
// 프로덕션(Vercel)에서는 Upstash Redis 또는 Supabase로 교체 권장
const MAX_MESSAGES = 100;
declare global {
  // eslint-disable-next-line no-var
  var __chatMessages: ChatMessage[] | undefined;
  // eslint-disable-next-line no-var
  var __chatRateLimit: Map<string, number[]> | undefined;
}
if (!global.__chatMessages) global.__chatMessages = [];
if (!global.__chatRateLimit) global.__chatRateLimit = new Map();

const messages = global.__chatMessages;
const rateLimit = global.__chatRateLimit;

// IP당 10초 내 최대 3회
const RATE_WINDOW_MS = 10_000;
const RATE_MAX = 3;

function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded ? forwarded.split(",")[0] : "unknown").trim();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (rateLimit.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (times.length >= RATE_MAX) return true;
  times.push(now);
  rateLimit.set(ip, times);
  // 오래된 IP 항목 정리 (메모리 누수 방지)
  if (rateLimit.size > 5000) {
    for (const [key, val] of rateLimit) {
      if (val.every((t) => now - t >= RATE_WINDOW_MS)) rateLimit.delete(key);
    }
  }
  return false;
}

function getBadge(nickname: string): ChatMessage["badge"] {
  if (nickname.includes("고래") || nickname.includes("whale")) return "whale";
  if (nickname.includes("곰") || nickname.includes("bear")) return "bear";
  if (nickname.includes("황소") || nickname.includes("bull")) return "bull";
  return undefined;
}

const ALLOWED_LOCALES = new Set(["ko", "en", "zh"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const after = Math.max(0, parseInt(searchParams.get("after") ?? "0") || 0);

  const result = after > 0
    ? messages.filter((m) => m.timestamp > after)
    : messages.slice(-50);

  return NextResponse.json({ messages: result, serverTime: Date.now() });
}

export async function POST(request: Request) {
  try {
    const ip = getIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const body = await request.json();
    const text = (body.text ?? "").trim().slice(0, 200);
    const nickname = (body.nickname ?? "익명").trim().slice(0, 20) || "익명";
    const locale = ALLOWED_LOCALES.has(body.locale) ? body.locale : "ko";

    if (!text) return NextResponse.json({ error: "empty" }, { status: 400 });

    // 같은 닉네임의 마지막 3개 메시지 중 동일 텍스트 있으면 스팸 처리
    const recentByNick = messages.filter((m) => m.nickname === nickname).slice(-3);
    if (recentByNick.some((m) => m.text === text)) {
      return NextResponse.json({ error: "duplicate" }, { status: 429 });
    }

    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nickname,
      text,
      locale,
      timestamp: Date.now(),
      badge: getBadge(nickname),
    };

    messages.push(msg);
    if (messages.length > MAX_MESSAGES) messages.splice(0, messages.length - MAX_MESSAGES);

    return NextResponse.json({ message: msg });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
