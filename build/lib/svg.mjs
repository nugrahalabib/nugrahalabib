// Shared helpers: brand palettes (taken from nugrahalabib.com), text measuring, escaping.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fontFaces } from './fonts.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const METRICS = JSON.parse(readFileSync(join(HERE, 'metrics.json'), 'utf8'));

// Dark mode is graphite, not black: GitHub's dark page is #0d1117, so pure black panels read
// as holes. Surfaces sit a few steps above the page, lit from the top with a hairline edge.
// "feature" is the site's black section (About, Contact): black on light GitHub, a warm
// graphite with a faint red glow on dark GitHub.
export const THEMES = {
  dark: {
    name: 'dark',
    canvas: '#1c1c20',
    panel: '#212126',
    panel2: '#18181c',
    border: '#34343b',
    dot: '#2a2a30',
    text: '#f5f5f7',
    text2: '#c7c7cc',
    muted: '#8e8e96',
    red: '#ff5f5a',
    redDeep: '#d63a36',
    chip: '#2a2a30',
    chipBorder: '#3e3e46',
    surfaces: {
      canvas: { from: '#24242a', to: '#18181c', border: '#34343b', highlight: 0.1 },
      panel: { from: '#27272d', to: '#1c1c21', border: '#36363d', highlight: 0.1 },
      feature: { from: '#2c2224', to: '#19191d', border: '#3a3034', highlight: 0.12, glow: '#d63a36', glowOpacity: 0.2 },
    },
  },
  light: {
    name: 'light',
    canvas: '#ffffff',
    panel: '#f5f5f7',
    panel2: '#ececee',
    border: '#d2d2d7',
    dot: '#e3e3e8',
    text: '#1d1d1f',
    text2: '#424245',
    muted: '#6e6e73',
    red: '#ce3330',
    redDeep: '#ce3330',
    chip: '#ffffff',
    chipBorder: '#d2d2d7',
    surfaces: {
      canvas: { from: '#ffffff', to: '#ffffff', border: '#d2d2d7', highlight: 0 },
      panel: { from: '#f7f7f9', to: '#f2f2f5', border: '#d2d2d7', highlight: 0 },
      feature: { from: '#0b0b0c', to: '#000000', border: '#1d1d1f', highlight: 0.08, glow: '#ce3330', glowOpacity: 0.16 },
    },
  },
};

let surfaceId = 0;

/**
 * A lit panel: vertical gradient, hairline top highlight, optional red glow.
 * kind: 'canvas' | 'panel' | 'feature'. Returns markup to put first in the body.
 */
export function surface(theme, kind, { x = 0.5, y = 0.5, w, h, rx = 28, glowAt = { cx: '85%', cy: '0%' } }) {
  const s = theme.surfaces[kind];
  const id = `sf${(surfaceId += 1)}`;
  const defs = [
    `<linearGradient id="${id}g" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stop-color="${s.from}"/><stop offset="1" stop-color="${s.to}"/></linearGradient>`,
    s.highlight ? `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="${s.highlight}"/><stop offset=".18" stop-color="#ffffff" stop-opacity="0"/></linearGradient>` : '',
    s.glow ? `<radialGradient id="${id}r" cx="${glowAt.cx}" cy="${glowAt.cy}" r="70%"><stop offset="0" stop-color="${s.glow}" stop-opacity="${s.glowOpacity}"/><stop offset="1" stop-color="${s.glow}" stop-opacity="0"/></radialGradient>` : '',
  ].join('');
  return [
    `<defs>${defs}</defs>`,
    `<rect x="${x}" y="${y}" width="${w - 2 * x}" height="${h - 2 * y}" rx="${rx}" fill="url(#${id}g)"/>`,
    s.glow ? `<rect x="${x}" y="${y}" width="${w - 2 * x}" height="${h - 2 * y}" rx="${rx}" fill="url(#${id}r)"/>` : '',
    `<rect x="${x}" y="${y}" width="${w - 2 * x}" height="${h - 2 * y}" rx="${rx}" fill="none" stroke="${s.border}"/>`,
    s.highlight ? `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 2 * x - 1}" height="${h - 2 * y - 1}" rx="${rx - 0.5}" fill="none" stroke="url(#${id}h)"/>` : '',
  ].join('');
}

/** Terminal colours stay dark in both themes, like a real terminal window. */
export const TERMINAL = {
  bg: '#1d1d1f',
  bar: '#2a2a2d',
  border: '#3a3a3c',
  text: '#f5f5f7',
  dim: '#a1a1a6',
  red: '#ff6b66',
  green: '#5fd38d',
  dots: ['#FF5F57', '#FEBC2E', '#28C840'],
};

export function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Width in px of `text` set in `fontKey` at `size`, with optional letter spacing. */
export function measure(text, fontKey, size, letterSpacing = 0) {
  const table = METRICS[fontKey];
  if (!table) throw new Error(`No metrics for ${fontKey}`);
  let em = 0;
  for (const ch of text) em += table[ch] ?? 0.6;
  return em * size + letterSpacing * Math.max(text.length - 1, 0);
}

/** Wraps `text` into lines no wider than `maxWidth`. */
export function wrap(text, fontKey, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, fontKey, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Wraps a finished SVG body with fonts, CSS and an accessible title. */
export function document({ width, height, title, desc, css = '', body, fonts }) {
  const faces = fontFaces(body, fonts);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t d">`,
    `<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>`,
    `<style>${faces}${css}</style>`,
    body,
    '</svg>',
  ].join('');
}
