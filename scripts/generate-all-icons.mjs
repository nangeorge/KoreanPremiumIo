import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Clean international design: dark navy bg, "KP" text, upward chart line
function makeSvg(size) {
  const r = Math.round(size * 0.20);
  const cx = size / 2;

  // Scale-aware values
  const isSmall = size <= 32;
  const kpSize  = isSmall ? Math.round(size * 0.52) : Math.round(size * 0.44);
  const kpY     = isSmall ? Math.round(size * 0.62) : Math.round(size * 0.56);

  // Chart line points (bottom quarter of icon)
  const lineTop    = Math.round(size * 0.70);
  const lineBottom = Math.round(size * 0.88);
  const pad        = Math.round(size * 0.10);
  const p1y = lineBottom;
  const p2y = Math.round(size * 0.80);
  const p3y = Math.round(size * 0.76);
  const p4y = Math.round(size * 0.72);
  const p5y = lineTop;
  const sw  = Math.max(1.5, Math.round(size * 0.028));

  // Small green dot (top-right accent)
  const dotR  = Math.max(2, Math.round(size * 0.060));
  const dotCx = size - pad - dotR;
  const dotCy = pad + dotR;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>

  <!-- KP text -->
  <text
    x="${cx}" y="${kpY}"
    font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
    font-weight="900"
    font-size="${kpSize}"
    fill="white"
    text-anchor="middle"
    dominant-baseline="auto"
    letter-spacing="-${Math.round(size * 0.01)}"
  >KP</text>

  <!-- Upward chart line -->
  <polyline
    points="${pad},${p1y} ${Math.round(size*0.28)},${p2y} ${Math.round(size*0.45)},${p3y} ${Math.round(size*0.62)},${p4y} ${size-pad},${p5y}"
    fill="none"
    stroke="url(#chartLine)"
    stroke-width="${sw}"
    stroke-linecap="round"
    stroke-linejoin="round"
    opacity="0.85"
  />

  <!-- Green accent dot -->
  <circle cx="${dotCx}" cy="${dotCy}" r="${dotR}" fill="#10b981" opacity="0.9"/>
</svg>`;
}

async function buildIco(sizes) {
  const pngs = await Promise.all(
    sizes.map((s) => sharp(Buffer.from(makeSvg(s))).resize(s, s).png().toBuffer())
  );
  const count = sizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const dirs = [];
  const datas = [];
  let offset = 6 + count * 16;
  for (let i = 0; i < count; i++) {
    const s = sizes[i];
    const data = pngs[i];
    const dir = Buffer.alloc(16);
    dir.writeUInt8(s === 256 ? 0 : s, 0);
    dir.writeUInt8(s === 256 ? 0 : s, 1);
    dir.writeUInt8(0, 2);
    dir.writeUInt8(0, 3);
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(data.length, 8);
    dir.writeUInt32LE(offset, 12);
    dirs.push(dir);
    datas.push(data);
    offset += data.length;
  }
  return Buffer.concat([header, ...dirs, ...datas]);
}

const APP_DIR     = join(__dirname, "../src/app");
const ICONS_DIR   = join(__dirname, "../public/icons");
mkdirSync(ICONS_DIR, { recursive: true });

// favicon.ico (16 + 32)
const ico = await buildIco([16, 32]);
writeFileSync(join(APP_DIR, "favicon.ico"), ico);
console.log("✓ src/app/favicon.ico");

// src/app/icon.png (32x32) — Next.js auto favicon
await sharp(Buffer.from(makeSvg(32))).resize(32, 32).png().toFile(join(APP_DIR, "icon.png"));
console.log("✓ src/app/icon.png");

// src/app/apple-icon.png (180x180)
await sharp(Buffer.from(makeSvg(180))).resize(180, 180).png().toFile(join(APP_DIR, "apple-icon.png"));
console.log("✓ src/app/apple-icon.png");

// PWA icons
const PWA_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
for (const s of PWA_SIZES) {
  await sharp(Buffer.from(makeSvg(s))).resize(s, s).png().toFile(join(ICONS_DIR, `icon-${s}.png`));
  console.log(`✓ public/icons/icon-${s}.png`);
}

console.log("\n✅ 모든 아이콘 생성 완료!");
