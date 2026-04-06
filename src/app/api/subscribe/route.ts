import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const { data: existing } = await supabase
      .from("subscribers").select("id").eq("email", trimmed).maybeSingle();

    if (existing) {
      const { count } = await supabase.from("subscribers").select("*", { count: "exact", head: true });
      return NextResponse.json({ ok: true, isNew: false, total: count ?? 0 });
    }

    await supabase.from("subscribers").insert({ email: trimmed });
    const { count } = await supabase.from("subscribers").select("*", { count: "exact", head: true });

    return NextResponse.json({ ok: true, isNew: true, total: count ?? 0 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
