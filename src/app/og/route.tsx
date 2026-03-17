import { ImageResponse } from "next/og";

export const runtime = "edge";

export const revalidate = 0;

async function fetchBtcPremium(): Promise<{ premium: number | null; upbitPrice: number; binancePrice: number; rate: number }> {
  try {
    const [upbitRes, okxRes, rateRes] = await Promise.allSettled([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC", { next: { revalidate: 60 } }),
      fetch("https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT", { next: { revalidate: 60 } }),
      fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", { next: { revalidate: 3600 } }),
    ]);

    const upbitData = upbitRes.status === "fulfilled" && upbitRes.value.ok ? await upbitRes.value.json() : null;
    const okxData = okxRes.status === "fulfilled" && okxRes.value.ok ? await okxRes.value.json() : null;
    const rateData = rateRes.status === "fulfilled" && rateRes.value.ok ? await rateRes.value.json() : null;

    const upbitPrice: number = upbitData?.[0]?.trade_price ?? 0;
    const binancePrice: number = parseFloat(okxData?.data?.[0]?.last ?? "0");
    const rate: number = rateData?.usd?.krw ?? 1350;
    const binancePriceKrw = binancePrice * rate;

    const premium = upbitPrice > 0 && binancePriceKrw > 0
      ? ((upbitPrice - binancePriceKrw) / binancePriceKrw) * 100
      : null;

    return { premium, upbitPrice, binancePrice, rate };
  } catch {
    return { premium: null, upbitPrice: 0, binancePrice: 0, rate: 0 };
  }
}

async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800;900&text=${encodeURIComponent(text)}`;
    const css = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) => r.text());
    const match = css.match(/src: url\((.+?)\) format\('woff2'\)/);
    if (!match) return null;
    return fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "en";

  const [{ premium, upbitPrice, binancePrice, rate }, fontData] = await Promise.all([
    fetchBtcPremium(),
    loadFont("Korea Premium Index Kimchi Live Upbit Coinbase KRW USD +-.0123456789%"),
  ]);

  const premiumStr = premium !== null
    ? `${premium >= 0 ? "+" : ""}${premium.toFixed(2)}%`
    : "—";
  const isPositive = premium !== null && premium >= 0;
  const premiumColor = premium === null ? "#6b7280" : isPositive ? "#10b981" : "#ef4444";
  const premiumBg = premium === null ? "rgba(107,114,128,0.12)" : isPositive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)";
  const premiumBorder = premium === null ? "rgba(107,114,128,0.3)" : isPositive ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";

  const upbitStr = upbitPrice > 0
    ? `KRW ${Math.round(upbitPrice).toLocaleString("en-US")}`
    : "—";
  const binanceStr = binancePrice > 0
    ? `$${binancePrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : "—";
  const rateStr = rate > 0 ? `$1 = KRW ${rate.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—";

  const labels = {
    ko: { title: "Korea Premium Index", subtitle: "김치 프리미엄 실시간 — 업비트 vs 코인베이스", upbit: "업비트 (KRW)", binance: "코인베이스 (USD)", exchangeRate: "USD/KRW", live: "LIVE · 실시간" },
    en: { title: "Korea Premium Index", subtitle: "Kimchi Premium Live — Upbit vs Coinbase", upbit: "Upbit (KRW)", binance: "Coinbase (USD)", exchangeRate: "USD/KRW", live: "LIVE · Real-time" },
    zh: { title: "Korea Premium Index", subtitle: "韩国溢价实时 — Upbit vs Coinbase", upbit: "Upbit (KRW)", binance: "Coinbase (USD)", exchangeRate: "USD/KRW", live: "LIVE · 实时" },
  };
  const L = labels[locale as keyof typeof labels] ?? labels.en;

  const fonts = fontData
    ? [{ name: "Inter", data: fontData, weight: 900 as const, style: "normal" as const }]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0d0d1f 0%, #10102a 50%, #0a0a18 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 원 */}
        <div style={{ position: "absolute", top: -120, left: -120, width: 400, height: 400, borderRadius: "50%", background: "rgba(99,102,241,0.08)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -100, right: -100, width: 350, height: 350, borderRadius: "50%", background: "rgba(168,85,247,0.08)", display: "flex" }} />
        <div style={{ position: "absolute", top: "40%", right: "15%", width: 200, height: 200, borderRadius: "50%", background: "rgba(239,68,68,0.05)", display: "flex" }} />

        {/* LIVE 배지 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)",
          borderRadius: 999, padding: "6px 16px", marginBottom: 28,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
          <span style={{ color: "#fba46a", fontSize: 14, fontWeight: 600 }}>🌶️ {L.live}</span>
        </div>

        {/* 타이틀 */}
        <div style={{ color: "#ffffff", fontSize: 40, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>
          {L.title}
        </div>
        <div style={{ color: "#6b7280", fontSize: 18, marginBottom: 48 }}>
          {L.subtitle}
        </div>

        {/* 프리미엄 메인 숫자 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          background: premiumBg,
          border: `2px solid ${premiumBorder}`,
          borderRadius: 24,
          padding: "20px 64px",
          marginBottom: 48,
        }}>
          <span style={{ color: premiumColor, fontSize: 96, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1 }}>
            {premiumStr}
          </span>
        </div>

        {/* 가격 정보 3칸 */}
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: L.upbit,        value: upbitStr,   color: "#a5b4fc" },
            { label: L.binance,      value: binanceStr, color: "#86efac" },
            { label: L.exchangeRate, value: rateStr,    color: "#fcd34d" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "16px 32px", minWidth: 220,
              }}
            >
              <span style={{ color: "#4b5563", fontSize: 13, marginBottom: 6 }}>{item.label}</span>
              <span style={{ color: item.color, fontSize: 22, fontWeight: 700 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* 하단 도메인 */}
        <div style={{ position: "absolute", bottom: 28, color: "#374151", fontSize: 14 }}>
          koreanpremium.io
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
