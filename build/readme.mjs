// Writes ../README.md from content.mjs so links, alt text and order stay in one place.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ABOUT, CARDS, CONTACT, HERO, JOURNEY, LINKS, MORE_CARDS, PARTNERS, PRINCIPLES, SECTIONS } from './content.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const pic = (name, alt, attrs = 'width="100%"') =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" ${attrs} alt="${alt.replace(/"/g, '&quot;')}"></picture>`;
const link = (href, inner) => `<a href="${href}">${inner}</a>`;

const linkRow = `<p align="center">\n${LINKS.map((l) => `  ${link(l.href, pic(`link-${l.id}`, l.label, 'height="40"'))}`).join('\n')}\n</p>`;

/** Work cards two per row, each linking to its showcase or repo. */
function cardRows(list) {
  const rows = [];
  for (let i = 0; i < list.length; i += 2) {
    const pair = list.slice(i, i + 2).map((c) => `  ${link(c.href, pic(`card-${c.id}`, `${c.title}. ${c.description}`, 'width="49%"'))}`);
    rows.push(`<p>\n${pair.join('\n')}\n</p>`);
  }
  return rows;
}

// More work sits behind a <details> toggle: GitHub opens it without script, and the page
// stays short until someone asks for the rest.
const moreWork = [
  '<details>',
  `<summary>${pic('more-toggle', `View ${MORE_CARDS.length} more projects: ${MORE_CARDS.map((c) => c.title).join(', ')}.`, 'width="95%" align="middle"')}</summary>`,
  '',
  ...cardRows(MORE_CARDS),
  '</details>',
].join('\n');

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
  ...cardRows(CARDS),
  '',
  moreWork,
  '',
  pic('activity', 'Behind the private repos: real numbers from GitHub for work in private company repositories, with contributions per month.'),
  '',
  pic('principles', `${PRINCIPLES.title}. ${PRINCIPLES.items.map((i) => i.title).join('. ')}.`),
  '',
  pic('journey', `${JOURNEY.title} ${JOURNEY.lanes.map((l) => l.items.map((i) => i.label).join(', ')).join('; ')}.`),
  '',
  link(`mailto:${CONTACT.email}`, pic('contact', `${CONTACT.title}. ${CONTACT.lead} ${CONTACT.email}`)),
  '',
  linkRow,
  '',
].join('\n');

writeFileSync(join(HERE, '..', 'README.md'), md, 'utf8');
console.log('README.md', md.length, 'chars');
