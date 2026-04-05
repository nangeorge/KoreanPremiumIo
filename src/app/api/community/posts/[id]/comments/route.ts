import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getComments, createComment } from "@/lib/community/db";
import type { CreateCommentInput } from "@/lib/community/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  const comments = getComments(id, session?.user?.id ?? null);
  return NextResponse.json({ comments });
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body: CreateCommentInput = await request.json();
    const content = (body.content ?? "").trim();
    if (!content || content.length < 1) return NextResponse.json({ error: "내용을 입력하세요" }, { status: 400 });

    const comment = createComment(id, { content, parentId: body.parentId }, session.user.id);
    if (!comment) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
