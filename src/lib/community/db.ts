// ──────────────────────────────────────────────────────────────────────────────
// 인메모리 Mock DB
// DB 연결 시 이 파일의 각 함수 내부를 ORM/SQL 쿼리로 교체하면 됩니다.
// global 변수를 사용해 Next.js Fast Refresh 시에도 데이터 유지.
// ──────────────────────────────────────────────────────────────────────────────
import type {
  DbPostInternal, DbCommentInternal, DbUser,
  AuthorInfo, PostDTO, PostsResponse, CommentDTO,
  CreatePostInput, UpdatePostInput, CreateCommentInput,
  PostCategory,
} from "./schema";

interface CommunityDB {
  posts: Map<string, DbPostInternal>;
  comments: Map<string, DbCommentInternal>;
  users: Map<string, DbUser>;
}

declare global {
  // eslint-disable-next-line no-var
  var __communityDB: CommunityDB | undefined;
}

if (!global.__communityDB) {
  global.__communityDB = { posts: new Map(), comments: new Map(), users: new Map() };
  seedDB(global.__communityDB);
}

const db = global.__communityDB;

// ── 유틸 ──────────────────────────────────────────────────────────────────────
function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

function toAuthor(user: DbUser): AuthorInfo {
  return { id: user.id, name: user.name, image: user.image };
}

