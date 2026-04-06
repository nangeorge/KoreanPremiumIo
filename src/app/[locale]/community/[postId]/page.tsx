import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPost, getComments } from "@/lib/community/db";
import { PostDetailClient } from "@/components/community/PostDetailClient";

type Params = { locale: string; postId: string };

export default async function PostDetailPage({ params }: { params: Promise<Params> }) {
  const { locale, postId } = await params;
  const session = await auth();

  // 서버에서 직접 DB 함수 호출 — API round-trip 없음
  const post = await getPost(postId, session?.user?.id ?? null);
  if (!post) notFound();

  const comments = await getComments(postId, session?.user?.id ?? null);

  return <PostDetailClient post={post} initialComments={comments} locale={locale} />;
}
