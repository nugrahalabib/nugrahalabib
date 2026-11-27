// "Behind the private repos": real numbers from the GitHub API for work that the public
// contribution graph only shows as anonymous squares. Data comes from activity-data.json,
// written by build/activity-data.mjs (run it with gh logged in as the owner).
import { MONO, SANS } from '../lib/fonts.mjs';
import { document, esc, surface } from '../lib/svg.mjs';

const W = 1200;

export function activity(theme, d) {
  const months = d.months; // [{ label: 'Dec', total: 123 }]
  const max = Math.max(...months.map((m) => m.total), 1);
  const chart = { x: 640, y: 176, w: 496, h: 170 };
  const barW = chart.w / months.length - 8;
  const bars = months.map((m, i) => {
    const h = Math.max(3, (m.total / max) * chart.h);
    const x = chart.x + i * (barW + 8);
    const y = chart.y + chart.h - h;
    const top = m.total === max;
    return `<g class="bar" style="animation-delay:${(0.05 + i * 0.05).toFixed(2)}s;transform-origin:${x}px ${chart.y + chart.h}px">` +
      `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${top ? theme.redDeep : theme.chipBorder}"/></g>` +
      `<text class="m" x="${(x + barW / 2).toFixed(1)}" y="${chart.y + chart.h + 22}" text-anchor="middle">${esc(m.label)}</text>` +
      (top ? `<text class="mv" x="${(x + barW / 2).toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="middle">${m.total}</text>` : '');
  });
  const stats = d.stats.map((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 64 + col * 270;
    const y = 190 + row * 98;
    return `<text class="v" x="${x}" y="${y}">${esc(s.value)}</text><text class="l" x="${x}" y="${y + 24}">${esc(s.label)}</text>` +
      (s.label2 ? `<text class="l" x="${x}" y="${y + 42}">${esc(s.label2)}</text>` : '');
  });
  let cx = 64;
  const chips = [];
  for (const p of d.products) {
    const w = p.length * 7.6 + 26;
    if (cx + w > W - 64) break;
    chips.push(`<rect x="${cx}" y="${H_CHIPS}" width="${w}" height="30" rx="15" fill="${theme.name === 'dark' ? '#2b2b31' : '#ffffff'}" stroke="${theme.border}"/><text class="c" x="${cx + 13}" y="${H_CHIPS + 20}">${esc(p)}</text>`);
    cx += w + 8;
  }
  const H = H_CHIPS + 70;
  return document({
    width: W,
    height: H,
    title: 'Behind the private repos',
    desc: `${d.subtitle} ${d.stats.map((s) => `${s.value} ${s.label} ${s.label2 ?? ''}`).join('; ')}. Monthly contributions: ${months.map((m) => `${m.label} ${m.total}`).join(', ')}.`,
    css: [
      `text{font-family:${SANS}}.k,.m,.mv{font-family:${MONO}}`,
      `.t{font-size:40px;font-weight:800;letter-spacing:-1.4px;fill:${theme.text}}.s{font-size:16px;font-weight:500;fill:${theme.muted}}`,
      `.k{font-size:11.5px;font-weight:500;letter-spacing:1.4px;fill:${theme.muted}}`,
      `.v{font-size:40px;font-weight:800;letter-spacing:-1.4px;fill:${theme.text}}.l{font-size:13.5px;font-weight:500;fill:${theme.text2}}`,
      `.m{font-size:11px;fill:${theme.muted}}.mv{font-size:11.5px;font-weight:500;fill:${theme.red}}.c{font-size:13px;font-weight:500;fill:${theme.text2}}`,
      `.bar{animation:grow .8s cubic-bezier(.16,1,.3,1) both}@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}`,
      `@media (prefers-reduced-motion: reduce){.bar{animation:none}}`,
    ].join(''),
    body: [
      surface(theme, 'panel', { w: W, h: H }),
      `<text class="t" x="62" y="92">Behind the private repos</text>`,
      `<text class="s" x="64" y="122">${esc(d.subtitle)}</text>`,
      ...stats,
      `<text class="k" x="${chart.x}" y="${chart.y - 16}">CONTRIBUTIONS PER MONTH · ${esc((d.period ?? '').toUpperCase())}</text>`,
      ...bars,
      `<text class="k" x="64" y="${H_CHIPS - 16}">WHERE THE PRIVATE WORK LIVES</text>`,
      ...chips,
    ].join(''),
    fonts: ['inter-500', 'inter-800', 'mono-500'],
  });
}

const H_CHIPS = 420;
