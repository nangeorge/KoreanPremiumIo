import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 1200x630 static OG image for social sharing
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0d1f"/>
      <stop offset="50%" stop-color="#10102a"/>
      <stop offset="100%" stop-color="#0a0a18"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
    </linearGradient>
    <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="-60" cy="-60" r="320" fill="#6366f1" opacity="0.05"/>
  <circle cx="1260" cy="690" r="300" fill="#a855f7" opacity="0.05"/>
  <circle cx="900" cy="120" r="160" fill="#ef4444" opacity="0.04"/>

  <!-- LIVE badge -->
  <rect x="80" y="72" width="110" height="34" rx="17" fill="#f97316" fill-opacity="0.12" stroke="#f97316" stroke-opacity="0.3" stroke-width="1"/>
  <circle cx="103" cy="89" r="5" fill="#f97316"/>
  <text x="116" y="94" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#fba46a">● LIVE</text>

  <!-- Main title -->
  <text x="80" y="190" font-family="'Arial Black', Arial, sans-serif" font-size="68" font-weight="900" fill="white" letter-spacing="-2">Korea Premium Index</text>

  <!-- Subtitle -->
  <text x="80" y="245" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">Real-time Kimchi Premium Tracker — Upbit vs Bybit &amp; Coinbase</text>

  <!-- Premium card -->
  <rect x="80" y="290" width="340" height="140" rx="20" fill="url(#card)" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
  <text x="100" y="325" font-family="Arial, sans-serif" font-size="13" fill="#6b7280">BTC Korea Premium</text>
  <text x="100" y="390" font-family="'Arial Black', Arial, sans-serif" font-size="56" font-weight="900" fill="#10b981" letter-spacing="-1">+2.4%</text>

  <!-- Upbit card -->
  <rect x="440" y="290" width="220" height="140" rx="20" fill="url(#card)" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
  <text x="460" y="325" font-family="Arial, sans-serif" font-size="13" fill="#6b7280">Upbit (KRW)</text>
  <text x="460" y="385" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#a5b4fc">₩142,000만</text>

  <!-- Exchange rate card -->
  <rect x="680" y="290" width="220" height="140" rx="20" fill="url(#card)" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
  <text x="700" y="325" font-family="Arial, sans-serif" font-size="13" fill="#6b7280">USD / KRW</text>
  <text x="700" y="385" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#fcd34d">₩1,450</text>

  <!-- Chart area -->
  <rect x="920" y="260" width="200" height="180" rx="16" fill="url(#card)" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
  <polyline points="940,420 960,400 980,410 1000,385 1020,370 1040,355 1060,360 1080,340 1100,320" fill="none" stroke="url(#chartLine)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="950" y="290" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">130 coins tracked</text>

  <!-- Coin badges -->
  <text x="80" y="490" font-family="Arial, sans-serif" font-size="14" fill="#374151">BTC · ETH · XRP · SOL · ADA · DOGE · LINK · DOT · AVAX · +120 more</text>

  <!-- Domain -->
  <text x="80" y="570" font-family="Arial, sans-serif" font-size="16" fill="#374151">koreanpremium.io</text>

  <!-- KP icon -->
  <rect x="1080" y="530" width="60" height="60" rx="12" fill="#1e1b4b"/>
  <text x="1110" y="571" font-family="'Arial Black', Arial, sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">KP</text>
</svg>`;

const buf = await sharp(Buffer.from(svg)).png().toFile(join(__dirname, "../public/og-image.png"));
console.log("✓ public/og-image.png 생성 완료");
