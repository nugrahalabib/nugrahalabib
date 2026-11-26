// Smaller pieces: section titles, "How I build", the black Contact panel, link buttons.
import { MONO, SANS } from '../lib/fonts.mjs';
import { THEMES, document, esc, measure, surface, wrap } from '../lib/svg.mjs';
import { uri } from '../lib/assets.mjs';

const W = 1200;

/** Section title in the site's style: big heading left, a small note right. */
export function sectionTitle(theme, { title, note }) {
  const H = 104;
  const body = [
    `<text class="t" x="2" y="70">${esc(title)}</text>`,
    note ? `<circle cx="${W - 10 - measure(note, 'mono-500', 12, 1.4) - 16}" cy="62" r="4" fill="${theme.red}"/><text class="n" x="${W - 10}" y="66" text-anchor="end">${esc(note)}</text>` : '',
  ].join('');
  return document({
    width: W,
    height: H,
    title,
    desc: note ?? title,
    css: `.t{font-family:${SANS};font-size:44px;font-weight:800;letter-spacing:-1.6px;fill:${theme.text}}.n{font-family:${MONO};font-size:12px;font-weight:500;letter-spacing:1.4px;fill:${theme.muted}}`,
    body,
    fonts: ['inter-800', 'mono-500'],
  });
}

const ICONS = {
  calc: '<rect x="3" y="2" width="18" height="20" rx="3"/><path d="M7 6h10M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/>',
  quote: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.6L16 9.5"/>',
  box: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
};

export function principles(theme, content) {
  const gap = 12;
  const top = 150;
  const rows = [content.items.slice(0, 3), content.items.slice(3)];
  const tileH = 196;
  const parts = [];
  rows.forEach((row, r) => {
    const tileW = (W - 128 - gap * (row.length - 1)) / row.length;
    row.forEach((item, i) => {
      const x = 64 + i * (tileW + gap);
      const y = top + r * (tileH + gap);
      parts.push(`<rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="18" fill="${theme.name === 'dark' ? '#2b2b31' : '#ffffff'}" stroke="${theme.border}"/>`);
      parts.push(`<g transform="translate(${x + 24} ${y + 24}) scale(1.15)" fill="none" stroke="${theme.red}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[item.icon]}</g>`);
      parts.push(`<text class="h" x="${x + 24}" y="${y + 86}">${esc(item.title)}</text>`);
      wrap(item.text, 'inter-500', 14.5, tileW - 48).slice(0, 4).forEach((line, li) => {
        parts.push(`<text class="p" x="${x + 24}" y="${y + 114 + li * 21}">${esc(line)}</text>`);
      });
    });
  });
  const H = top + tileH * 2 + gap + 48;
  return document({
    width: W,
    height: H,
    title: content.title,
    desc: content.items.map((i) => `${i.title} ${i.text}`).join(' '),
    css: [
      `text{font-family:${SANS}}`,
      `.title{font-size:40px;font-weight:800;letter-spacing:-1.4px;fill:${theme.text}}`,
      `.sub{font-size:16px;font-weight:500;fill:${theme.muted}}`,
      `.h{font-size:17.5px;font-weight:700;letter-spacing:-.3px;fill:${theme.text}}`,
      `.p{font-size:14.5px;font-weight:500;fill:${theme.text2}}`,
    ].join(''),
    body: [
      surface(theme, 'panel', { w: W, h: H }),
      `<text class="title" x="62" y="92">${esc(content.title)}</text>`,
      `<text class="sub" x="64" y="122">${esc(content.subtitle)}</text>`,
      parts.join(''),
    ].join(''),
    fonts: ['inter-500', 'inter-700', 'inter-800'],
  });
}

