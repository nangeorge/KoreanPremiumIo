import { NextResponse } from "next/server";

// 인메모리 방문자 추적 (세션ID → 마지막 heartbeat 시각)
// 프로덕션에서는 Upstash Redis로 교체 권장
const ACTIVE_WINDOW_MS = 30_000; // 30초 내 heartbeat = 접속 중

declare global {
  // eslint-disable-next-line no-var
  var __visitors: Map<string, number> | undefined;
}
if (!global.__visitors) global.__visitors = new Map();
const visitors = global.__visitors;

function getActiveCount(): number {
  const now = Date.now();
  let count = 0;
  for (const [, lastSeen] of visitors) {
    if (now - lastSeen < ACTIVE_WINDOW_MS) count++;
  }
  return count;
}

function cleanup() {
  const now = Date.now();
  for (const [id, lastSeen] of visitors) {
    if (now - lastSeen >= ACTIVE_WINDOW_MS * 2) visitors.delete(id);
  }
}

// GET: 현재 접속자 수 반환
export async function GET() {
  return NextResponse.json({ count: getActiveCount() });
}

// POST: heartbeat (sessionId를 body로 전송)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = (body.sessionId ?? "").trim().slice(0, 64);
    if (!sessionId) return NextResponse.json({ error: "no_session" }, { status: 400 });

    visitors.set(sessionId, Date.now());
    if (visitors.size > 10000) cleanup();

    return NextResponse.json({ count: getActiveCount() });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
