"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/app/api/chat/route";

const NICKNAMES_KO = [
  "익명고래", "익명개미", "익명황소", "익명곰", "익명돌고래", "익명상어",
  "익명독수리", "익명여우", "익명늑대", "익명호랑이", "익명사자", "익명팬더",
  "익명치타", "익명악어", "익명매", "익명펭귄", "익명코끼리", "익명기린",
  "익명코뿔소", "익명재규어", "익명비버", "익명수달", "익명너구리", "익명오리",
  "익명까치", "익명부엉이", "익명두루미", "익명참새", "익명갈매기", "익명물개",
];
const NICKNAMES_EN = [
  "AnonWhale", "AnonBull", "AnonBear", "AnonShark", "AnonFish",
  "AnonEagle", "AnonFox", "AnonWolf", "AnonTiger", "AnonLion",
  "AnonPanda", "AnonCheetah", "AnonHawk", "AnonOwl", "AnonCrane",
  "AnonOtter", "AnonBeaver", "AnonRaccoon", "AnonPenguin", "AnonSeal",
  "AnonDolphin", "AnonFalcon", "AnonRaven", "AnonBadger", "AnonMoose",
  "AnonBison", "AnonLynx", "AnonCoyote", "AnonHeron", "AnonWalrus",
];
const NICKNAMES_ZH = [
  "匿名鲸鱼", "匿名公牛", "匿名熊", "匿名鲨鱼", "匿名海豚",
  "匿名老鹰", "匿名狐狸", "匿名狼", "匿名老虎", "匿名狮子",
  "匿名熊猫", "匿名猎豹", "匿名猫头鹰", "匿名仙鹤", "匿名企鹅",
  "匿名水獭", "匿名海狸", "匿名浣熊", "匿名海豹", "匿名秃鹰",
  "匿名麋鹿", "匿名野牛", "匿名山猫", "匿名郊狼", "匿名海象",
  "匿名黑豹", "匿名雪豹", "匿名独角鲸", "匿名鬣狗", "匿名土狼",
];

const BADGE_ICON: Record<string, string> = { whale: "🐳", bear: "🐻", bull: "🐂" };

const LABELS = {
  ko: {
    title: "실시간 채팅",
    placeholder: "메시지 입력... (200자)",
    nickname: "닉네임",
    send: "전송",
    online: "명 접속 중",
    empty: "첫 메시지를 남겨보세요 👋",
    rules: "건전한 대화 부탁드립니다",
    changeNick: "닉네임 변경",
  },
  en: {
    title: "Live Chat",
    placeholder: "Type a message... (200 chars)",
    nickname: "Nickname",
    send: "Send",
    online: " online",
    empty: "Be the first to say hi 👋",
    rules: "Please keep it friendly",
    changeNick: "Change nickname",
  },
  zh: {
    title: "实时聊天",
    placeholder: "输入消息... (200字)",
    nickname: "昵称",
    send: "发送",
    online: " 人在线",
    empty: "来打个招呼吧 👋",
    rules: "请保持友好交流",
    changeNick: "更改昵称",
  },
};

