"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Eye, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { lt } from "@/lib/lt";
import { useDateLocale } from "@/hooks/useDateLocale";
import { CATEGORY_LABELS } from "@/lib/community/schema";
import type { PostDTO } from "@/lib/community/schema";

const CATEGORY_COLORS: Record<string, string> = {
  free:     "text-blue-400 bg-blue-400/10",
  analysis: "text-orange-400 bg-orange-400/10",
  news:     "text-emerald-400 bg-emerald-400/10",
  question: "text-purple-400 bg-purple-400/10",
};

export function PostCard({ post }: { post: PostDTO }) {
  const locale = useLocale();
  const dateLocale = useDateLocale();
  const catLabel = CATEGORY_LABELS[post.category]?.[locale as "ko" | "en" | "zh"] ?? post.category;

  return (
    <Link href={`/${locale}/community/${post.id}`} className="block group">
      <div className={cn(
        "px-4 py-3.5 sm:px-5 border-b border-[var(--border-color)] hover:bg-white/3 transition-colors",
        post.isPinned && "bg-orange-500/4"
      )}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {post.isPinned && <Pin size={12} className="text-orange-400 flex-shrink-0" />}
              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", CATEGORY_COLORS[post.category])}>
                {catLabel}
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--fg)] group-hover:text-white transition-colors line-clamp-2 leading-snug">
              {post.title}
            </p>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                {post.author.image ? (
                  <Image src={post.author.image} alt={post.author.name} width={16} height={16} className="rounded-full" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-orange-500/20 flex items-center justify-center text-[9px] font-bold text-orange-400">
                    {post.author.name[0].toUpperCase()}
                  </div>
                )}
                <span className="text-[11px] text-[var(--fg-muted)]">{post.author.name}</span>
              </div>
              <span className="text-[11px] text-[var(--fg-muted)]">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: dateLocale })}
              </span>
              <div className="flex items-center gap-2.5 ml-auto">
                <span className="flex items-center gap-1 text-[11px] text-[var(--fg-muted)]"><Eye size={11} /> {post.viewCount}</span>
                <span className="flex items-center gap-1 text-[11px] text-[var(--fg-muted)]">
                  <Heart size={11} className={post.isLiked ? "fill-red-400 text-red-400" : ""} /> {post.likeCount}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[var(--fg-muted)]"><MessageCircle size={11} /> {post.commentCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
