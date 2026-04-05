import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Session } from "next-auth";

type AuthedHandler<T> = (
  req: Request,
  ctx: { params: Promise<T>; session: Session & { user: { id: string } } }
) => Promise<Response>;

type AnonHandler<T> = (
  req: Request,
  ctx: { params: Promise<T>; session: Session | null }
) => Promise<Response>;

/**
 * 인증 필수 라우트 래퍼
 * 미인증 시 자동으로 401 반환. 핸들러에서 session.user.id 타입 보장.
 */
export function withAuth<T = Record<string, string>>(handler: AuthedHandler<T>) {
  return async (req: Request, ctx: { params: Promise<T> }) => {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return handler(req, { ...ctx, session: session as Session & { user: { id: string } } });
  };
}

/**
 * 선택적 인증 라우트 래퍼
 * 인증 여부와 관계없이 실행. session은 null일 수 있음.
 */
export function withOptionalAuth<T = Record<string, string>>(handler: AnonHandler<T>) {
  return async (req: Request, ctx: { params: Promise<T> }) => {
    const session = await auth();
    return handler(req, { ...ctx, session });
  };
}