function toPostDTO(post: DbPostInternal, userId: string | null): PostDTO {
  const user = db.users.get(post.userId);
  const author: AuthorInfo = user
    ? toAuthor(user)
    : { id: post.userId, name: "탈퇴한 유저", image: null };
  return {
    id: post.id,
    category: post.category,
    title: post.title,
    content: post.content,
    author,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    isPinned: post.isPinned,
    isLiked: userId ? post.likedBy.has(userId) : false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function toCommentDTO(
  comment: DbCommentInternal,
  userId: string | null,
  repliesMap: Map<string, DbCommentInternal[]>
): CommentDTO {
  const user = db.users.get(comment.userId);
  const author: AuthorInfo = user
    ? toAuthor(user)
    : { id: comment.userId, name: "탈퇴한 유저", image: null };

  const replyList = repliesMap.get(comment.id) ?? [];
  const replies = replyList.map((r) => toCommentDTO(r, userId, repliesMap));

  return {
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId,
    content: comment.isDeleted ? "[삭제된 댓글입니다]" : comment.content,
    author,
    likeCount: comment.likeCount,
    isLiked: userId ? comment.likedBy.has(userId) : false,
    isDeleted: comment.isDeleted,
    replies,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

// ── 시드 데이터 ────────────────────────────────────────────────────────────────
function seedDB(target: CommunityDB) {
  const seedUser: DbUser = {
    id: "seed-user-1",
    name: "김치왕",
    image: null,
    email: "kimchi@example.com",
    role: "admin",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  };
  target.users.set(seedUser.id, seedUser);

  const seedPosts: Array<{ category: PostCategory; title: string; content: string }> = [
    {
      category: "analysis",
      title: "김프 10% 돌파 시 역사적으로 어떤 일이 있었나",
      content: "2021년 4월, 2024년 3월 모두 김프가 10%를 넘어설 때 단기 고점이 형성됐습니다.\n\n이번에도 비슷한 패턴이 보입니다. 업비트 매수 대기 물량이 급증했고, 해외 선물 펀딩비도 양수로 전환됐습니다.\n\n여러분의 생각은 어떤가요?",
    },
    {
      category: "free",
      title: "역프 때 매수한 사람들 후기 공유",
      content: "역프 -3% 찍었을 때 BTC 담았는데 지금 +18%네요. 김프 지표가 이렇게 유용할 줄 몰랐습니다.",
    },
    {
      category: "question",
      title: "역김프가 생기는 이유가 뭔가요?",
      content: "업비트보다 해외 거래소 가격이 더 비싼 경우가 있더라고요. 이게 어떤 메커니즘인지 설명해주실 분 계신가요?",
    },
    {
      category: "news",
      title: "업비트, 신규 코인 15개 KRW 마켓 상장 예정",
      content: "업비트가 다음 달 15개 신규 코인을 KRW 마켓에 상장할 예정이라고 합니다. 상장 직후 김프가 급등할 가능성이 있으니 주목해볼 필요가 있습니다.",
    },
  ];

  const t = Date.now() - 86400000;
  for (let i = 0; i < seedPosts.length; i++) {
    const id = `seed-post-${i + 1}`;
    target.posts.set(id, {
      id,
      userId: seedUser.id,
      category: seedPosts[i].category,
      title: seedPosts[i].title,
      content: seedPosts[i].content,
      likeCount: Math.floor(Math.random() * 20),
      commentCount: 0,
      viewCount: Math.floor(Math.random() * 200),
      isPinned: i === 0,
      isDeleted: false,
      likedBy: new Set(),
      createdAt: new Date(t - i * 3600000).toISOString(),
      updatedAt: new Date(t - i * 3600000).toISOString(),
    });
  }
}

// ── 유저 upsert (OAuth 로그인 시 호출) ────────────────────────────────────────
export function upsertUser(user: Omit<DbUser, "role" | "createdAt">): DbUser {
  // SQL: INSERT INTO users ... ON CONFLICT (id) DO UPDATE SET name=..., image=...
  const existing = db.users.get(user.id);
  if (existing) {
    existing.name = user.name;
    existing.image = user.image;
    return existing;
  }
  const newUser: DbUser = { ...user, role: "user", createdAt: now() };
  db.users.set(user.id, newUser);
  return newUser;
}

// ── 게시글 목록 ────────────────────────────────────────────────────────────────
export function getPosts(opts: {
  category?: PostCategory | "all";
  page: number;
  pageSize: number;
  userId: string | null;
}): PostsResponse {
  // SQL: SELECT * FROM posts WHERE is_deleted=false [AND category=?] ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?
  const { category, page, pageSize, userId } = opts;
  const all = [...db.posts.values()]
    .filter((p) => !p.isDeleted && (category === "all" || !category || p.category === category))
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });

  const total = all.length;
  const posts = all.slice((page - 1) * pageSize, page * pageSize).map((p) => toPostDTO(p, userId));
  return { posts, total, page, pageSize, hasMore: page * pageSize < total };
}

// ── 게시글 단건 ────────────────────────────────────────────────────────────────
export function getPost(id: string, userId: string | null): PostDTO | null {
  // SQL: SELECT * FROM posts WHERE id=? AND is_deleted=false
  const post = db.posts.get(id);
  if (!post || post.isDeleted) return null;
  post.viewCount++;
  return toPostDTO(post, userId);
}

// ── 게시글 작성 ────────────────────────────────────────────────────────────────
export function createPost(input: CreatePostInput, userId: string): PostDTO {
  // SQL: INSERT INTO posts (id, user_id, category, title, content, ...) VALUES (...)
  const id = uid();
  const post: DbPostInternal = {
    id, userId,
    category: input.category,
    title: input.title.slice(0, 100),
    content: input.content.slice(0, 10000),
    likeCount: 0, commentCount: 0, viewCount: 0,
    isPinned: false, isDeleted: false,
    likedBy: new Set(),
    createdAt: now(), updatedAt: now(),
  };
  db.posts.set(id, post);
  return toPostDTO(post, userId);
}

// ── 게시글 수정 ────────────────────────────────────────────────────────────────
export function updatePost(id: string, input: UpdatePostInput, userId: string): PostDTO | null {
  // SQL: UPDATE posts SET ... WHERE id=? AND user_id=?
  const post = db.posts.get(id);
  if (!post || post.isDeleted || post.userId !== userId) return null;
  if (input.title) post.title = input.title.slice(0, 100);
  if (input.content) post.content = input.content.slice(0, 10000);
  if (input.category) post.category = input.category;
  post.updatedAt = now();
  return toPostDTO(post, userId);
}

// ── 게시글 삭제 (소프트) ──────────────────────────────────────────────────────
export function deletePost(id: string, userId: string): boolean {
  // SQL: UPDATE posts SET is_deleted=true WHERE id=? AND user_id=?
  const post = db.posts.get(id);
  if (!post || post.userId !== userId) return false;
  post.isDeleted = true;
  post.updatedAt = now();
  return true;
}

// ── 게시글 좋아요 토글 ─────────────────────────────────────────────────────────
export function togglePostLike(postId: string, userId: string): { liked: boolean; count: number } {
  // SQL: INSERT INTO likes ... ON CONFLICT DO DELETE / UPDATE posts SET like_count=...
  const post = db.posts.get(postId);
  if (!post || post.isDeleted) return { liked: false, count: 0 };
  if (post.likedBy.has(userId)) {
    post.likedBy.delete(userId);
    post.likeCount = Math.max(0, post.likeCount - 1);
    return { liked: false, count: post.likeCount };
  }
  post.likedBy.add(userId);
  post.likeCount++;
  return { liked: true, count: post.likeCount };
}

// ── 댓글 목록 ─────────────────────────────────────────────────────────────────
export function getComments(postId: string, userId: string | null): CommentDTO[] {
  // SQL: SELECT * FROM comments WHERE post_id=? ORDER BY created_at ASC
  const all = [...db.comments.values()].filter((c) => c.postId === postId);
  const roots = all.filter((c) => !c.parentId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const repliesMap = new Map<string, DbCommentInternal[]>();
  for (const c of all) {
    if (c.parentId) {
      const list = repliesMap.get(c.parentId) ?? [];
      list.push(c);
      repliesMap.set(c.parentId, list);
    }
  }
  for (const [k, v] of repliesMap) {
    repliesMap.set(k, v.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
  }
  return roots.map((c) => toCommentDTO(c, userId, repliesMap));
}

// ── 댓글 작성 ─────────────────────────────────────────────────────────────────
export function createComment(
  postId: string, input: CreateCommentInput, userId: string
): CommentDTO | null {
  // SQL: INSERT INTO comments (...) VALUES (...); UPDATE posts SET comment_count=comment_count+1
  const post = db.posts.get(postId);
  if (!post || post.isDeleted) return null;
  const id = uid();
  const comment: DbCommentInternal = {
    id, postId, userId,
    parentId: input.parentId ?? null,
    content: input.content.slice(0, 1000),
    likeCount: 0, isDeleted: false,
    likedBy: new Set(),
    createdAt: now(), updatedAt: now(),
  };
  db.comments.set(id, comment);
  post.commentCount++;
  return toCommentDTO(comment, userId, new Map());
}

// ── 댓글 수정 ─────────────────────────────────────────────────────────────────
export function updateComment(id: string, content: string, userId: string): CommentDTO | null {
  // SQL: UPDATE comments SET content=?, updated_at=NOW() WHERE id=? AND user_id=?
  const comment = db.comments.get(id);
  if (!comment || comment.isDeleted || comment.userId !== userId) return null;
  comment.content = content.slice(0, 1000);
  comment.updatedAt = now();
  return toCommentDTO(comment, userId, new Map());
}

// ── 댓글 삭제 ─────────────────────────────────────────────────────────────────
export function deleteComment(id: string, userId: string): boolean {
  // SQL: UPDATE comments SET is_deleted=true WHERE id=? AND user_id=?
  // + UPDATE posts SET comment_count=comment_count-1
  const comment = db.comments.get(id);
  if (!comment || comment.userId !== userId) return false;
  comment.isDeleted = true;
  comment.updatedAt = now();
  const post = db.posts.get(comment.postId);
  if (post) post.commentCount = Math.max(0, post.commentCount - 1);
  return true;
}

// ── 댓글 좋아요 토글 ──────────────────────────────────────────────────────────
export function toggleCommentLike(id: string, userId: string): { liked: boolean; count: number } {
  // SQL: INSERT INTO likes ... ON CONFLICT DO DELETE / UPDATE comments SET like_count=...
  const comment = db.comments.get(id);
  if (!comment) return { liked: false, count: 0 };
  if (comment.likedBy.has(userId)) {
    comment.likedBy.delete(userId);
    comment.likeCount = Math.max(0, comment.likeCount - 1);
    return { liked: false, count: comment.likeCount };
  }
  comment.likedBy.add(userId);
  comment.likeCount++;
  return { liked: true, count: comment.likeCount };
}
