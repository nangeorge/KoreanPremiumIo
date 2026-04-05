import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 파일 기반 구독자 저장소 (프로덕션에서는 Supabase/Resend/Mailchimp으로 교체)
const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

function loadSubscribers(): Set<string> {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(SUBSCRIBERS_FILE)) return new Set();
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8");
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveSubscribers(set: Set<string>) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([...set]), "utf-8");
  } catch {
    // 저장 실패 시 무시 (서버리스 환경에서는 쓰기 불가)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const subscribers = loadSubscribers();
    const isNew = !subscribers.has(trimmed);
    subscribers.add(trimmed);
    saveSubscribers(subscribers);

    return NextResponse.json({ ok: true, isNew, total: subscribers.size });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
