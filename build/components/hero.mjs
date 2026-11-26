// Profile hero, drawn after the hero of nugrahalabib.com: location pill, name, a role line
// that types itself with a red caret, and the 3D mascot changing costume with every role.
// Typing uses SMIL (discrete, per-character widths measured from the font) so it runs in
// GitHub's <img> sandbox; costume changes and the gentle float are CSS.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SANS } from '../lib/fonts.mjs';
import { document, esc, measure, surface } from '../lib/svg.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const IMG = join(HERE, '..', 'img');

const W = 1200;
const H = 540;
const X = 72;
const ROLE = { y: 322, size: 31, font: 'inter-500' };
const TYPE = 0.05; // seconds per character, as on the site
const DELETE = 0.03;
const HOLD = 3.4;
const GAP = 0.18;

const dataUri = (file) => `data:image/webp;base64,${readFileSync(join(IMG, file)).toString('base64')}`;
const f = (n) => Number(n.toFixed(4));

/** Timeline of every role: when it starts typing, finishes, starts deleting and is gone. */
function timeline(roles) {
  let t = 0.6;
  const out = roles.map((role) => {
    const start = t;
    const typed = start + role.title.length * TYPE;
    const hold = typed + HOLD;
    const gone = hold + role.title.length * DELETE;
    t = gone + GAP;
    return { ...role, start, typed, hold, gone };
  });
  return { roles: out, cycle: t };
}

/** Discrete keyframes (time -> revealed width) for one role across the whole cycle. */
function revealFrames(role, cycle) {
  const widths = [0];
  for (let i = 1; i <= role.title.length; i += 1) widths.push(measure(role.title.slice(0, i), ROLE.font, ROLE.size, -0.5));
  const frames = [[0, 0]];
  widths.forEach((w, i) => frames.push([role.start + i * TYPE, w]));
  for (let i = role.title.length - 1; i >= 0; i -= 1) frames.push([role.hold + (role.title.length - i) * DELETE, widths[i]]);
  frames.push([role.gone + 0.001, 0]);
  return frames.filter(([time]) => time < cycle).map(([time, w]) => [time / cycle, w]);
}

function smil(attr, frames, cycle, offset = 0) {
  const keyTimes = frames.map(([k]) => f(k)).join(';');
  const values = frames.map(([, v]) => f(v + offset)).join(';');
  return `<animate attributeName="${attr}" dur="${f(cycle)}s" repeatCount="indefinite" calcMode="discrete" keyTimes="${keyTimes}" values="${values}"/>`;
}

function roleLines(theme, plan) {
  const parts = [];
  const caretFrames = [[0, 0]];
  plan.roles.forEach((role, i) => {
    const frames = revealFrames(role, plan.cycle);
    parts.push(
      `<clipPath id="rc${i}"><rect x="${X}" y="${ROLE.y - 34}" height="46" width="0">${smil('width', frames, plan.cycle)}</rect></clipPath>`,
      `<text class="role" x="${X}" y="${ROLE.y}" clip-path="url(#rc${i})">${esc(role.title)}</text>`,
    );
    frames.slice(1).forEach(([k, w]) => caretFrames.push([k, w]));
  });
  caretFrames.sort((a, b) => a[0] - b[0]);
  parts.push(`<rect class="caret" x="${X + 3}" y="${ROLE.y - 27}" width="2.5" height="34" fill="${theme.red}">${smil('x', caretFrames, plan.cycle, X + 3)}</rect>`);
  return parts.join('');
}

function mascots(theme, plan) {
  const css = [];
  const parts = [];
  const cx = 958;
  const floor = 496;
  const figH = 432;
  plan.roles.forEach((role, i) => {
    const w = (role.mascot.w / role.mascot.h) * figH;
    const pct = (t) => `${f((t / plan.cycle) * 100)}%`;
    const inAt = Math.max(role.start - 0.25, 0);
    const outAt = role.gone + GAP;
    css.push(
      `.m${i}{opacity:0;animation:m${i} ${f(plan.cycle)}s infinite}` +
        `@keyframes m${i}{0%,${pct(inAt)}{opacity:0;transform:translateY(14px)}` +
        `${pct(inAt + 0.45)}{opacity:1;transform:translateY(0)}` +
        `${pct(outAt - 0.25)}{opacity:1;transform:translateY(0)}` +
        `${pct(outAt)},100%{opacity:0;transform:translateY(-6px)}}`,
    );
    parts.push(`<image class="m${i}" href="${dataUri(role.mascot.file)}" x="${f(cx - w / 2)}" y="${floor - figH}" width="${f(w)}" height="${figH}"/>`);
  });
  const shadow = `<ellipse cx="${cx}" cy="${floor - 2}" rx="120" ry="14" fill="url(#floor)"/>`;
  return { svg: `${shadow}<g class="float">${parts.join('')}</g>`, css: css.join('') };
}

