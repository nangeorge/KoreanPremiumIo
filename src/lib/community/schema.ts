// ──────────────────────────────────────────────────────────────────────────────
// 커뮤니티 DB 스키마 타입 정의
// 실제 DB 연결 시 이 타입들이 Supabase/Prisma 테이블과 1:1 매핑됩니다.
// ──────────────────────────────────────────────────────────────────────────────

// ── 카테고리 ──────────────────────────────────────────────────────────────────
export type PostCategory = "free" | "analysis" | "news" | "question";

export const POST_CATEGORIES: PostCategory[] = ["free", "analysis", "news", "question"];

export const CATEGORY_LABELS: Record<PostCategory, { ko: string; en: string; zh: string }> = {
  free:     { ko: "자유",  en: "Free",     zh: "自由" },
  analysis: { ko: "분석",  en: "Analysis", zh: "分析" },
  news:     { ko: "뉴스",  en: "News",     zh: "新闻" },
  question: { ko: "질문",  en: "Question", zh: "问答" },
};

// ── users 테이블 ──────────────────────────────────────────────────────────────
// CREATE TABLE users (
//   id         TEXT PRIMARY KEY,       -- Google OAuth sub
//   name       TEXT NOT NULL,
//   image      TEXT,
//   email      TEXT NOT NULL UNIQUE,
//   role       TEXT NOT NULL DEFAULT 'user',
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
export interface DbUser {
  id: string;
  name: string;
  image: string | null;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

// API 응답에서 쓰는 경량 유저 정보
export interface AuthorInfo {
  id: string;
  name: string;
  image: string | null;
}

// ── posts 테이블 ──────────────────────────────────────────────────────────────
// CREATE TABLE posts (
//   id            TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id       TEXT NOT NULL REFERENCES users(id),
//   category      TEXT NOT NULL,
//   title         TEXT NOT NULL CHECK (char_length(title) <= 100),
//   content       TEXT NOT NULL CHECK (char_length(content) <= 10000),
//   like_count    INT NOT NULL DEFAULT 0,
//   comment_count INT NOT NULL DEFAULT 0,
//   view_count    INT NOT NULL DEFAULT 0,
//   is_pinned     BOOLEAN NOT NULL DEFAULT FALSE,
//   is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
//   created_at    TIMESTAMPTZ DEFAULT NOW(),
//   updated_at    TIMESTAMPTZ DEFAULT NOW()
// );
// CREATE INDEX ON posts(category, created_at DESC);
// CREATE INDEX ON posts(user_id);
export interface DbPost {
  id: string;
  userId: string;
  category: PostCategory;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 인메모리 전용: 좋아요 userId Set 포함
export interface DbPostInternal extends DbPost {
  likedBy: Set<string>;
}

// API 응답용 (author 조인, isLiked 계산)
export interface PostDTO {
  id: string;
  category: PostCategory;
  title: string;
  content: string;
  author: AuthorInfo;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: PostDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ── comments 테이블 ───────────────────────────────────────────────────────────
// CREATE TABLE comments (
//   id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
//   post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
//   user_id    TEXT NOT NULL REFERENCES users(id),
//   parent_id  TEXT REFERENCES comments(id) ON DELETE CASCADE,  -- NULL = 최상위
//   content    TEXT NOT NULL CHECK (char_length(content) <= 1000),
//   like_count INT NOT NULL DEFAULT 0,
//   is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );
// CREATE INDEX ON comments(post_id, created_at ASC);
// CREATE INDEX ON comments(parent_id);
export interface DbComment {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  content: string;
  likeCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbCommentInternal extends DbComment {
  likedBy: Set<string>;
}

export interface CommentDTO {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  author: AuthorInfo;
  likeCount: number;
  isLiked: boolean;
  isDeleted: boolean;
  replies: CommentDTO[];
  createdAt: string;
  updatedAt: string;
}

// ── likes 테이블 ──────────────────────────────────────────────────────────────
// CREATE TABLE likes (
//   id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id     TEXT NOT NULL REFERENCES users(id),
//   target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
//   target_id   TEXT NOT NULL,
//   created_at  TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE (user_id, target_type, target_id)  -- 중복 좋아요 방지
// );
// CREATE INDEX ON likes(target_type, target_id);
export interface DbLike {
  id: string;
  userId: string;
  targetType: "post" | "comment";
  targetId: string;
  createdAt: string;
}

// ── API 요청 바디 타입 ─────────────────────────────────────────────────────────
export interface CreatePostInput {
  category: PostCategory;
  title: string;
  content: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  category?: PostCategory;
}

export interface CreateCommentInput {
  content: string;
  parentId?: string;
}
