// The "View more" bar that opens the second set of work cards. It sits inside a <summary>, so
// GitHub toggles the cards with no script; the chevron nudges down to invite the click.
import { SANS } from '../lib/fonts.mjs';
import { document, esc, surface } from '../lib/svg.mjs';

const W = 1200;
const H = 104;
const NAMES_SHOWN = 5;

export function moreToggle(theme, items) {
  const names = items.map((item) => item.title);
  const preview = `${names.slice(0, NAMES_SHOWN).join(', ')} and ${names.length - NAMES_SHOWN} more`;
  const cx = W - 70;
  const cy = H / 2;
  return document({
    width: W,
    height: H,
    title: `View ${items.length} more projects`,
    desc: `Opens ${items.length} more project cards: ${names.join(', ')}.`,
    css: [
      `text{font-family:${SANS}}`,
      `.t{font-size:30px;font-weight:800;letter-spacing:-1px;fill:${theme.text}}`,
      `.s{font-size:17px;font-weight:500;fill:${theme.muted}}`,
      `.chev{animation:nudge 1.8s ease-in-out infinite}@keyframes nudge{0%,100%{transform:translateY(-2px)}50%{transform:translateY(3px)}}`,
      `@media (prefers-reduced-motion: reduce){.chev{animation:none}}`,
    ].join(''),
    body: [
      surface(theme, 'panel', { w: W, h: H, rx: H / 2 }),
      `<text class="t" x="44" y="${cy - 2}">View ${items.length} more projects</text>`,
      `<text class="s" x="45" y="${cy + 26}">${esc(preview)}</text>`,
      `<circle cx="${cx}" cy="${cy}" r="28" fill="${theme.redDeep}"/>`,
      `<g class="chev"><path d="M${cx - 9} ${cy - 4}l9 9 9-9" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    ].join(''),
    fonts: ['inter-500', 'inter-800'],
  });
}
