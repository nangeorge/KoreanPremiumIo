"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface InfoSource {
  label: string;
  url: string;
}

export interface InfoText {
  ko: string;
  en: string;
  zh: string;
  source?: InfoSource;
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
    : (text as InfoText)[locale as "ko" | "en" | "zh"] ?? (text as InfoText).en;

  const source = typeof text !== "string" ? (text as InfoText).source : undefined;

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
        className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/6 text-[10px] text-[var(--fg-muted)] hover:border-white/30 hover:text-[var(--fg)] transition-colors"
        aria-label="설명 보기"
      >
        ?
      </button>

      {open && (
        <div className="absolute left-1/2 z-50 mt-6 w-72 -translate-x-1/2 top-0">
          <div className="rounded-xl border border-white/10 bg-[var(--bg-overlay)] p-3 shadow-2xl text-xs text-[var(--fg)] leading-relaxed whitespace-pre-line">
            {content}
            {source && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 flex items-center gap-1 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors border-t border-white/8 pt-2"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
                {source.label}
              </a>
            )}
          </div>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-l border-t border-white/10 bg-[var(--bg-overlay)]" />
        </div>
      )}
    </div>
  );
}
