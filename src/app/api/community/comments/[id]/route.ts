import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { updateComment, deleteComment } from "@/lib/community/db";

type P = { id: string };

export const PUT = withAuth<P>(async (req, { params, session }) => {
  const { id } = await params;
  try {
    const { content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: "내용을 입력하세요" }, { status: 400 });
    const comment = await updateComment(id, content.trim(), session.user.id);
    if (!comment) return NextResponse.json({ error: "not_found_or_forbidden" }, { status: 403 });
    return NextResponse.json(comment);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
});

export const DELETE = withAuth<P>(async (_req, { params, session }) => {
  const { id } = await params;
  const ok = await deleteComment(id, session.user.id);
  if (!ok) return NextResponse.json({ error: "not_found_or_forbidden" }, { status: 403 });
  return NextResponse.json({ ok: true });
});
