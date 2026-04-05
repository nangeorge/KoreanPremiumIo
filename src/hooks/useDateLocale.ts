"use client";

import { useLocale } from "next-intl";
import { ko, enUS, zhCN } from "date-fns/locale";
import type { Locale } from "date-fns";

export function useDateLocale(): Locale {
  const locale = useLocale();
  if (locale === "zh") return zhCN;
  if (locale === "ko") return ko;
  return enUS;
}
