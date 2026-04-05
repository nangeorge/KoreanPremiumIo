# 커뮤니티 기능 구현 TODO

## 진행 상황

- [x] next-auth 설치
- [ ] DB 스키마 타입 정의 (`src/lib/community/schema.ts`)
- [ ] 인메모리 Mock DB 생성 (`src/lib/community/db.ts`)
- [ ] NextAuth 설정 (`src/auth.ts` + type augmentation)
- [ ] Auth API route 생성 (`src/app/api/auth/[...nextauth]/route.ts`)
- [ ] 커뮤니티 API routes 생성 (posts / comments / likes)
- [ ] Auth 컴포넌트 생성 (SessionProvider, LoginButton, UserMenu)
- [ ] 커뮤니티 컴포넌트 생성 (PostCard, PostForm, PostDetail, CommentSection)
- [ ] 커뮤니티 페이지 생성 (목록 / 글쓰기 / 상세)
- [ ] TabNav + locale layout + i18n 업데이트
- [ ] 빌드 확인 및 커밋

---

## 생성할 파일 목록

### Auth (next-auth v5)
```
src/auth.ts
src/types/next-auth.d.ts
src/components/auth/SessionProviderWrapper.tsx
src/components/auth/LoginButton.tsx
src/components/auth/UserMenu.tsx
src/app/api/auth/[...nextauth]/route.ts
```

### 타입 & Mock DB
```
src/lib/community/schema.ts     # TypeScript 타입 (DB 테이블 설계)
src/lib/community/db.ts         # 인메모리 저장소 (global 변수)
```

### API Routes
```
src/app/api/community/posts/route.ts                    # GET(목록) / POST(작성)
src/app/api/community/posts/[id]/route.ts               # GET / PUT / DELETE
src/app/api/community/posts/[id]/likes/route.ts         # POST (토글)
src/app/api/community/posts/[id]/comments/route.ts      # GET / POST
src/app/api/community/comments/[id]/route.ts            # PUT / DELETE
src/app/api/community/comments/[id]/likes/route.ts      # POST (토글)
```

### 페이지
```
src/app/[locale]/community/page.tsx           # 게시글 목록 + 카테고리 필터
src/app/[locale]/community/new/page.tsx       # 글쓰기
src/app/[locale]/community/[postId]/page.tsx  # 게시글 상세 + 댓글
```

### 컴포넌트
```
src/components/community/PostList.tsx
src/components/community/PostCard.tsx
src/components/community/PostForm.tsx
src/components/community/PostDetail.tsx
src/components/community/CommentSection.tsx
src/components/community/CommentItem.tsx
src/components/community/LikeButton.tsx
```

### 수정할 파일
```
src/components/layout/TabNav.tsx    # Community 탭 추가
src/app/[locale]/layout.tsx         # SessionProviderWrapper 추가
messages/ko.json                    # community 키 추가
messages/en.json
messages/zh.json
.env.local                          # AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET 추가
```

---

## DB 테이블 설계

### users
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | string (PK) | Google OAuth sub |
| name | string | 표시 이름 |
| image | string \| null | 프로필 이미지 URL |
| email | string | 이메일 |
| role | "user" \| "admin" | 권한 |
| createdAt | timestamp | 가입일 |

### posts
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | string (PK) | UUID |
| userId | string (FK → users) | 작성자 |
| category | "free" \| "analysis" \| "news" \| "question" | 카테고리 |
| title | string | 제목 (max 100) |
| content | string | 본문 (max 10000) |
| likeCount | int | 좋아요 수 (denormalized) |
| commentCount | int | 댓글 수 (denormalized) |
| viewCount | int | 조회수 |
| isPinned | boolean | 공지 고정 |
| isDeleted | boolean | 소프트 삭제 |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### comments
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | string (PK) | UUID |
| postId | string (FK → posts) | 게시글 |
| userId | string (FK → users) | 작성자 |
| parentId | string \| null | null=최상위, string=대댓글 |
| content | string | 내용 (max 1000) |
| likeCount | int | 좋아요 수 |
| isDeleted | boolean | 소프트 삭제 |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### likes
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | string (PK) | UUID |
| userId | string (FK → users) | 좋아요 누른 유저 |
| targetType | "post" \| "comment" | 대상 타입 |
| targetId | string | 대상 id |
| createdAt | timestamp | |

> **인덱스**: `(userId, targetType, targetId)` UNIQUE — 중복 좋아요 방지

---

## 환경변수 (.env.local 추가 항목)
```env
AUTH_SECRET=                  # openssl rand -base64 32
AUTH_GOOGLE_ID=               # Google Cloud Console
AUTH_GOOGLE_SECRET=           # Google Cloud Console
NEXTAUTH_URL=http://localhost:3000
```

### Google Cloud Console 설정
1. [console.cloud.google.com](https://console.cloud.google.com) → API 및 서비스 → 사용자 인증 정보
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발)
   - `https://koreanpremium.io/api/auth/callback/google` (프로덕션)
