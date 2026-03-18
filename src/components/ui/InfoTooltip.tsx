"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface InfoText {
  ko: string;
  en: string;
  zh: string;
}

interface InfoTooltipProps {
  text: string | InfoText;
  locale?: string;
  className?: string;
}

export function InfoTooltip({ text, locale = "ko", className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const content = typeof text === "string"
    ? text
    : (text as InfoText)[locale as keyof InfoText] ?? (text as InfoText).en;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/6 text-[10px] text-gray-500 hover:border-white/30 hover:text-gray-300 transition-colors"
        aria-label="설명 보기"
      >
        ?
      </button>

      {open && (
        <div className="absolute left-1/2 z-50 mt-6 w-72 -translate-x-1/2 top-0">
          <div className="rounded-xl border border-white/10 bg-[var(--bg-overlay)] p-3 shadow-2xl text-xs text-gray-300 leading-relaxed whitespace-pre-line">
            {content}
          </div>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-l border-t border-white/10 bg-[var(--bg-overlay)]" />
        </div>
      )}
    </div>
  );
}
