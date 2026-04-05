import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { togglePostLike } from "@/lib/community/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const result = togglePostLike(id, session.user.id);
  return NextResponse.json(result);
}
