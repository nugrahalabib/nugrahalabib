// Work card, after the Work cards on nugrahalabib.com: a real screenshot on top with a
// "Running"/"Live" pill, then kicker, title, a two-line description and three facts.
// Static except the status dot, so a grid of ten stays calm.
import { MONO, SANS } from '../lib/fonts.mjs';
import { document, esc, measure, surface, wrap } from '../lib/svg.mjs';
import { coverImage } from '../lib/assets.mjs';

const W = 600;
const H = 604;
const PAD = 26;
const COVER = { x: 14, y: 14, w: W - 28, h: Math.round((W - 28) * 0.58) };

function statusPill(theme, status) {
  if (!status) return '';
  const w = measure(status.label, 'inter-600', 12.5) + 36;
  const x = COVER.x + COVER.w - w - 14;
  const y = COVER.y + 14;
  const dot = status.tone === 'red' ? theme.redDeep : status.tone === 'green' ? '#28C840' : '#8e8e93';
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="28" rx="14" fill="#ffffff" fill-opacity=".94"/>`,
    status.tone !== 'grey' ? `<circle class="pulse" cx="${x + 15}" cy="${y + 14}" r="4" fill="${dot}"/>` : '',
    `<circle cx="${x + 15}" cy="${y + 14}" r="3.6" fill="${dot}"/>`,
    `<text class="status" x="${x + 26}" y="${y + 18.5}">${esc(status.label)}</text>`,
  ].join('');
}

function facts(theme, list, y) {
  const colW = (W - PAD * 2) / list.length;
  return list
    .map((fact, i) => {
      const x = PAD + i * colW;
      const sep = i > 0 ? `<line x1="${x - 12}" y1="${y - 26}" x2="${x - 12}" y2="${y + 18}" stroke="${theme.border}"/>` : '';
      return `${sep}<text class="fv" x="${x}" y="${y}">${esc(fact.value)}</text><text class="fl" x="${x}" y="${y + 19}">${esc(fact.label)}</text>`;
    })
    .join('');
}

export function card(theme, item) {
  const top = COVER.y + COVER.h;
  const desc = wrap(item.description, 'inter-500', 14.5, W - PAD * 2).slice(0, 3);
  const css = [
    `text{font-family:${SANS}}.kicker{font-family:${MONO}}`,
    `.kicker{font-size:11.5px;font-weight:500;letter-spacing:1.3px;fill:${theme.muted}}`,
    `.title{font-size:27px;font-weight:800;letter-spacing:-.9px;fill:${theme.text}}`,
    `.desc{font-size:14.5px;font-weight:500;fill:${theme.text2}}`,
    `.status{font-size:12.5px;font-weight:600;fill:#1d1d1f}`,
    `.fv{font-size:19px;font-weight:800;letter-spacing:-.5px;fill:${theme.text}}`,
    `.fl{font-size:12px;font-weight:500;fill:${theme.muted}}`,
    `.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.2s ease-out infinite}`,
    `@keyframes pulse{0%{opacity:.6;transform:scale(1)}100%{opacity:0;transform:scale(3)}}`,
    `.cvs{font-size:14px;font-weight:600;fill:${theme.text}}.cvh{font-size:30px;font-weight:800;letter-spacing:-1px;fill:${theme.text}}.cvm{font-family:${MONO};font-size:11.5px;font-weight:500;letter-spacing:1.2px;fill:${theme.muted}}`,
    `@media (prefers-reduced-motion: reduce){.pulse{animation:none;opacity:0}}`,
  ].join('');

  const body = [
    `<defs><clipPath id="cv"><rect x="${COVER.x}" y="${COVER.y}" width="${COVER.w}" height="${COVER.h}" rx="14"/></clipPath></defs>`,
    surface(theme, 'panel', { w: W, h: H, rx: 22 }),
    `<g clip-path="url(#cv)">${item.coverSvg ? item.coverSvg(theme, COVER) : coverImage(item.cover, COVER, item.focus ?? { x: 0.5, y: 0 })}</g>`,
    `<rect x="${COVER.x + 0.5}" y="${COVER.y + 0.5}" width="${COVER.w - 1}" height="${COVER.h - 1}" rx="13.5" fill="none" stroke="#000" stroke-opacity=".08"/>`,
    statusPill(theme, item.status),
    `<text class="kicker" x="${PAD}" y="${top + 34}">${esc(item.kicker)}</text>`,
    `<text class="title" x="${PAD - 1}" y="${top + 68}">${esc(item.title)}</text>`,
    ...desc.map((line, i) => `<text class="desc" x="${PAD}" y="${top + 96 + i * 21}">${esc(line)}</text>`),
    `<line x1="${PAD}" y1="${top + 154}" x2="${W - PAD}" y2="${top + 154}" stroke="${theme.border}"/>`,
    facts(theme, item.facts, top + 190),
  ].join('');

  return document({
    width: W,
    height: H,
    title: item.title,
    desc: `${item.description} ${item.facts.map((f) => `${f.value} ${f.label}`).join('; ')}.`,
    css,
    body,
    fonts: ['inter-500', 'inter-600', 'inter-800', 'mono-500'],
  });
}
