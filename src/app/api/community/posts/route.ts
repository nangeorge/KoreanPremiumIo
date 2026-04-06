import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPosts, createPost } from "@/lib/community/db";
import { postRateLimit } from "@/lib/api/rateLimit";
import type { PostCategory, CreatePostInput } from "@/lib/community/schema";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const VALID_CATEGORIES = ["all", "free", "analysis", "news", "question"];
  const rawCategory = searchParams.get("category") ?? "all";
  const category = (VALID_CATEGORIES.includes(rawCategory) ? rawCategory : "all") as PostCategory | "all";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);

  const result = await getPosts({ category, page, pageSize: PAGE_SIZE, userId: session?.user?.id ?? null });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // rate limit: 1분에 2개
  if (postRateLimit(session.user.id)) {
    return NextResponse.json({ error: "1분에 최대 2개까지 작성할 수 있습니다." }, { status: 429 });
  }

  try {
    const body: CreatePostInput = await request.json();
    const title = (body.title ?? "").trim().slice(0, 100);
    const content = (body.content ?? "").trim().slice(0, 10000);
    const category = body.category;

    if (!title || title.length < 2) return NextResponse.json({ error: "제목은 2자 이상 입력하세요" }, { status: 400 });
    if (!content || content.length < 5) return NextResponse.json({ error: "내용은 5자 이상 입력하세요" }, { status: 400 });
    if (!["free", "analysis", "news", "question"].includes(category)) {
      return NextResponse.json({ error: "유효하지 않은 카테고리" }, { status: 400 });
    }

    const post = await createPost({ category, title, content }, session.user.id);
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
