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
    <footer className="mt-20 border-t border-[var(--border-color)] bg-[var(--bg-base)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--fg-secondary)] mb-3">{t("exchangeLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://upbit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  Upbit ↗
                </a>
              </li>
              <li>
                <a
                  href="https://bybit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  Bybit ↗
                </a>
              </li>
              <li>
                <a
                  href="https://coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  Coinbase ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Resources */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--fg-secondary)] mb-3">{t("community")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.reddit.com/r/CryptoCurrency/" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                  r/CryptoCurrency ↗
                </a>
              </li>
              <li>
                <a href="https://www.reddit.com/r/Bitcoin/" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                  r/Bitcoin ↗
                </a>
              </li>
              <li>
                <a href="https://www.coinglass.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                  CoinGlass ↗
                </a>
              </li>
              <li>
                <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                  Fear & Greed Index ↗
                </a>
              </li>
              <li>
                <a href="https://coinmetrics.io" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                  CoinMetrics ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Data sources */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--fg-secondary)] mb-3">
              {locale === "ko" ? "데이터 출처" : locale === "zh" ? "数据来源" : "Data Sources"}
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Upbit API", href: "https://docs.upbit.com" },
                { name: "Bybit API", href: "https://bybit-exchange.github.io/docs" },
                { name: "Coinbase API", href: "https://docs.cdp.coinbase.com" },
                { name: "Alternative.me F&G", href: "https://alternative.me/crypto/fear-and-greed-index/" },
                { name: "CoinMetrics", href: "https://coinmetrics.io" },
              ].map(({ name, href }) => (
                <li key={name}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                    {name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-color)] pt-6 flex flex-col gap-3">
          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/about`} className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              {locale === "ko" ? "소개" : locale === "zh" ? "关于" : "About"}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              {locale === "ko" ? "개인정보 처리방침" : locale === "zh" ? "隐私政策" : "Privacy Policy"}
            </Link>
            <Link href={`/${locale}/terms`} className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              {locale === "ko" ? "이용약관" : locale === "zh" ? "服务条款" : "Terms of Service"}
            </Link>
            <Link href={`/${locale}/contact`} className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              {locale === "ko" ? "문의하기" : locale === "zh" ? "联系我们" : "Contact"}
            </Link>
            <a href="mailto:contact@kimchipremium.com" className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              contact@kimchipremium.com
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-[var(--fg-muted)]">
              © {year} KimchiPremium. {t("rights")}
            </p>
            <p className="text-xs text-[var(--fg-muted)] sm:text-right max-w-md">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
