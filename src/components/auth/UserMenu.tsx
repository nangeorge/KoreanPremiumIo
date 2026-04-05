"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LoginButton } from "./LoginButton";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") {
    return <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />;
  }

  if (!session) {
    return <LoginButton className="flex items-center gap-1.5 rounded border border-[var(--border-color)] px-2.5 py-1 text-xs font-medium text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:bg-white/5 transition-colors" />;
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full p-0.5 hover:ring-2 hover:ring-white/20 transition-all">
        {session.user.image ? (
          <Image src={session.user.image} alt={session.user.name ?? ""} width={28} height={28} className="rounded-full" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">
            {(session.user.name ?? "?")[0].toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-[var(--border-color)] bg-[var(--bg-raised)] shadow-xl py-1">
          <div className="px-3 py-2 border-b border-[var(--border-color)]">
            <p className="text-xs font-semibold text-[var(--fg)] truncate">{session.user.name}</p>
            <p className="text-[10px] text-[var(--fg-muted)] truncate">{session.user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full px-3 py-2 text-left text-xs text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:bg-white/5 transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
