"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, POST_CATEGORIES } from "@/lib/community/schema";
import type { PostDTO, PostCategory } from "@/lib/community/schema";
import { LoginButton } from "@/components/auth/LoginButton";

interface PostFormProps {
  initialData?: PostDTO;  // 수정 시 전달
}

export function PostForm({ initialData }: PostFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const isEdit = !!initialData;

  const [category, setCategory] = useState<PostCategory>(initialData?.category ?? "free");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-[var(--fg-secondary)] mb-4">
          {locale === "ko" ? "로그인 후 글을 작성할 수 있습니다" : locale === "zh" ? "请登录后发帖" : "Please sign in to write a post"}
        </p>
        <LoginButton />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim() || title.trim().length < 2) { setError("제목은 2자 이상 입력하세요"); return; }
    if (!content.trim() || content.trim().length < 5) { setError("내용은 5자 이상 입력하세요"); return; }

    setLoading(true);
    try {
      const url = isEdit ? `/api/community/posts/${initialData!.id}` : "/api/community/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title: title.trim(), content: content.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "오류가 발생했습니다");
        return;
      }
      const post: PostDTO = await res.json();
      router.push(`/${locale}/community/${post.id}`);
      router.refresh();
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  const labels = {
    category: locale === "ko" ? "카테고리" : locale === "zh" ? "分类" : "Category",
    titleLabel: locale === "ko" ? "제목" : locale === "zh" ? "标题" : "Title",
    titlePh: locale === "ko" ? "제목을 입력하세요 (최대 100자)" : locale === "zh" ? "请输入标题" : "Enter title (max 100 chars)",
    contentLabel: locale === "ko" ? "내용" : locale === "zh" ? "内容" : "Content",
    contentPh: locale === "ko" ? "내용을 입력하세요" : locale === "zh" ? "请输入内容" : "Write your post...",
    submit: isEdit
      ? (locale === "ko" ? "수정 완료" : locale === "zh" ? "保存修改" : "Save Changes")
      : (locale === "ko" ? "글 등록" : locale === "zh" ? "发布" : "Publish"),
    cancel: locale === "ko" ? "취소" : locale === "zh" ? "取消" : "Cancel",
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-5 sm:p-6 space-y-4">
      {/* 카테고리 */}
      <div>
        <label className="block text-xs font-medium text-[var(--fg-muted)] mb-2">{labels.category}</label>
        <div className="flex flex-wrap gap-2">
          {POST_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-medium transition-all",
                category === cat ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" : "bg-white/5 text-[var(--fg-muted)] hover:bg-white/10 border border-transparent"
              )}
            >
              {CATEGORY_LABELS[cat][locale as "ko" | "en" | "zh"]}
            </button>
          ))}
        </div>
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-xs font-medium text-[var(--fg-muted)] mb-2">{labels.titleLabel}</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder={labels.titlePh}
          className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--fg)] placeholder-[var(--fg-muted)] outline-none focus:border-white/20 transition-colors"
        />
        <p className="mt-1 text-right text-[10px] text-[var(--fg-muted)]">{title.length}/100</p>
      </div>

      {/* 내용 */}
      <div>
        <label className="block text-xs font-medium text-[var(--fg-muted)] mb-2">{labels.contentLabel}</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={10000}
          rows={10}
          placeholder={labels.contentPh}
          className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--fg)] placeholder-[var(--fg-muted)] outline-none focus:border-white/20 transition-colors resize-y"
        />
        <p className="mt-1 text-right text-[10px] text-[var(--fg-muted)]">{content.length}/10000</p>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5 transition-colors"
        >
          {labels.cancel}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-medium hover:bg-orange-500/30 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : labels.submit}
        </button>
      </div>
    </form>
  );
}
