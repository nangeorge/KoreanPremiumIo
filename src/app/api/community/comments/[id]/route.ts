import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateComment, deleteComment } from "@/lib/community/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const { content } = await request.json();
    if (!content?.trim()) return NextResponse.json({ error: "내용을 입력하세요" }, { status: 400 });
    const comment = updateComment(id, content.trim(), session.user.id);
    if (!comment) return NextResponse.json({ error: "not_found_or_forbidden" }, { status: 403 });
    return NextResponse.json(comment);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ok = deleteComment(id, session.user.id);
  if (!ok) return NextResponse.json({ error: "not_found_or_forbidden" }, { status: 403 });
  return NextResponse.json({ ok: true });
}
