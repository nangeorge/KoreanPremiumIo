"use client";

import { useTranslations } from "next-intl";

export function AlertBanner() {
  const t = useTranslations("alert");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/8 via-purple-500/8 to-indigo-500/8 p-5">
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/20">
            <span className="text-xl">🔔</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{t("title")}</h3>
            <p className="text-sm text-gray-400">{t("description")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 text-sm text-indigo-300 font-medium">
            🧩 {t("comingSoon")}
          </div>
        </div>
      </div>
    </div>
  );
}
