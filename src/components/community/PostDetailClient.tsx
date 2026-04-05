"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { lt } from "@/lib/lt";
import { useDateLocale } from "@/hooks/useDateLocale";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { CATEGORY_LABELS } from "@/lib/community/schema";
import type { PostDTO, CommentDTO } from "@/lib/community/schema";

const CATEGORY_COLORS: Record<string, string> = {
  free:     "text-blue-400 bg-blue-400/10",
  analysis: "text-orange-400 bg-orange-400/10",
  news:     "text-emerald-400 bg-emerald-400/10",
  question: "text-purple-400 bg-purple-400/10",
};

interface PostDetailClientProps {
  post: PostDTO;
  initialComments: CommentDTO[];
  locale: string;
}

export function PostDetailClient({ post, initialComments, locale }: PostDetailClientProps) {
  const router = useRouter();
  const localeFromHook = useLocale();
  const { data: session } = useSession();
  const dateLocale = useDateLocale();
  const [deleted, setDeleted] = useState(false);

  const catLabel = CATEGORY_LABELS[post.category]?.[locale as "ko" | "en" | "zh"];
  const isAuthor = session?.user?.id === post.author.id;

  async function handleDelete() {
    if (!confirm(lt(localeFromHook, "게시글을 삭제하시겠습니까?", "Delete this post?", "确定删除这篇帖子？"))) return;
    const res = await fetch(`/api/community/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleted(true);
      router.push(`/${locale}/community`);
      router.refresh();
    }
  }

  if (deleted) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
      <Link
        href={`/${locale}/community`}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] mb-4 transition-colors"
      >
        <ArrowLeft size={13} />
        {lt(locale, "목록으로", "Back to list", "返回列表")}
      </Link>

      <div className="glass rounded-xl p-5 sm:p-6">
        {/* 카테고리 + 제목 */}
        <div className="mb-4">
          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", CATEGORY_COLORS[post.category])}>
            {catLabel}
          </span>
          <h1 className="mt-2 text-xl font-bold text-[var(--fg)] leading-snug">{post.title}</h1>
        </div>

        {/* 작성자 + 메타 */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            {post.author.image ? (
              <Image src={post.author.image} alt={post.author.name} width={32} height={32} className="rounded-full" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-400">
                {post.author.name[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-[var(--fg)]">{post.author.name}</p>
              <p className="text-[10px] text-[var(--fg-muted)]">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: dateLocale })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-[var(--fg-muted)]">
              <Eye size={12} /> {post.viewCount}
            </span>
            {isAuthor && (
              <>
                <Link
                  href={`/${locale}/community/${post.id}/edit`}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5 rounded transition-colors"
                >
                  <Pencil size={12} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--fg-muted)] hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="text-sm text-[var(--fg-secondary)] whitespace-pre-wrap leading-relaxed min-h-[120px]">
          {post.content}
        </div>

        {/* 좋아요 */}
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-center">
          <LikeButton targetType="post" targetId={post.id} initialLiked={post.isLiked} initialCount={post.likeCount} size="md" />
        </div>
      </div>

      {/* 댓글 */}
      <div className="mt-4 glass rounded-xl p-5 sm:p-6">
        <CommentSection postId={post.id} initialComments={initialComments} />
      </div>
    </div>
  );
}
