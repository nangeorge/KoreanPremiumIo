import { NextRequest, NextResponse } from "next/server";

// TODO: 프로덕션에서는 Resend / Mailchimp / Supabase로 교체
const subscribers = new Set<string>();

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

    const isNew = !subscribers.has(trimmed);
    subscribers.add(trimmed);

    return NextResponse.json({ ok: true, isNew, total: subscribers.size });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
