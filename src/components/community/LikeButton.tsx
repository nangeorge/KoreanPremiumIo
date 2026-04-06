"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeSignIn } from "@/lib/safeSignIn";

interface LikeButtonProps {
  targetType: "post" | "comment";
  targetId: string;
  initialLiked: boolean;
  initialCount: number;
  size?: "sm" | "md";
}

export function LikeButton({ targetType, targetId, initialLiked, initialCount, size = "md" }: LikeButtonProps) {
  const { data: session } = useSession();
  const locale = useLocale();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!session) { safeSignIn(locale); return; }
    if (loading) return;
    // 낙관적 업데이트
    setLiked((v) => !v);
    setCount((c) => liked ? c - 1 : c + 1);
    setLoading(true);
    try {
      const url = targetType === "post"
        ? `/api/community/posts/${targetId}/likes`
        : `/api/community/comments/${targetId}/likes`;
      const res = await fetch(url, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.count);
      } else {
        // 롤백
        setLiked((v) => !v);
        setCount((c) => liked ? c + 1 : c - 1);
      }
    } catch {
      setLiked((v) => !v);
      setCount((c) => liked ? c + 1 : c - 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-1 rounded transition-colors",
        size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-1 text-xs",
        liked
          ? "text-red-400 bg-red-400/10 hover:bg-red-400/15"
          : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5"
      )}
    >
      <Heart size={size === "md" ? 15 : 12} className={liked ? "fill-red-400" : ""} />
      <span className="font-number">{count}</span>
    </button>
  );
}
