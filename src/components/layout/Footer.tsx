"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const params = useParams();
  const locale = (params?.locale as string) ?? "ko";
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/5 bg-[#080810]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">{t("exchangeLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://upbit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  Upbit ↗
                </a>
              </li>
              <li>
                <a
                  href="https://binance.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  Binance ↗
                </a>
              </li>
              <li>
                <a
                  href="https://coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  Coinbase ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">{t("community")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.reddit.com/r/CryptoCurrency/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                  r/CryptoCurrency ↗
                </a>
              </li>
              <li>
                <a href="https://www.reddit.com/r/Bitcoin/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                  r/Bitcoin ↗
                </a>
              </li>
              <li>
                <a href="https://www.coinglass.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                  CoinGlass ↗
                </a>
              </li>
              <li>
                <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                  Fear & Greed Index ↗
                </a>
              </li>
              <li>
                <a href="https://coinmetrics.io" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                  CoinMetrics ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Coming soon */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">{t("comingSoon")}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="text-sm text-gray-500">{t("chromeExtension")}</span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400 border border-indigo-500/20">Soon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-500">{t("mobileApp")}</span>
                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400 border border-purple-500/20">Soon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                <span className="text-sm text-gray-500">{t("subscription")}</span>
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400 border border-rose-500/20">Soon</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 flex flex-col gap-3">
          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/about`} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              {locale === "ko" ? "소개" : locale === "zh" ? "关于" : "About"}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              {locale === "ko" ? "개인정보 처리방침" : locale === "zh" ? "隐私政策" : "Privacy Policy"}
            </Link>
            <Link href={`/${locale}/terms`} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              {locale === "ko" ? "이용약관" : locale === "zh" ? "服务条款" : "Terms of Service"}
            </Link>
            <a href="mailto:contact@koreanpremium.io" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              contact@koreanpremium.io
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-gray-600">
              © {year} KimchiPremium. {t("rights")}
            </p>
            <p className="text-xs text-gray-600 sm:text-right max-w-md">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
