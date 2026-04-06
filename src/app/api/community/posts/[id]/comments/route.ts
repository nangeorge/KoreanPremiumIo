import { NextResponse } from "next/server";
import { withAuth, withOptionalAuth } from "@/lib/api/withAuth";
import { getComments, createComment } from "@/lib/community/db";
import { commentRateLimit } from "@/lib/api/rateLimit";
import type { CreateCommentInput } from "@/lib/community/schema";

type P = { id: string };

export const GET = withOptionalAuth<P>(async (_req, { params, session }) => {
  const { id } = await params;
  const comments = await getComments(id, session?.user?.id ?? null);
  return NextResponse.json({ comments });
});

export const POST = withAuth<P>(async (req, { params, session }) => {
  if (commentRateLimit(session.user.id)) {
    return NextResponse.json({ error: "30초에 최대 3개까지 댓글을 작성할 수 있습니다." }, { status: 429 });
  }

  const { id } = await params;
  try {
    const body: CreateCommentInput = await req.json();
    const content = (body.content ?? "").trim().slice(0, 1000);
    if (!content) return NextResponse.json({ error: "내용을 입력하세요" }, { status: 400 });
    const comment = await createComment(id, { content, parentId: body.parentId }, session.user.id);
    if (!comment) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
});
