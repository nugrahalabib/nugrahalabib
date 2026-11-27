// Writes ../README.md from content.mjs so links, alt text and order stay in one place.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ABOUT, CARDS, CONTACT, HERO, JOURNEY, LINKS, MORE, PARTNERS, PRINCIPLES, SECTIONS } from './content.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const pic = (name, alt, attrs = 'width="100%"') =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" ${attrs} alt="${alt.replace(/"/g, '&quot;')}"></picture>`;
const link = (href, inner) => `<a href="${href}">${inner}</a>`;

const linkRow = `<p align="center">\n${LINKS.map((l) => `  ${link(l.href, pic(`link-${l.id}`, l.label, 'height="40"'))}`).join('\n')}\n</p>`;

const cardRows = [];
for (let i = 0; i < CARDS.length; i += 2) {
  const pair = CARDS.slice(i, i + 2).map((c) => `  ${link(c.href, pic(`card-${c.id}`, `${c.title}. ${c.description}`, 'width="49%"'))}`);
  cardRows.push(`<p>\n${pair.join('\n')}\n</p>`);
}

// Cards instead of a table: GitHub squeezes table columns on a phone until each cell is a
// one-word-per-line column, while a pair of pictures scales down as one piece.
const moreRows = [];
for (let i = 0; i < MORE.length; i += 2) {
  const pair = MORE.slice(i, i + 2).map((m) =>
    `  ${link(`https://github.com/nugrahalabib/${m.repo}`, pic(`more-${m.repo.toLowerCase()}`, `${m.name}. ${m.description} Built with ${m.stack.join(', ')}.`, 'width="49%"'))}`);
  moreRows.push(`<p>\n${pair.join('\n')}\n</p>`);
}

const md = [
  '<!-- Every picture here is drawn by build/ (in the profile repo) from the content of nugrahalabib.com:',
  '     same hero, mascot, numbers, logo wall and journey. Edit build/content.mjs, then run build.mjs and readme.mjs. -->',
  '',
  link('https://nugrahalabib.com', pic('header', `${HERO.nameLines.join(' ')}. ${HERO.lead.join(' ')} ${HERO.proof}.`)),
  '',
  linkRow,
  '',
  pic('heatmap', 'Six months of shipping: a calendar heatmap of my GitHub contributions over the last 26 weeks, private company repos included.'),
  '',
  pic('about', `${ABOUT.title}. ${ABOUT.bio[0]}`),
  '',
  pic('partners', `${PARTNERS.title}: ${PARTNERS.groups.map((g) => g.logos.map((l) => l.name).join(', ')).join('; ')}.`),
  '',
  pic('section-work', SECTIONS.work.title),
  '',
  ...cardRows,
  '',
  pic('activity', 'Behind the private repos: real numbers from GitHub for work in private company repositories, with contributions per month.'),
  '',
  pic('principles', `${PRINCIPLES.title}. ${PRINCIPLES.items.map((i) => i.title).join('. ')}.`),
  '',
  pic('journey', `${JOURNEY.title} ${JOURNEY.lanes.map((l) => l.items.map((i) => i.label).join(', ')).join('; ')}.`),
  '',
  pic('section-more', SECTIONS.more.title),
  '',
  ...moreRows,
  '',
  link(`mailto:${CONTACT.email}`, pic('contact', `${CONTACT.title}. ${CONTACT.lead} ${CONTACT.email}`)),
  '',
  linkRow,
  '',
].join('\n');

writeFileSync(join(HERE, '..', 'README.md'), md, 'utf8');
console.log('README.md', md.length, 'chars');
