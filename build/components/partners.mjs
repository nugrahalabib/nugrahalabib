// "Worked with and affiliated": the logo wall from nugrahalabib.com, three groups with
// counts on the left and logo tiles on the right. Tiles stay white in both themes so
// brand colours read correctly; the tiles rise in once, row by row.
import { MONO, SANS } from '../lib/fonts.mjs';
import { document, esc, surface } from '../lib/svg.mjs';
import { fitImage } from '../lib/assets.mjs';

const W = 1200;
const TILE = { w: 136, h: 64, gap: 10 };
const GRID_X = 300;
const PER_ROW = 6;

export function partners(theme, content) {
  const parts = [];
  const css = [];
  let y = 150;
  let row = 0;
  content.groups.forEach((group) => {
    parts.push(`<text class="group" x="64" y="${y + 26}">${esc(group.label)}</text>`);
    parts.push(`<text class="count" x="64" y="${y + 48}">${group.logos.length}</text>`);
    group.logos.forEach((logo, i) => {
      const col = i % PER_ROW;
      const r = Math.floor(i / PER_ROW);
      const x = GRID_X + col * (TILE.w + TILE.gap);
      const ty = y + r * (TILE.h + TILE.gap);
      const cls = `t${row + r}`;
      parts.push(
        `<g class="tile ${cls}"><rect x="${x}" y="${ty}" width="${TILE.w}" height="${TILE.h}" rx="12" fill="#ffffff" stroke="${theme.name === 'dark' ? '#ffffff' : theme.border}" stroke-opacity="${theme.name === 'dark' ? 0 : 1}"/>` +
          fitImage(logo.file, { x: x + 18, y: ty + 14, w: TILE.w - 36, h: TILE.h - 28 }) +
          `<title>${esc(logo.name)}</title></g>`,
      );
    });
    const rows = Math.ceil(group.logos.length / PER_ROW);
    row += rows;
    y += rows * (TILE.h + TILE.gap) + 26;
  });
  for (let r = 0; r < row; r += 1) {
    css.push(`.t${r}{animation:rise .7s cubic-bezier(.16,1,.3,1) ${(0.15 + r * 0.09).toFixed(2)}s both}`);
  }
  const H = y + 30;

  const style = [
    `text{font-family:${SANS}}.count{font-family:${MONO}}`,
    `.title{font-size:40px;font-weight:800;letter-spacing:-1.4px;fill:${theme.text}}`,
    `.sub{font-size:16px;font-weight:500;fill:${theme.muted}}`,
    `.group{font-size:15px;font-weight:700;fill:${theme.text}}`,
    `.count{font-size:13px;font-weight:500;fill:${theme.muted}}`,
    `@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`,
    css.join(''),
    `@media (prefers-reduced-motion: reduce){.tile{animation:none!important}}`,
  ].join('');

  const body = [
    surface(theme, 'panel', { w: W, h: H }),
    `<text class="title" x="62" y="92">${esc(content.title)}</text>`,
    `<text class="sub" x="64" y="122">${esc(content.subtitle)}</text>`,
    parts.join(''),
  ].join('');

  return document({
    width: W,
    height: H,
    title: content.title,
    desc: content.groups.map((g) => `${g.label}: ${g.logos.map((l) => l.name).join(', ')}`).join('. '),
    css: style,
    body,
    fonts: ['inter-500', 'inter-700', 'inter-800', 'mono-500'],
  });
}
