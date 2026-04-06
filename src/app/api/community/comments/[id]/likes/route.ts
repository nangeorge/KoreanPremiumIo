import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { toggleCommentLike } from "@/lib/community/db";
import { likeRateLimit } from "@/lib/api/rateLimit";

type P = { id: string };

export const POST = withAuth<P>(async (_req, { params, session }) => {
  if (likeRateLimit(session.user.id)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }
  const { id } = await params;
  const result = await toggleCommentLike(id, session.user.id);
  return NextResponse.json(result);
});
