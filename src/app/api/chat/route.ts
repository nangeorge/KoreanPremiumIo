import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  nickname: string;
  text: string;
  locale: string;
  timestamp: number;
  badge?: "whale" | "bear" | "bull";
}

// IP당 10초 내 최대 3회 rate limit (인메모리)
const rateLimit = new Map<string, number[]>();

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
  if (rateLimit.size > 5000) {
    for (const [key, val] of rateLimit) {
      if (val.every((t) => now - t >= RATE_WINDOW_MS)) rateLimit.delete(key);
    }
  }
  return false;
}

function getBadge(nickname: string): ChatMessage["badge"] {
  if (nickname.includes("고래") || nickname.toLowerCase().includes("whale")) return "whale";
  if (nickname.includes("곰") || nickname.toLowerCase().includes("bear")) return "bear";
  if (nickname.includes("황소") || nickname.toLowerCase().includes("bull")) return "bull";
  return undefined;
}

const ALLOWED_LOCALES = new Set(["ko", "en", "zh"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const after = Math.max(0, parseInt(searchParams.get("after") ?? "0") || 0);

  let query = supabase
    .from("chat_messages")
    .select("id,nickname,text,locale,timestamp,badge")
    .order("timestamp", { ascending: after > 0 });

  if (after > 0) {
    query = query.gt("timestamp", after);
  } else {
    query = query.limit(50);
  }

  const { data } = await query;
  const messages = (data ?? []) as ChatMessage[];
  if (after === 0) messages.reverse();

  return NextResponse.json({ messages, serverTime: Date.now() });
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

    // 스팸 방지: 같은 닉네임의 최근 3개 중 동일 텍스트 차단
    const { data: recent } = await supabase
      .from("chat_messages").select("text")
      .eq("nickname", nickname)
      .order("timestamp", { ascending: false }).limit(3);

    if (recent?.some((m) => m.text === text)) {
      return NextResponse.json({ error: "duplicate" }, { status: 429 });
    }

    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nickname, text, locale,
      timestamp: Date.now(),
      badge: getBadge(nickname) ?? null,
    };

    await supabase.from("chat_messages").insert(msg);

    // 100개 초과 시 오래된 메시지 정리
    const { count } = await supabase
      .from("chat_messages").select("*", { count: "exact", head: true });
    if ((count ?? 0) > 100) {
      const { data: oldest } = await supabase
        .from("chat_messages").select("id")
        .order("timestamp", { ascending: true }).limit((count ?? 100) - 100);
      if (oldest?.length) {
        await supabase.from("chat_messages").delete().in("id", oldest.map((r) => r.id));
      }
    }

    return NextResponse.json({ message: msg });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
