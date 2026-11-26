// "What I do, and how I got here": the Journey of nugrahalabib.com as one timeline from
// 2017 to now. Every role or venture is a bar; what is still running is red and ends in
// a pulsing dot, finished work is grey. Bars draw in once from the left.
import { MONO, SANS } from '../lib/fonts.mjs';
import { document, esc, measure, surface } from '../lib/svg.mjs';

const W = 1200;
const AXIS = { x0: 250, x1: 1130, from: 2017, to: 2027 };
const ROW = 27;
const NOW = 2026 + 10.8 / 12; // late November 2026

const yearX = (t) => AXIS.x0 + ((t - AXIS.from) / (AXIS.to - AXIS.from)) * (AXIS.x1 - AXIS.x0);
const toYear = (ym) => {
  if (!ym) return NOW;
  const [y, m] = ym.split('-').map(Number);
  return y + (m - 1) / 12;
};

export function journey(theme, content) {
  const parts = [];
  const css = [];
  let y = 196;
  let index = 0;
  const grid = [];
  for (let year = AXIS.from; year <= AXIS.to; year += 1) {
    const x = yearX(year);
    grid.push(`<line x1="${x}" y1="168" x2="${x}" y2="{BOTTOM}" stroke="${theme.border}" stroke-dasharray="${year === AXIS.to ? '0' : '2 5'}"/>`);
    if (year < AXIS.to) grid.push(`<text class="year" x="${x + 6}" y="160">${year}</text>`);
  }

  content.lanes.forEach((lane) => {
    parts.push(`<text class="lane" x="64" y="${y + 17}">${esc(lane.label)}</text>`);
    lane.items.forEach((item) => {
      const start = toYear(item.start);
      const end = toYear(item.end);
      const running = !item.end;
      const x = yearX(start);
      const w = Math.max(yearX(end) - x, 6);
      const label = item.label;
      const labelW = measure(label, 'inter-600', 12.5);
      const inside = w > labelW + 22;
      const cls = `b${index}`;
      const barY = y + 4;
      // Inside the bar when it fits, otherwise after it, otherwise (short bars near "now") before it.
      const after = x + w + (running ? 16 : 8);
      const fitsAfter = after + labelW < W - 40;
      const placement = inside
        ? { cls: running ? 'in-run' : 'in-done', x: x + 11, anchor: 'start' }
        : fitsAfter
          ? { cls: 'out', x: after, anchor: 'start' }
          : { cls: 'out', x: x - 10, anchor: 'end' };
      parts.push(
        `<g class="bar ${cls}"><rect x="${x.toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="19" rx="9.5" fill="${running ? theme.redDeep : theme.chipBorder}"/>` +
          `<text class="${placement.cls}" x="${placement.x.toFixed(1)}" y="${barY + 13.5}" text-anchor="${placement.anchor}">${esc(label)}</text></g>`,
      );
      if (running) {
        const ex = x + w;
        parts.push(`<circle class="pulse" cx="${ex.toFixed(1)}" cy="${barY + 9.5}" r="9.5" fill="${theme.red}"/>`);
        parts.push(`<circle cx="${ex.toFixed(1)}" cy="${barY + 9.5}" r="4" fill="#ffffff"/>`);
      }
      css.push(`.${cls}{animation:draw .9s cubic-bezier(.16,1,.3,1) ${(0.1 + index * 0.05).toFixed(2)}s both;transform-origin:${x.toFixed(1)}px 0}`);
      index += 1;
      y += ROW;
    });
    y += 16;
  });

  const bottom = y + 4;
  const nowX = yearX(NOW);
  const H = bottom + 70;
  const legendY = H - 34;
  const style = [
    `text{font-family:${SANS}}.year,.legend,.now{font-family:${MONO}}`,
    `.title{font-size:40px;font-weight:800;letter-spacing:-1.4px;fill:${theme.text}}`,
    `.sub{font-size:16px;font-weight:500;fill:${theme.muted}}`,
    `.year{font-size:12px;font-weight:500;fill:${theme.muted}}`,
    `.lane{font-size:13.5px;font-weight:700;fill:${theme.text}}`,
    `.in-run{font-size:12.5px;font-weight:600;fill:#ffffff}.in-done{font-size:12.5px;font-weight:600;fill:${theme.text}}`,
    `.out{font-size:12.5px;font-weight:600;fill:${theme.text2}}`,
    `.legend{font-size:12px;font-weight:500;fill:${theme.muted}}.now{font-size:11px;font-weight:500;fill:${theme.red}}`,
    `@keyframes draw{from{opacity:0;transform:scaleX(.04)}to{opacity:1;transform:scaleX(1)}}`,
    `.pulse{opacity:.35;transform-box:fill-box;transform-origin:center;animation:pulse 2.2s ease-out infinite}`,
    `@keyframes pulse{0%{opacity:.45;transform:scale(.5)}100%{opacity:0;transform:scale(1.6)}}`,
    css.join(''),
    `@media (prefers-reduced-motion: reduce){.bar,.pulse{animation:none!important}}`,
  ].join('');

  const body = [
    surface(theme, 'canvas', { w: W, h: H }),
    `<text class="title" x="62" y="92">${esc(content.title)}</text>`,
    `<text class="sub" x="64" y="122">${esc(content.subtitle)}</text>`,
    grid.join('').replaceAll('{BOTTOM}', String(bottom)),
    `<line x1="${nowX}" y1="168" x2="${nowX}" y2="${bottom}" stroke="${theme.red}" stroke-width="1.5" stroke-dasharray="4 4"/>`,
    `<text class="now" x="${nowX - 6}" y="160" text-anchor="end">NOW</text>`,
    parts.join(''),
    `<rect x="64" y="${legendY - 10}" width="26" height="12" rx="6" fill="${theme.redDeep}"/><text class="legend" x="98" y="${legendY}">Running now</text>`,
    `<rect x="214" y="${legendY - 10}" width="26" height="12" rx="6" fill="${theme.chipBorder}"/><text class="legend" x="248" y="${legendY}">Completed</text>`,
    `<text class="legend" x="${W - 64}" y="${legendY}" text-anchor="end">${esc(content.footnote)}</text>`,
  ].join('');

  return document({
    width: W,
    height: H,
    title: content.title,
    desc: content.lanes.map((l) => `${l.label}: ${l.items.map((i) => `${i.label} (${i.start} to ${i.end ?? 'now'})`).join('; ')}`).join('. '),
    css: style,
    body,
    fonts: ['inter-500', 'inter-600', 'inter-700', 'inter-800', 'mono-500'],
  });
}
