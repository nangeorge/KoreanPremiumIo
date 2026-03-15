import sharp from "sharp";
import { writeFileSync } from "fs";
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

// ICO 파일 포맷: header + directory + image data (32x32, 16x16)
async function buildIco(sizes) {
  const pngs = await Promise.all(
    sizes.map(async (s) => {
      const svg = Buffer.from(makeSvg(s));
      return sharp(svg).resize(s, s).png().toBuffer();
    })
  );

  const count = sizes.length;
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);     // reserved
  header.writeUInt16LE(1, 2);     // type: ICO
  header.writeUInt16LE(count, 4); // image count

  // Directory entries: 16 bytes each
  const dirSize = count * 16;
  const dataOffset = 6 + dirSize;
  const dirs = [];
  const datas = [];
  let offset = dataOffset;

  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const data = pngs[i];
    const dir = Buffer.alloc(16);
    dir.writeUInt8(size === 256 ? 0 : size, 0); // width (0 = 256)
    dir.writeUInt8(size === 256 ? 0 : size, 1); // height
    dir.writeUInt8(0, 2);   // color count
    dir.writeUInt8(0, 3);   // reserved
    dir.writeUInt16LE(1, 4); // planes
    dir.writeUInt16LE(32, 6); // bit count
    dir.writeUInt32LE(data.length, 8);
    dir.writeUInt32LE(offset, 12);
    dirs.push(dir);
    datas.push(data);
    offset += data.length;
  }

  return Buffer.concat([header, ...dirs, ...datas]);
}

const ico = await buildIco([16, 32]);
const outPath = join(__dirname, "../src/app/favicon.ico");
writeFileSync(outPath, ico);
console.log("✓ favicon.ico 생성 완료 →", outPath);
