// "About me", after the black About section of nugrahalabib.com: photo card, "Who am I?",
// the six numbers that count up once, and the tools row. Black in both GitHub themes.
import { MONO, SANS } from '../lib/fonts.mjs';
import { THEMES, document, esc, measure, surface, wrap } from '../lib/svg.mjs';
import { coverImage } from '../lib/assets.mjs';

const W = 1200;
const T = THEMES.dark;

function photoCard(content) {
  const box = { x: 64, y: 150, w: 330, h: 412 };
  return [
    `<clipPath id="ph"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="20"/></clipPath>`,
    `<g clip-path="url(#ph)">`,
    coverImage(content.photo, box, { x: 0.5, y: 0.2 }),
    `<rect x="${box.x}" y="${box.y + box.h - 150}" width="${box.w}" height="150" fill="url(#shade)"/>`,
    `</g>`,
    `<rect x="${box.x + 0.5}" y="${box.y + 0.5}" width="${box.w - 1}" height="${box.h - 1}" rx="19.5" fill="none" stroke="#ffffff" stroke-opacity=".08"/>`,
    `<text class="pname" x="${box.x + 22}" y="${box.y + box.h - 62}">${esc(content.name)}</text>`,
    `<text class="prole" x="${box.x + 22}" y="${box.y + box.h - 40}">${esc(content.role)}</text>`,
    `<text class="pmeta" x="${box.x + 22}" y="${box.y + box.h - 20}">${esc(content.meta)}</text>`,
  ].join('');
}

function bio(content) {
  const x = 440;
  const width = 696;
  const parts = [`<text class="who" x="${x}" y="182">${esc(content.whoAmI)}</text>`];
  let y = 220;
  content.bio.forEach((para) => {
    wrap(para, 'inter-500', 15.5, width).forEach((line) => {
      parts.push(`<text class="bio" x="${x}" y="${y}">${esc(line)}</text>`);
      y += 24;
    });
    y += 12;
  });
  return { svg: parts.join(''), bottom: y };
}

/** Count-up: the digits 1..N each own a slice of the first 1.2 s; the last one stays. */
function countUp(tile, x, y, index) {
  const match = tile.value.match(/^(\d+)(.*)$/);
  const target = Number(match[1]);
  const suffix = match[2];
  const delay = 0.3 + index * 0.08;
  const step = 1.1 / Math.max(target, 1);
  const parts = [];
  const css = [];
  for (let n = 1; n <= target; n += 1) {
    const cls = `c${index}_${n}`;
    const start = delay + (n - 1) * step;
    const last = n === target;
    parts.push(`<text class="num ${cls}${last ? ' final' : ''}" x="${x}" y="${y}">${n}${esc(suffix)}</text>`);
    const end = start + step;
    css.push(
      last
        ? `.${cls}{opacity:0;animation:on .01s ${start.toFixed(2)}s forwards}`
        : `.${cls}{opacity:0;animation:on .01s ${start.toFixed(2)}s forwards,off .01s ${end.toFixed(2)}s forwards}`,
    );
  }
  return { svg: parts.join(''), css: css.join('') };
}

function numbers(content, top) {
  const x0 = 64;
  const gap = 10;
  const tileW = (W - 128 - gap * 5) / 6;
  const parts = [`<text class="label" x="${x0}" y="${top}">${esc(content.numbersLabel)}</text>`];
  const css = [];
  content.highlights.forEach((tile, i) => {
    const x = x0 + i * (tileW + gap);
    const y = top + 16;
    parts.push(`<rect x="${x}" y="${y}" width="${tileW}" height="104" rx="14" fill="#ffffff" fill-opacity=".05" stroke="#ffffff" stroke-opacity=".1"/>`);
    const counter = countUp(tile, x + 18, y + 50, i);
    parts.push(counter.svg);
    css.push(counter.css);
    wrap(tile.label, 'inter-500', 12.5, tileW - 36).slice(0, 2).forEach((line, li) => {
      parts.push(`<text class="tlabel" x="${x + 18}" y="${y + 74 + li * 16}">${esc(line)}</text>`);
    });
  });
  return { svg: parts.join(''), css: css.join(''), bottom: top + 16 + 104 };
}

function tools(content, top) {
  const parts = [`<text class="label" x="64" y="${top}">${esc(content.toolsLabel)}</text>`];
  let x = 64;
  let y = top + 14;
  for (const tool of content.tools) {
    const w = measure(tool, 'inter-500', 13) + 26;
    if (x + w > W - 64) {
      x = 64;
      y += 40;
    }
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="#ffffff" fill-opacity=".05" stroke="#ffffff" stroke-opacity=".12"/>`);
    parts.push(`<text class="tool" x="${x + 13}" y="${y + 20}">${esc(tool)}</text>`);
    x += w + 8;
  }
  return { svg: parts.join(''), bottom: y + 30 };
}

export function about(theme, content) {
  const text = bio(content);
  const nums = numbers(content, Math.max(text.bottom, 562) + 54);
  const tl = tools(content, nums.bottom + 46);
  const H = tl.bottom + 56;

  const css = [
    `text{font-family:${SANS}}.label,.pmeta{font-family:${MONO}}`,
    `.title{font-size:46px;font-weight:800;letter-spacing:-1.6px;fill:${T.text}}`,
    `.sub{font-size:17px;font-weight:500;fill:${T.text2}}`,
    `.who{font-size:26px;font-weight:700;letter-spacing:-.6px;fill:${T.text}}`,
    `.bio{font-size:15.5px;font-weight:500;fill:#c7c7cc}`,
    `.pname{font-size:18px;font-weight:700;fill:#fff}.prole{font-size:13px;font-weight:500;fill:#d2d2d7}`,
    `.pmeta{font-size:11px;font-weight:500;letter-spacing:.6px;fill:#a1a1a6}`,
    `.label{font-size:12px;font-weight:500;letter-spacing:1.6px;fill:${T.muted}}`,
    `.num{font-size:36px;font-weight:800;letter-spacing:-1.2px;fill:${T.text}}`,
    `.tlabel{font-size:12.5px;font-weight:500;fill:${T.text2}}`,
    `.tool{font-size:13px;font-weight:500;fill:${T.text2}}`,
    `@keyframes on{to{opacity:1}}@keyframes off{to{opacity:0}}`,
    nums.css,
    `@media (prefers-reduced-motion: reduce){.num{animation:none!important;opacity:0}.final{opacity:1}}`,
  ].join('');

  const body = [
    `<defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".82"/></linearGradient></defs>`,
    surface(theme, 'feature', { w: W, h: H }),
    `<text class="title" x="62" y="96">${esc(content.title)}</text>`,
    `<text class="sub" x="64" y="126">${esc(content.subtitle)}</text>`,
    photoCard(content),
    text.svg,
    nums.svg,
    tl.svg,
  ].join('');

  return document({
    width: W,
    height: H,
    title: content.title,
    desc: `${content.bio.join(' ')} ${content.highlights.map((h) => `${h.value} ${h.label}`).join('; ')}. Tools: ${content.tools.join(', ')}.`,
    css,
    body,
    fonts: ['inter-500', 'inter-700', 'inter-800', 'mono-500'],
  });
}
