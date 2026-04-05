"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import useSWR from "swr";
import { PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/community/PostCard";
import { CATEGORY_LABELS, POST_CATEGORIES } from "@/lib/community/schema";
import type { PostsResponse, PostCategory } from "@/lib/community/schema";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CommunityPage() {
  const locale = useLocale();
  const [category, setCategory] = useState<PostCategory | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR<PostsResponse>(
    `/api/community/posts?category=${category}&page=${page}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const allLabel = locale === "ko" ? "전체" : locale === "zh" ? "全部" : "All";
  const writeLabel = locale === "ko" ? "글쓰기" : locale === "zh" ? "发布" : "Write";
  const emptyLabel = locale === "ko" ? "게시글이 없습니다" : locale === "zh" ? "暂无帖子" : "No posts yet";
  const prevLabel = locale === "ko" ? "이전" : "Prev";
  const nextLabel = locale === "ko" ? "다음" : "Next";

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-[var(--fg)]">
          {locale === "ko" ? "커뮤니티" : locale === "zh" ? "社区" : "Community"}
        </h1>
        <Link
          href={`/${locale}/community/new`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-medium hover:bg-orange-500/30 transition-colors"
        >
          <PenSquare size={13} />
          {writeLabel}
        </Link>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide mb-3">
        <button
          onClick={() => { setCategory("all"); setPage(1); }}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-all",
            category === "all" ? "bg-white/10 text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5"
          )}
        >
          {allLabel}
        </button>
        {POST_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-all",
              category === cat ? "bg-white/10 text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5"
            )}
          >
            {CATEGORY_LABELS[cat][locale as "ko" | "en" | "zh"]}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      <div className="glass rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-[var(--border-color)]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-5 py-4 animate-pulse">
                <div className="h-3 bg-white/8 rounded w-16 mb-2" />
                <div className="h-4 bg-white/8 rounded w-3/4 mb-3" />
                <div className="h-3 bg-white/5 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : !data?.posts?.length ? (
          <div className="py-16 text-center text-sm text-[var(--fg-muted)]">{emptyLabel}</div>
        ) : (
          <div>
            {data.posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {data && data.total > 20 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5 disabled:opacity-40 transition-colors"
          >
            {prevLabel}
          </button>
          <span className="text-xs text-[var(--fg-muted)]">{page} / {Math.ceil(data.total / 20)}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.hasMore}
            className="px-3 py-1.5 rounded text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5 disabled:opacity-40 transition-colors"
          >
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
