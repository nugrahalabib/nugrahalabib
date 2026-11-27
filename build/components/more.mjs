// "More on GitHub" card: kicker, title, a two-line description and stack chips, with an arrow
// that marks the whole card as a link. Type is set large because two cards share a row, so
// the text still reads on a phone where the pair is squeezed to the screen width.
import { MONO, SANS } from '../lib/fonts.mjs';
import { document, esc, measure, surface, wrap } from '../lib/svg.mjs';

const W = 600;
const H = 300;
const PAD = 34;
const DESC = { size: 22, lineHeight: 30, maxLines: 2 };
const CHIP = { size: 17, h: 38, padX: 16, gap: 10 };

function chips(theme, stack, y) {
  let x = PAD;
  return stack.map((label) => {
    const w = measure(label, 'inter-500', CHIP.size) + CHIP.padX * 2;
    const chip = `<rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${CHIP.h}" rx="${CHIP.h / 2}" fill="${theme.name === 'dark' ? '#2b2b31' : '#ffffff'}" stroke="${theme.border}"/>` +
      `<text class="c" x="${(x + CHIP.padX).toFixed(1)}" y="${y + 25}">${esc(label)}</text>`;
    x += w + CHIP.gap;
    return chip;
  }).join('');
}

function arrow(theme) {
  const cx = W - PAD - 22;
  const cy = PAD + 20;
  return `<g class="go"><circle cx="${cx}" cy="${cy}" r="22" fill="${theme.redDeep}"/>` +
    `<path d="M${cx - 6} ${cy + 6}L${cx + 6} ${cy - 6}M${cx - 4} ${cy - 6}H${cx + 6}V${cy + 4}" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

export function moreCard(theme, item) {
  const lines = wrap(item.description, 'inter-500', DESC.size, W - PAD * 2);
  if (lines.length > DESC.maxLines) throw new Error(`"${item.name}" description needs ${lines.length} lines, keep it to ${DESC.maxLines}`);
  return document({
    width: W,
    height: H,
    title: `${item.name} on GitHub`,
    desc: `${item.kicker}. ${item.description} Built with ${item.stack.join(', ')}.`,
    css: [
      `text{font-family:${SANS}}.k{font-family:${MONO}}`,
      `.k{font-size:14px;font-weight:500;letter-spacing:1.4px;fill:${theme.muted}}`,
      `.t{font-size:38px;font-weight:800;letter-spacing:-1.3px;fill:${theme.text}}`,
      `.d{font-size:${DESC.size}px;font-weight:500;fill:${theme.text2}}`,
      `.c{font-size:${CHIP.size}px;font-weight:500;fill:${theme.text2}}`,
    ].join(''),
    body: [
      surface(theme, 'panel', { w: W, h: H, rx: 26 }),
      `<text class="k" x="${PAD}" y="${PAD + 18}">${esc(item.kicker)}</text>`,
      arrow(theme),
      `<text class="t" x="${PAD - 2}" y="${PAD + 78}">${esc(item.name)}</text>`,
      ...lines.map((line, i) => `<text class="d" x="${PAD}" y="${PAD + 122 + i * DESC.lineHeight}">${esc(line)}</text>`),
      chips(theme, item.stack, H - PAD - CHIP.h),
    ].join(''),
    fonts: ['inter-500', 'inter-800', 'mono-500'],
  });
}
