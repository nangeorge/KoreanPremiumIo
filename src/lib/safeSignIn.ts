"use client";

import { signIn } from "next-auth/react";

export function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER|NaverApp|Twitter|MicroMessenger|Snapchat/i.test(
    navigator.userAgent
  );
}

const IN_APP_MSG: Record<string, string> = {
  ko: "카카오톡·인스타 등 인앱 브라우저에서는 Google 로그인이 차단됩니다.\nSafari 또는 Chrome에서 열어주세요.",
  en: "Google sign-in is blocked in in-app browsers.\nPlease open in Safari or Chrome.",
  zh: "应用内浏览器中 Google 登录被屏蔽。\n请在 Safari 或 Chrome 中打开。",
};

export function safeSignIn(locale = "ko") {
  if (isInAppBrowser()) {
    alert(IN_APP_MSG[locale] ?? IN_APP_MSG.ko);
    return;
  }
  signIn("google");
}
