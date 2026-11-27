// "Six months of shipping": the last 26 weeks of GitHub contributions as a calendar heatmap in
// Apple green, private company repos included. Data is `heatmap` in activity-data.json,
// written by build/activity-data.mjs.
import { MONO, SANS } from '../lib/fonts.mjs';
import { document, esc, measure, surface } from '../lib/svg.mjs';

const W = 1200;
const PAD = 64;
const GRID_X = 104;
const GRID_Y = 196;
const GAP = 6;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };
const MIN_MONTH_GAP = 3; // columns between month labels so they never touch

// Apple system green: reads as a contribution graph at a glance and belongs to the same Apple
// family as the profile's red. Chosen by the owner over GitHub green, emerald and graphite ramps.
const SCALES = {
  dark: { empty: '#2c2c33', levels: ['#1b3a26', '#1f6334', '#279a45', '#30d158'] },
  light: { empty: '#e4e4e9', levels: ['#cdeed6', '#8ad89f', '#34c759', '#248a3d'] },
};

const shortDate = (iso) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}`;
const longDate = (iso) => `${shortDate(iso)}, ${iso.slice(0, 4)}`;

function level(count, [q1, q2, q3]) {
  if (count <= 0) return -1;
  if (count <= q1) return 0;
  if (count <= q2) return 1;
  if (count <= q3) return 2;
  return 3;
}

function grid(theme, scale, h, pitch) {
  const cell = pitch - GAP;
  const cells = [];
  const monthLabels = [];
  let lastLabelCol = -MIN_MONTH_GAP;
  let ring = '';
  h.weeks.forEach((week, col) => {
    const x = GRID_X + col * pitch;
    const first = week.find((d) => d.date.endsWith('-01'));
    if (first && col - lastLabelCol >= MIN_MONTH_GAP) {
      monthLabels.push(`<text class="k" x="${x.toFixed(1)}" y="${GRID_Y - 15}">${MONTHS[Number(first.date.slice(5, 7)) - 1]}</text>`);
      lastLabelCol = col;
    }
    for (const d of week) {
      const y = GRID_Y + d.weekday * pitch;
      const lv = level(d.count, h.thresholds);
      const fill = lv < 0 ? scale.empty : scale.levels[lv];
      const delay = (0.1 + col * 0.03 + d.weekday * 0.025).toFixed(3);
      cells.push(`<rect class="q" style="animation-delay:${delay}s" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cell.toFixed(1)}" height="${cell.toFixed(1)}" rx="7" fill="${fill}"/>`);
      if (d.date === h.busiest.date) {
        ring = `<rect class="ring" x="${(x - 3.5).toFixed(1)}" y="${(y - 3.5).toFixed(1)}" width="${(cell + 7).toFixed(1)}" height="${(cell + 7).toFixed(1)}" rx="10" fill="none" stroke="${theme.text}" stroke-width="2"/>`;
      }
    }
  });
  const dayLabels = Object.entries(DAY_LABELS).map(([row, label]) =>
    `<text class="k" x="${PAD}" y="${(GRID_Y + Number(row) * pitch + cell / 2 + 4.5).toFixed(1)}">${label}</text>`);
  return { markup: [...monthLabels, ...dayLabels, ...cells, ring].join(''), bottom: GRID_Y + 7 * pitch - GAP };
}

function stats(h) {
  const items = [
    { value: h.total.toLocaleString('en-US'), label: 'contributions', label2: `in ${h.weeks.length} weeks` },
    { value: String(h.active), label: 'active days', label2: `out of ${h.days}` },
    { value: String(h.longest), label: 'days in a row,', label2: 'longest streak' },
  ];
  const colW = 148;
  const x0 = W - PAD - colW * items.length + 20;
  return items.map((s, i) => {
    const x = x0 + i * colW;
    return `<text class="v" x="${x}" y="88">${esc(s.value)}</text><text class="l" x="${x + 1}" y="114">${esc(s.label)}</text><text class="l" x="${x + 1}" y="133">${esc(s.label2)}</text>`;
  });
}

function footer(theme, scale, h, y) {
  const sw = 16;
  const legendW = measure('Less', 'inter-500', 14) + 10 + 5 * (sw + 4) + 6 + measure('More', 'inter-500', 14);
  let lx = W - PAD - legendW;
  const legend = [`<text class="f" x="${lx.toFixed(1)}" y="${y}">Less</text>`];
  lx += measure('Less', 'inter-500', 14) + 10;
  for (const fill of [scale.empty, ...scale.levels]) {
    legend.push(`<rect x="${lx.toFixed(1)}" y="${y - 13}" width="${sw}" height="${sw}" rx="4" fill="${fill}"/>`);
    lx += sw + 4;
  }
  legend.push(`<text class="f" x="${(lx + 2).toFixed(1)}" y="${y}">More</text>`);
  const note = `Busiest day ${shortDate(h.busiest.date)}: ${h.busiest.count} contributions  ·  ${longDate(h.from)} to ${longDate(h.to)}`;
  const marker = `<rect x="${PAD + 0.5}" y="${y - 13.5}" width="17" height="17" rx="4.5" fill="none" stroke="${theme.text}" stroke-width="1.6"/>`;
  return [marker, `<text class="f" x="${PAD + 28}" y="${y}" xml:space="preserve">${esc(note)}</text>`, ...legend].join('');
}

export function heatmap(theme, d) {
  const h = d.heatmap;
  const scale = SCALES[theme.name];
  const pitch = (W - PAD - GRID_X + GAP) / h.weeks.length;
  const g = grid(theme, scale, h, pitch);
  const footY = Math.round(g.bottom + 44);
  const H = footY + 40;
  const subtitle = 'Every square is a day of work on GitHub, private company repos included.';
  return document({
    width: W,
    height: H,
    title: 'Six months of shipping',
    desc: `${subtitle} ${h.total} contributions in ${h.weeks.length} weeks, ${h.active} active days out of ${h.days}, longest streak ${h.longest} days, busiest day ${longDate(h.busiest.date)} with ${h.busiest.count} contributions. Period ${longDate(h.from)} to ${longDate(h.to)}.`,
    css: [
      `text{font-family:${SANS}}.k{font-family:${MONO}}`,
      `.t{font-size:40px;font-weight:800;letter-spacing:-1.4px;fill:${theme.text}}.s{font-size:16px;font-weight:500;fill:${theme.muted}}`,
      `.v{font-size:34px;font-weight:800;letter-spacing:-1.2px;fill:${theme.text}}.l{font-size:14px;font-weight:500;fill:${theme.text2}}`,
      `.k{font-size:13px;font-weight:500;fill:${theme.muted}}.f{font-size:14px;font-weight:500;fill:${theme.muted}}`,
      `.q{transform-box:fill-box;transform-origin:center;animation:pop .6s cubic-bezier(.16,1,.3,1) both}`,
      `@keyframes pop{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}`,
      `.ring{animation:fade .6s ease 1.3s both}@keyframes fade{from{opacity:0}to{opacity:1}}`,
      `@media (prefers-reduced-motion: reduce){.q,.ring{animation:none}}`,
    ].join(''),
    body: [
      surface(theme, 'panel', { w: W, h: H }),
      `<text class="t" x="62" y="92">Six months of shipping</text>`,
      `<text class="s" x="64" y="122">${esc(subtitle)}</text>`,
      ...stats(h),
      g.markup,
      footer(theme, scale, h, footY),
    ].join(''),
    fonts: ['inter-500', 'inter-800', 'mono-500'],
  });
}
