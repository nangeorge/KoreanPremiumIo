import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function makeSvg(size) {
  const pad = Math.round(size * 0.12);
  const r = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.38);
  const lineY1 = Math.round(size * 0.68);
  const lineY2 = Math.round(size * 0.58);
  const lineY3 = Math.round(size * 0.72);
  const lineY4 = Math.round(size * 0.52);
  const cx = size / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0a0a1a"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <text x="${cx}" y="${Math.round(size * 0.47)}" font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-weight="800" font-size="${fontSize}" fill="white" text-anchor="middle" dominant-baseline="middle">김프</text>
  <polyline
    points="${pad},${lineY1} ${Math.round(size*0.3)},${lineY2} ${Math.round(size*0.55)},${lineY3} ${Math.round(size*0.75)},${lineY4} ${size-pad},${Math.round(size*0.56)}"
    fill="none" stroke="url(#line)" stroke-width="${Math.max(2, Math.round(size*0.025))}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${size-pad-Math.round(size*0.04)}" cy="${Math.round(size*0.18)}" r="${Math.round(size*0.055)}" fill="#f87171" opacity="0.9"/>
</svg>`;
}

// src/app/icon.png (32x32) — Next.js App Router auto favicon
const svg32 = Buffer.from(makeSvg(32));
await sharp(svg32).resize(32, 32).png().toFile(join(__dirname, "../src/app/icon.png"));
console.log("✓ src/app/icon.png");

// src/app/apple-icon.png (180x180) — Apple touch icon
const svg180 = Buffer.from(makeSvg(180));
await sharp(svg180).resize(180, 180).png().toFile(join(__dirname, "../src/app/apple-icon.png"));
console.log("✓ src/app/apple-icon.png");

console.log("Done!");
