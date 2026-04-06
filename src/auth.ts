import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUser } from "@/lib/community/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, profile }) {
      // Google 프로필 정보를 토큰에 저장
      if (profile) {
        token.picture = (profile as { picture?: string }).picture ?? token.picture;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // 로그인 시 유저 정보 DB에 upsert
      // account.providerAccountId = Google sub → token.sub과 동일하므로 session.user.id와 일치
      const userId = account?.providerAccountId ?? user.id;
      if (account?.provider === "google" && userId) {
        await upsertUser({
          id: userId,
          name: user.name ?? "이름 없음",
          image: user.image ?? null,
          email: user.email ?? "",
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
