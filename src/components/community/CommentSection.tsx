"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useSession, signIn } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { CornerDownRight, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { lt } from "@/lib/lt";
import { useDateLocale } from "@/hooks/useDateLocale";
import { LikeButton } from "./LikeButton";
import type { CommentDTO } from "@/lib/community/schema";

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) return <Image src={image} alt={name} width={28} height={28} className="rounded-full flex-shrink-0" />;
  return (
    <div className="h-7 w-7 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400 flex-shrink-0">
      {name[0].toUpperCase()}
    </div>
  );
}

function CommentItem({
  comment, postId, currentUserId, onDeleted, depth = 0
}: {
  comment: CommentDTO;
  postId: string;
  currentUserId: string | undefined;
  onDeleted: (id: string) => void;
  depth?: number;
}) {
  const locale = useLocale();
  const dateLocale = useDateLocale();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState(comment.replies);

  async function handleDelete() {
    if (!confirm(lt(locale, "댓글을 삭제하시겠습니까?", "Delete this comment?"))) return;
    await fetch(`/api/community/comments/${comment.id}`, { method: "DELETE" });
    onDeleted(comment.id);
  }

  async function handleEdit() {
    if (!editContent.trim()) return;
    const res = await fetch(`/api/community/comments/${comment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent.trim() }),
    });
    if (res.ok) setEditing(false);
  }

  async function handleReply() {
    if (!replyContent.trim()) return;
    const res = await fetch(`/api/community/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent.trim(), parentId: comment.id }),
    });
    if (res.ok) {
      const newReply: CommentDTO = await res.json();
      setReplies((r) => [...r, newReply]);
      setReplyContent("");
      setReplying(false);
    }
  }

  return (
    <div className={cn("", depth > 0 && "ml-8 mt-2")}>
      <div className="flex gap-2.5">
        <Avatar name={comment.author.name} image={comment.author.image} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[var(--fg)]">{comment.author.name}</span>
            <span className="text-[10px] text-[var(--fg-muted)]">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: dateLocale })}
            </span>
          </div>

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-white/20 resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleEdit} className="text-xs px-3 py-1 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-colors">
                  {lt(locale, "저장", "Save", "保存")}
                </button>
                <button onClick={() => setEditing(false)} className="text-xs px-3 py-1 rounded text-[var(--fg-muted)] hover:bg-white/5 transition-colors">
                  {lt(locale, "취소", "Cancel", "取消")}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--fg-secondary)] whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          )}

          {!comment.isDeleted && !editing && (
            <div className="mt-1.5 flex items-center gap-1">
              <LikeButton targetType="comment" targetId={comment.id} initialLiked={comment.isLiked} initialCount={comment.likeCount} size="sm" />
              {depth === 0 && (
                <button onClick={() => setReplying((v) => !v)} className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5 rounded transition-colors">
                  <CornerDownRight size={11} />
                  {lt(locale, "답글", "Reply", "回复")}
                </button>
              )}
              {currentUserId === comment.author.id && (
                <>
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5 rounded transition-colors">
                    <Pencil size={11} />
                  </button>
                  <button onClick={handleDelete} className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--fg-muted)] hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                    <Trash2 size={11} />
                  </button>
                </>
              )}
            </div>
          )}

          {replying && (
            <div className="mt-2 flex gap-2">
              <input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                placeholder={lt(locale, "대댓글을 입력하세요", "Write a reply...", "回复...")}
                className="flex-1 rounded border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-1.5 text-xs text-[var(--fg)] placeholder-[var(--fg-muted)] outline-none focus:border-white/20"
              />
              <button onClick={handleReply} className="px-3 py-1.5 text-xs rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-colors">
                {lt(locale, "등록", "Send", "发送")}
              </button>
            </div>
          )}
        </div>
      </div>

      {replies.map((r) => (
        <CommentItem key={r.id} comment={r} postId={postId} currentUserId={currentUserId} onDeleted={onDeleted} depth={1} />
      ))}
    </div>
  );
}

export function CommentSection({ postId, initialComments }: { postId: string; initialComments: CommentDTO[] }) {
  const locale = useLocale();
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setComments(initialComments); }, [initialComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { signIn("google"); return; }
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (res.ok) {
        const c: CommentDTO = await res.json();
        setComments((prev) => [...prev, c]);
        setInput("");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDeleted(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id && !c.replies.some((r) => r.id === id)));
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-[var(--fg)] mb-4">
        {lt(locale, `댓글 ${comments.length}`, `Comments ${comments.length}`, `评论 ${comments.length}`)}
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        {session?.user?.image ? (
          <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full flex-shrink-0 mt-1" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400 flex-shrink-0 mt-1">
            {session ? (session.user.name ?? "?")[0].toUpperCase() : "?"}
          </div>
        )}
        <div className="flex-1 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={session
              ? lt(locale, "댓글을 입력하세요", "Write a comment...", "写评论...")
              : lt(locale, "로그인하여 댓글 달기", "Sign in to comment", "登录后评论")}
            onClick={() => { if (!session) signIn("google"); }}
            readOnly={!session}
            className={cn(
              "flex-1 rounded border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--fg)] placeholder-[var(--fg-muted)] outline-none focus:border-white/20 transition-colors",
              !session && "cursor-pointer"
            )}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-medium hover:bg-orange-500/30 transition-colors disabled:opacity-40"
          >
            {lt(locale, "등록", "Post", "发送")}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="text-sm text-[var(--fg-muted)] text-center py-8">
          {lt(locale, "첫 댓글을 남겨보세요", "Be the first to comment", "来发表第一条评论吧")}
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} postId={postId} currentUserId={session?.user?.id} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