function buttons(theme, y) {
  const primary = 'View projects';
  const pw = measure(primary, 'inter-600', 15) + 40;
  const secondary = 'Contact me';
  return [
    `<rect x="${X}" y="${y}" width="${pw}" height="44" rx="22" fill="${theme.redDeep}"/>`,
    `<text class="btn" x="${X + pw / 2}" y="${y + 27.5}" text-anchor="middle" fill="#ffffff">${primary}</text>`,
    `<text class="btn" x="${X + pw + 24}" y="${y + 27.5}" fill="${theme.text}">${secondary}</text>`,
    `<path d="M${X + pw + 24 + measure(secondary, 'inter-600', 15) + 8} ${y + 17.5}l5 5-5 5" stroke="${theme.text}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  ].join('');
}

export function hero(theme, content) {
  const plan = timeline(content.roles);
  const pillText = content.pill;
  const pillW = measure(pillText, 'inter-500', 13.5) + 46;
  const lead = content.lead;
  const mascot = mascots(theme, plan);

  const css = [
    `.sans,.role,.name,.lead,.pill,.btn,.proof{font-family:${SANS}}`,
    `.pill{font-size:13.5px;font-weight:500;fill:${theme.text2}}`,
    `.name{font-size:78px;font-weight:800;letter-spacing:-3.2px;fill:${theme.text}}`,
    `.role{font-size:${ROLE.size}px;font-weight:500;letter-spacing:-.5px;fill:${theme.muted}}`,
    `.lead{font-size:18px;font-weight:500;fill:${theme.muted}}`,
    `.btn{font-size:15px;font-weight:600}`,
    `.proof{font-size:12.5px;font-weight:500;fill:${theme.muted}}`,
    `.caret{animation:blink 1s steps(1) infinite}@keyframes blink{0%,60%{opacity:1}61%,100%{opacity:0}}`,
    `.float{animation:float 5s ease-in-out infinite}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`,
    mascot.css,
    `@media (prefers-reduced-motion: reduce){.float,.caret{animation:none}}`,
  ].join('');

  const body = [
    `<defs><clipPath id="card"><rect width="${W}" height="${H}" rx="28"/></clipPath>`,
    `<radialGradient id="floor"><stop offset="0" stop-color="#000" stop-opacity="${theme.name === 'dark' ? 0.55 : 0.16}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="halo" cx="80%" cy="62%" r="42%"><stop offset="0" stop-color="${theme.name === 'dark' ? '#34343c' : '#f5f5f7'}"/><stop offset="1" stop-color="${theme.name === 'dark' ? '#34343c' : '#f5f5f7'}" stop-opacity="0"/></radialGradient></defs>`,
    surface(theme, 'canvas', { w: W, h: H }),
    `<g clip-path="url(#card)">`,
    `<rect width="${W}" height="${H}" fill="url(#halo)"/>`,
    `<rect x="${X}" y="62" width="${pillW}" height="32" rx="16" fill="${theme.panel}"/>`,
    `<circle cx="${X + 18}" cy="78" r="3.5" fill="${theme.red}"/>`,
    `<text class="pill" x="${X + 30}" y="82.5">${esc(pillText)}</text>`,
    `<text class="name" x="${X - 4}" y="178">${esc(content.nameLines[0])}</text>`,
    `<text class="name" x="${X - 4}" y="260">${esc(content.nameLines[1])}</text>`,
    roleLines(theme, plan),
    ...lead.map((line, i) => `<text class="lead" x="${X}" y="${374 + i * 27}">${esc(line)}</text>`),
    buttons(theme, 424),
    `<text class="proof" x="${X}" y="${H - 34}">${esc(content.proof)}</text>`,
    mascot.svg,
    `</g>`,
  ].join('');

  return document({
    width: W,
    height: H,
    title: content.nameLines.join(' '),
    desc: `${content.lead.join(' ')} Roles: ${content.roles.map((r) => r.title).join(', ')}.`,
    css,
    body,
    fonts: ['inter-500', 'inter-600', 'inter-800'],
  });
}
