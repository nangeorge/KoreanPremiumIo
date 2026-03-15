import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/icons");

mkdirSync(OUT, { recursive: true });

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

function makeSvg(size) {
  const pad = Math.round(size * 0.12);
  const r = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.38);
  const subSize = Math.round(size * 0.15);
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
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <!-- 김프 text -->
  <text x="${cx}" y="${Math.round(size * 0.47)}" font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-weight="800" font-size="${fontSize}" fill="white" text-anchor="middle" dominant-baseline="middle">김프</text>
  <!-- Chart line -->
  <polyline
    points="${pad},${lineY1} ${Math.round(size*0.3)},${lineY2} ${Math.round(size*0.55)},${lineY3} ${Math.round(size*0.75)},${lineY4} ${size-pad},${Math.round(size*0.56)}"
    fill="none" stroke="url(#line)" stroke-width="${Math.max(2, Math.round(size*0.025))}" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Red dot accent -->
  <circle cx="${size-pad-Math.round(size*0.04)}" cy="${Math.round(size*0.18)}" r="${Math.round(size*0.055)}" fill="#f87171" opacity="0.9"/>
</svg>`;
}

for (const size of SIZES) {
  const svg = Buffer.from(makeSvg(size));
  await sharp(svg).png().toFile(join(OUT, `icon-${size}.png`));
  console.log(`✓ icon-${size}.png`);
}

console.log("\n✅ 아이콘 생성 완료!");
