"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

export function GuideTOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const els = items.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId((topmost.target as HTMLElement).id);
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // 활성 항목이 바뀌면 TOC 컨테이너 내부에서만 해당 버튼이 보이도록 스크롤
  useEffect(() => {
    if (!activeId || !navRef.current) return;
    const container = navRef.current;
    const btn = buttonRefs.current.get(activeId);
    if (!btn) return;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const btnTop = btn.offsetTop;
    const btnBottom = btnTop + btn.offsetHeight;

    if (btnTop < containerTop) {
      container.scrollTop = btnTop - 8;
    } else if (btnBottom > containerBottom) {
      container.scrollTop = btnBottom - container.clientHeight + 8;
    }
  }, [activeId]);

  function handleClick(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="hidden lg:block w-48 flex-shrink-0">
      <div ref={navRef} className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)] mb-3 px-2 sticky top-0 bg-transparent">
          목차
        </p>
        {items.map((item) => (
          <button
            key={item.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(item.id, el);
              else buttonRefs.current.delete(item.id);
            }}
            onClick={() => handleClick(item.id)}
            className={cn(
              "w-full text-left px-2 py-1.5 rounded text-[11px] leading-snug transition-colors",
              activeId === item.id
                ? "text-orange-300 bg-orange-400/8 font-medium"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/4"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