/** Black Contact panel with the suited mascot, as on the site. */
export function contact(theme, content) {
  const T = THEMES.dark;
  const H = 470;
  const card = { x: 64, y: 156, w: 760, h: 250 };
  const mascotH = 400;
  const mascotW = (content.mascot.w / content.mascot.h) * mascotH;
  const mx = 960 - mascotW / 2;
  const lines = wrap(content.note, 'inter-500', 14.5, card.w - 64);
  const body = [
    surface(theme, 'feature', { w: W, h: H, glowAt: { cx: '80%', cy: '75%' } }),
    `<text class="title" x="62" y="92">${esc(content.title)}</text>`,
    `<text class="sub" x="64" y="122">${esc(content.subtitle)}</text>`,
    `<rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="22" fill="#ffffff" fill-opacity=".05" stroke="#ffffff" stroke-opacity=".1"/>`,
    `<circle cx="${card.x + 36}" cy="${card.y + 38}" r="4" fill="${T.red}"/>`,
    `<text class="meta" x="${card.x + 50}" y="${card.y + 42}">${esc(content.meta)}</text>`,
    `<text class="lead" x="${card.x + 32}" y="${card.y + 88}">${esc(content.lead)}</text>`,
    `<text class="mail" x="${card.x + 30}" y="${card.y + 142}">${esc(content.email)}</text>`,
    ...lines.map((l, i) => `<text class="note" x="${card.x + 32}" y="${card.y + 180 + i * 21}">${esc(l)}</text>`),
    `<ellipse cx="960" cy="${H - 40}" rx="110" ry="12" fill="#000" opacity=".45"/>`,
    `<g class="float"><image href="${uri(content.mascot.file)}" x="${mx.toFixed(1)}" y="${H - 40 - mascotH}" width="${mascotW.toFixed(1)}" height="${mascotH}"/></g>`,
  ].join('');
  return document({
    width: W,
    height: H,
    title: content.title,
    desc: `${content.subtitle} ${content.lead} ${content.email}.`,
    css: [
      `text{font-family:${SANS}}.meta{font-family:${MONO}}`,
      `.title{font-size:46px;font-weight:800;letter-spacing:-1.6px;fill:${T.text}}`,
      `.sub{font-size:17px;font-weight:500;fill:${T.text2}}`,
      `.meta{font-size:12px;font-weight:500;letter-spacing:1.2px;fill:${T.text2}}`,
      `.lead{font-size:16px;font-weight:600;fill:${T.text2}}`,
      `.mail{font-size:46px;font-weight:800;letter-spacing:-1.8px;fill:${T.text}}`,
      `.note{font-size:14.5px;font-weight:500;fill:${T.muted}}`,
      `.float{animation:float 5s ease-in-out infinite}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`,
      `@media (prefers-reduced-motion: reduce){.float{animation:none}}`,
    ].join(''),
    body,
    fonts: ['inter-500', 'inter-600', 'inter-800', 'mono-500'],
  });
}

const LINK_ICONS = {
  globe: '<circle cx="8" cy="8" r="6.5"/><path d="M1.5 8h13M8 1.5c2 2 2.6 4 2.6 6.5S10 12.5 8 14.5M8 1.5C6 3.5 5.4 5.5 5.4 8S6 12.5 8 14.5"/>',
  mail: '<rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M2 4l6 5 6-5"/>',
  linkedin: '<rect x="1.5" y="1.5" width="13" height="13" rx="2.5"/><path d="M5 7v4.5M5 4.6v.01M8 11.5V7m0 2c0-1.2.8-2 1.9-2S11.5 7.8 11.5 9v2.5"/>',
  tiktok: '<path d="M9.5 1.8v8.4a2.7 2.7 0 1 1-2.7-2.7M9.5 1.8c.4 1.8 1.6 3 3.6 3.2"/>',
  instagram: '<rect x="1.8" y="1.8" width="12.4" height="12.4" rx="3.5"/><circle cx="8" cy="8" r="2.9"/><path d="M11.6 4.4h.01"/>',
};

/** Pill button image; one file per link so each one is clickable on GitHub. */
export function linkButton(theme, { label, icon, primary }) {
  const w = Math.ceil(measure(label, 'inter-600', 14) + 62);
  const H = 44;
  const fill = primary ? theme.redDeep : theme.panel;
  const ink = primary ? '#ffffff' : theme.text;
  return document({
    width: w,
    height: H,
    title: label,
    desc: label,
    css: `text{font-family:${SANS};font-size:14px;font-weight:600}`,
    body: [
      `<rect x=".5" y=".5" width="${w - 1}" height="${H - 1}" rx="21.5" fill="${fill}" stroke="${primary ? fill : theme.border}"/>`,
      `<g transform="translate(18 14)" fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${LINK_ICONS[icon]}</g>`,
      `<text x="44" y="27" fill="${ink}">${esc(label)}</text>`,
    ].join(''),
    fonts: ['inter-600'],
  });
}
