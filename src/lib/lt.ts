/**
 * locale 기반 텍스트 선택 헬퍼.
 * next-intl messages에 등록하기 전 빠르게 인라인 다국어 처리할 때 사용.
 * 사용예: lt(locale, "글쓰기", "Write", "发布")
 */
export function lt(locale: string, ko: string, en: string, zh?: string): string {
  if (locale === "zh") return zh ?? en;
  if (locale === "ko") return ko;
  return en;
}