function timeLabel(ts: number): string {
  return new Date(ts).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

function getRandomNick(locale: string): string {
  const pool = locale === "zh" ? NICKNAMES_ZH : locale === "en" ? NICKNAMES_EN : NICKNAMES_KO;
  return pool[Math.floor(Math.random() * pool.length)] + Math.floor(Math.random() * 99 + 1);
}

export function ChatWidget() {
  const locale = useLocale();
  const t = LABELS[locale as keyof typeof LABELS] ?? LABELS.ko;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [editingNick, setEditingNick] = useState(false);
  const [nickInput, setNickInput] = useState("");
  const [unread, setUnread] = useState(0);
  const [lastTs, setLastTs] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 닉네임 초기화
  useEffect(() => {
    const saved = localStorage.getItem("chat_nickname");
    setNickname(saved || getRandomNick(locale));
  }, [locale]);

  // 폴링으로 새 메시지 가져오기
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?after=${lastTs}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.messages?.length) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const newMsgs = data.messages.filter((m: ChatMessage) => !ids.has(m.id));
          if (!newMsgs.length) return prev;
          if (!isOpen) setUnread((u) => u + newMsgs.length);
          setLastTs(data.serverTime);
          return [...prev, ...newMsgs].slice(-100);
        });
      }
    } catch { /* silent */ }
  }, [lastTs, isOpen]);

  // 최초 로드
  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages ?? []);
        setLastTs(data.serverTime ?? 0);
      })
      .catch(() => {});
  }, []);

  // 3초마다 폴링
  useEffect(() => {
    const id = setInterval(fetchMessages, 3000);
    return () => clearInterval(id);
  }, [fetchMessages]);

  // 채팅 열릴 때 스크롤 + 읽음 처리
  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // 새 메시지 자동 스크롤
  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isSending) return;
    setIsSending(true);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, nickname, locale }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          if (ids.has(data.message.id)) return prev;
          return [...prev, data.message].slice(-100);
        });
        setLastTs(data.message.timestamp);
      }
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  function saveNickname() {
    const n = nickInput.trim().slice(0, 20);
    if (n) {
      setNickname(n);
      localStorage.setItem("chat_nickname", n);
    }
    setEditingNick(false);
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300",
          "bg-white hover:scale-110 active:scale-95",
          isOpen && "rotate-180"
        )}
        aria-label="채팅 열기"
      >
        {isOpen ? (
          <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </>
        )}
      </button>

      {/* 채팅 패널 */}
      <div
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden shadow-2xl border border-white/10 transition-all duration-300",
          "bg-[var(--bg-raised)]",
          // 모바일: 화면 전체폭 (좌우 16px 여백), 데스크탑: 고정 너비
          "bottom-0 left-0 right-0 rounded-t-2xl sm:bottom-24 sm:left-auto sm:right-6 sm:w-96 sm:rounded-2xl",
          isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ height: "min(480px, 70vh)" }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-semibold text-white">{t.title}</span>
          </div>
          <div className="text-xs text-gray-500">{t.rules}</div>
        </div>

        {/* 닉네임 설정 바 */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-white/2">
          {editingNick ? (
            <>
              <input
                autoFocus
                value={nickInput}
                onChange={(e) => setNickInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveNickname()}
                className="flex-1 rounded-lg bg-white/8 px-2 py-1 text-xs text-white outline-none border border-white/20"
                placeholder={t.nickname}
                maxLength={20}
              />
              <button
                onClick={saveNickname}
                className="rounded-lg bg-white px-2 py-1 text-xs text-black"
              >
                ✓
              </button>
              <button
                onClick={() => setEditingNick(false)}
                className="text-gray-500 text-xs px-1"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-500">{t.nickname}:</span>
              <span className="text-xs font-medium text-white">{nickname}</span>
              <button
                onClick={() => { setNickInput(nickname); setEditingNick(true); }}
                className="ml-auto text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
              >
                ✏️ {t.changeNick}
              </button>
            </>
          )}
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-600">
              {t.empty}
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.nickname === nickname;
              return (
                <div
                  key={msg.id}
                  className={cn("flex flex-col gap-0.5", isMe ? "items-end" : "items-start")}
                >
                  <div className={cn("flex items-center gap-1 text-[10px]", isMe ? "flex-row-reverse" : "flex-row")}>
                    {msg.badge && <span>{BADGE_ICON[msg.badge]}</span>}
                    <span className={cn("font-medium", isMe ? "text-white" : "text-gray-400")}>
                      {msg.nickname}
                    </span>
                    <span className="text-gray-700">{timeLabel(msg.timestamp)}</span>
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-snug break-words",
                      isMe
                        ? "rounded-tr-sm bg-white/15 text-white"
                        : "rounded-tl-sm bg-white/8 text-gray-200"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        <div className="flex items-center gap-2 border-t border-white/8 px-3 py-3 bg-white/2 pb-safe">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            className="flex-1 rounded-xl bg-white/8 px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none border border-white/5 focus:border-white/20 transition-colors"
            placeholder={t.placeholder}
            maxLength={200}
            disabled={isSending}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isSending}
            className={cn(
              "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200",
              input.trim()
                ? "bg-white hover:bg-white/90 text-black"
                : "bg-white/5 text-gray-600"
            )}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
