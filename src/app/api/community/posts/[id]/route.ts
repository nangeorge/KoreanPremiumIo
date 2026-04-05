import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPost, updatePost, deletePost } from "@/lib/community/db";
import type { UpdatePostInput } from "@/lib/community/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  const post = getPost(id, session?.user?.id ?? null);
  if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body: UpdatePostInput = await request.json();
    const post = updatePost(id, body, session.user.id);
    if (!post) return NextResponse.json({ error: "not_found_or_forbidden" }, { status: 403 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ok = deletePost(id, session.user.id);
  if (!ok) return NextResponse.json({ error: "not_found_or_forbidden" }, { status: 403 });
  return NextResponse.json({ ok: true });
}
