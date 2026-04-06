import { supabase } from "@/lib/supabase";
import type {
  DbUser, AuthorInfo, PostDTO, PostsResponse, CommentDTO,
  CreatePostInput, UpdatePostInput, CreateCommentInput, PostCategory,
} from "./schema";

// ── 내부 타입 ─────────────────────────────────────────────────────────────────
type PostRow = {
  id: string; user_id: string; category: string; title: string; content: string;
  like_count: number; comment_count: number; view_count: number;
  is_pinned: boolean; is_deleted: boolean; created_at: string; updated_at: string;
  users: { id: string; name: string; image: string | null } | null;
};

type CommentRow = {
  id: string; post_id: string; user_id: string; parent_id: string | null;
  content: string; like_count: number; is_deleted: boolean;
  created_at: string; updated_at: string;
  users: { id: string; name: string; image: string | null } | null;
};

function toAuthor(user: PostRow["users"], fallbackId: string): AuthorInfo {
  return user
    ? { id: user.id, name: user.name, image: user.image }
    : { id: fallbackId, name: "탈퇴한 유저", image: null };
}

function toPostDTO(row: PostRow, likedSet: Set<string>): PostDTO {
  return {
    id: row.id,
    category: row.category as PostCategory,
    title: row.title,
    content: row.content,
    author: toAuthor(row.users, row.user_id),
    likeCount: row.like_count,
    commentCount: row.comment_count,
    viewCount: row.view_count,
    isPinned: row.is_pinned,
    isLiked: likedSet.has(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildCommentTree(rows: CommentRow[], likedSet: Set<string>, parentId: string | null = null): CommentDTO[] {
  return rows
    .filter((r) => r.parent_id === parentId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((r) => ({
      id: r.id, postId: r.post_id, parentId: r.parent_id,
      content: r.is_deleted ? "[삭제된 댓글입니다]" : r.content,
      author: toAuthor(r.users, r.user_id),
      likeCount: r.like_count,
      isLiked: likedSet.has(r.id),
      isDeleted: r.is_deleted,
      replies: buildCommentTree(rows, likedSet, r.id),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
}

// ── 유저 upsert ───────────────────────────────────────────────────────────────
export async function upsertUser(user: Omit<DbUser, "role" | "createdAt">): Promise<void> {
  await supabase.from("users").upsert(
    { id: user.id, name: user.name, image: user.image, email: user.email },
    { onConflict: "id" }
  );
}

// ── 게시글 목록 ───────────────────────────────────────────────────────────────
export async function getPosts(opts: {
  category?: PostCategory | "all";
  page: number;
  pageSize: number;
  userId: string | null;
}): Promise<PostsResponse> {
  const { category, page, pageSize, userId } = opts;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("posts")
    .select("*, users!user_id(id,name,image)", { count: "exact" })
    .eq("is_deleted", false)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (category && category !== "all") query = query.eq("category", category);

  const { data, count } = await query;
  const postRows = (data ?? []) as unknown as PostRow[];

  let likedSet = new Set<string>();
  if (userId && postRows.length > 0) {
    const { data: likes } = await supabase
      .from("likes").select("target_id")
      .eq("user_id", userId).eq("target_type", "post")
      .in("target_id", postRows.map((r) => r.id));
    likedSet = new Set(likes?.map((l) => l.target_id) ?? []);
  }

  const total = count ?? 0;
  return { posts: postRows.map((r) => toPostDTO(r, likedSet)), total, page, pageSize, hasMore: page * pageSize < total };
}

// ── 게시글 단건 ───────────────────────────────────────────────────────────────
export async function getPost(id: string, userId: string | null): Promise<PostDTO | null> {
  const { data } = await supabase
    .from("posts").select("*, users!user_id(id,name,image)")
    .eq("id", id).eq("is_deleted", false).single();
  if (!data) return null;

  // 조회수 증가 (비동기, 결과 무시)
  supabase.rpc("increment_post_view", { p_id: id }).then(() => {});

  let likedSet = new Set<string>();
  if (userId) {
    const { data: likes } = await supabase
      .from("likes").select("target_id")
      .eq("user_id", userId).eq("target_type", "post").eq("target_id", id);
    likedSet = new Set(likes?.map((l) => l.target_id) ?? []);
  }

  return toPostDTO(data as unknown as PostRow, likedSet);
}

// ── 게시글 작성 ───────────────────────────────────────────────────────────────
export async function createPost(input: CreatePostInput, userId: string): Promise<PostDTO> {
  // users 테이블에 해당 userId가 없으면 FK constraint 위반 → upsert로 보장
  await supabase.from("users").upsert(
    { id: userId, name: "알 수 없음", email: "" },
    { onConflict: "id", ignoreDuplicates: true }
  );

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: userId, category: input.category, title: input.title.slice(0, 100), content: input.content.slice(0, 10000) })
    .select("*, users!user_id(id,name,image)").single();
  if (error || !data) throw new Error(error?.message ?? "insert failed");
  return toPostDTO(data as unknown as PostRow, new Set());
}

// ── 게시글 수정 ───────────────────────────────────────────────────────────────
export async function updatePost(id: string, input: UpdatePostInput, userId: string): Promise<PostDTO | null> {
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title) updates.title = input.title.slice(0, 100);
  if (input.content) updates.content = input.content.slice(0, 10000);
  if (input.category) updates.category = input.category;

  const { data } = await supabase
    .from("posts").update(updates)
    .eq("id", id).eq("user_id", userId).eq("is_deleted", false)
    .select("*, users!user_id(id,name,image)").single();
  if (!data) return null;
  return toPostDTO(data as unknown as PostRow, new Set());
}

// ── 게시글 삭제 (소프트) ──────────────────────────────────────────────────────
export async function deletePost(id: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("posts").update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq("id", id).eq("user_id", userId).select("id").single();
  return !!data;
}

// ── 게시글 좋아요 토글 ────────────────────────────────────────────────────────
export async function togglePostLike(postId: string, userId: string): Promise<{ liked: boolean; count: number }> {
  const { data: existing } = await supabase
    .from("likes").select("id")
    .eq("user_id", userId).eq("target_type", "post").eq("target_id", postId).maybeSingle();

  const { data: post, error: postError } = await supabase.from("posts").select("like_count").eq("id", postId).maybeSingle();
  if (postError || !post) return { liked: false, count: 0 };
  const current = post.like_count ?? 0;

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
    const newCount = Math.max(0, current - 1);
    await supabase.from("posts").update({ like_count: newCount }).eq("id", postId);
    return { liked: false, count: newCount };
  } else {
    await supabase.from("likes").insert({ user_id: userId, target_type: "post", target_id: postId });
    const newCount = current + 1;
    await supabase.from("posts").update({ like_count: newCount }).eq("id", postId);
    return { liked: true, count: newCount };
  }
}

// ── 댓글 목록 ─────────────────────────────────────────────────────────────────
export async function getComments(postId: string, userId: string | null): Promise<CommentDTO[]> {
  const { data } = await supabase
    .from("comments").select("*, users!user_id(id,name,image)")
    .eq("post_id", postId).order("created_at", { ascending: true });

  const rows = (data ?? []) as unknown as CommentRow[];

  let likedSet = new Set<string>();
  if (userId && rows.length > 0) {
    const { data: likes } = await supabase
      .from("likes").select("target_id")
      .eq("user_id", userId).eq("target_type", "comment")
      .in("target_id", rows.map((r) => r.id));
    likedSet = new Set(likes?.map((l) => l.target_id) ?? []);
  }

  return buildCommentTree(rows, likedSet);
}

// ── 댓글 작성 ─────────────────────────────────────────────────────────────────
export async function createComment(postId: string, input: CreateCommentInput, userId: string): Promise<CommentDTO | null> {
  const { data: post } = await supabase
    .from("posts").select("id,comment_count").eq("id", postId).eq("is_deleted", false).single();
  if (!post) return null;

  // parentId 검증 — 반드시 같은 post의 댓글이어야 함 (IDOR 방지)
  if (input.parentId) {
    const { data: parentComment } = await supabase
      .from("comments").select("post_id").eq("id", input.parentId).single();
    if (!parentComment || parentComment.post_id !== postId) return null;
  }

  const { data } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: userId, parent_id: input.parentId ?? null, content: input.content.slice(0, 1000) })
    .select("*, users!user_id(id,name,image)").single();

  await supabase.from("posts").update({ comment_count: (post.comment_count ?? 0) + 1 }).eq("id", postId);

  const r = data as unknown as CommentRow;
  return {
    id: r.id, postId: r.post_id, parentId: r.parent_id, content: r.content,
    author: toAuthor(r.users, r.user_id),
    likeCount: 0, isLiked: false, isDeleted: false, replies: [],
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ── 댓글 수정 ─────────────────────────────────────────────────────────────────
export async function updateComment(id: string, content: string, userId: string): Promise<CommentDTO | null> {
  const { data } = await supabase
    .from("comments")
    .update({ content: content.slice(0, 1000), updated_at: new Date().toISOString() })
    .eq("id", id).eq("user_id", userId).eq("is_deleted", false)
    .select("*, users!user_id(id,name,image)").single();
  if (!data) return null;
  const r = data as unknown as CommentRow;
  return {
    id: r.id, postId: r.post_id, parentId: r.parent_id, content: r.content,
    author: toAuthor(r.users, r.user_id),
    likeCount: r.like_count, isLiked: false, isDeleted: false, replies: [],
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ── 댓글 삭제 ─────────────────────────────────────────────────────────────────
export async function deleteComment(id: string, userId: string): Promise<boolean> {
  const { data: comment } = await supabase
    .from("comments").select("id,post_id").eq("id", id).eq("user_id", userId).single();
  if (!comment) return false;

  await supabase.from("comments")
    .update({ is_deleted: true, updated_at: new Date().toISOString() }).eq("id", id);

  const { data: post } = await supabase.from("posts").select("comment_count").eq("id", comment.post_id).single();
  if (post) {
    await supabase.from("posts").update({ comment_count: Math.max(0, (post.comment_count ?? 1) - 1) }).eq("id", comment.post_id);
  }
  return true;
}

// ── 댓글 좋아요 토글 ─────────────────────────────────────────────────────────
export async function toggleCommentLike(id: string, userId: string): Promise<{ liked: boolean; count: number }> {
  const { data: existing } = await supabase
    .from("likes").select("id")
    .eq("user_id", userId).eq("target_type", "comment").eq("target_id", id).maybeSingle();

  const { data: comment, error: commentError } = await supabase.from("comments").select("like_count").eq("id", id).maybeSingle();
  if (commentError || !comment) return { liked: false, count: 0 };
  const current = comment.like_count ?? 0;

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
    const newCount = Math.max(0, current - 1);
    await supabase.from("comments").update({ like_count: newCount }).eq("id", id);
    return { liked: false, count: newCount };
  } else {
    await supabase.from("likes").insert({ user_id: userId, target_type: "comment", target_id: id });
    const newCount = current + 1;
    await supabase.from("comments").update({ like_count: newCount }).eq("id", id);
    return { liked: true, count: newCount };
  }
}
