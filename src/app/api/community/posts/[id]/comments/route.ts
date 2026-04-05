import { NextResponse } from "next/server";
import { withAuth, withOptionalAuth } from "@/lib/api/withAuth";
import { getComments, createComment } from "@/lib/community/db";
import type { CreateCommentInput } from "@/lib/community/schema";

type P = { id: string };

export const GET = withOptionalAuth<P>(async (_req, { params, session }) => {
  const { id } = await params;
  const comments = getComments(id, session?.user?.id ?? null);
  return NextResponse.json({ comments });
});

export const POST = withAuth<P>(async (req, { params, session }) => {
  const { id } = await params;
  try {
    const body: CreateCommentInput = await req.json();
    const content = (body.content ?? "").trim();
    if (!content) return NextResponse.json({ error: "내용을 입력하세요" }, { status: 400 });
    const comment = createComment(id, { content, parentId: body.parentId }, session.user.id);
    if (!comment) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
});
