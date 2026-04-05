import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { toggleCommentLike } from "@/lib/community/db";

type P = { id: string };

export const POST = withAuth<P>(async (_req, { params, session }) => {
  const { id } = await params;
  const result = toggleCommentLike(id, session.user.id);
  return NextResponse.json(result);
});
