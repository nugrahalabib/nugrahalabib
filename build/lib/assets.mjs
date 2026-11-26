// Embeds prepared images (build/img/prep, build/img) as data URIs and reads their size,
// so layouts can fit logos and covers without guessing.
import { readFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const IMG = join(HERE, '..', 'img');
const MIME = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png' };

function resolve(file) {
  return file.includes('/') ? join(IMG, file) : join(IMG, 'prep', file);
}

export function uri(file) {
  const path = resolve(file);
  return `data:${MIME[extname(path)]};base64,${readFileSync(path).toString('base64')}`;
}

function webpSize(buf) {
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
  if (chunk === 'VP8L') {
    const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
    return { w: 1 + (((b1 & 0x3f) << 8) | b0), h: 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)) };
  }
  return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
}

function svgSize(text) {
  const vb = text.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (vb) return { w: Number(vb[1]), h: Number(vb[2]) };
  const w = text.match(/\bwidth="([\d.]+)/);
  const h = text.match(/\bheight="([\d.]+)/);
  return { w: Number(w?.[1] ?? 100), h: Number(h?.[1] ?? 40) };
}

export function size(file) {
  const path = resolve(file);
  const buf = readFileSync(path);
  return extname(path) === '.svg' ? svgSize(buf.toString('utf8')) : webpSize(buf);
}

/** <image> that fits inside a box (contain), centred. */
export function fitImage(file, box, extra = '') {
  const { w, h } = size(file);
  const scale = Math.min(box.w / w, box.h / h);
  const iw = w * scale;
  const ih = h * scale;
  const x = box.x + (box.w - iw) / 2;
  const y = box.y + (box.h - ih) / 2;
  return `<image href="${uri(file)}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${iw.toFixed(1)}" height="${ih.toFixed(1)}" ${extra}/>`;
}

/** <image> that covers a box (slice), with a focal point. */
export function coverImage(file, box, focus = { x: 0.5, y: 0.5 }, extra = '') {
  const { w, h } = size(file);
  const scale = Math.max(box.w / w, box.h / h);
  const iw = w * scale;
  const ih = h * scale;
  const x = box.x - (iw - box.w) * focus.x;
  const y = box.y - (ih - box.h) * focus.y;
  return `<image href="${uri(file)}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${iw.toFixed(1)}" height="${ih.toFixed(1)}" preserveAspectRatio="none" ${extra}/>`;
}
