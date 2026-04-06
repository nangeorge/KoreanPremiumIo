import { NextResponse } from "next/server";
import { withAuth, withOptionalAuth } from "@/lib/api/withAuth";
import { getPost, updatePost, deletePost } from "@/lib/community/db";
import type { UpdatePostInput } from "@/lib/community/schema";

type P = { id: string };

export const GET = withOptionalAuth<P>(async (_req, { params, session }) => {
  const { id } = await params;
  const post = await getPost(id, session?.user?.id ?? null);
  if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(post);
});

export const PUT = withAuth<P>(async (req, { params, session }) => {
  const { id } = await params;
  try {
    const body: UpdatePostInput = await req.json();
    const post = await updatePost(id, body, session.user.id);
    if (!post) return NextResponse.json({ error: "not_found_or_forbidden" }, { status: 403 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
});

export const DELETE = withAuth<P>(async (_req, { params, session }) => {
  const { id } = await params;
  const ok = await deletePost(id, session.user.id);
  if (!ok) return NextResponse.json({ error: "not_found_or_forbidden" }, { status: 403 });
  return NextResponse.json({ ok: true });
});
