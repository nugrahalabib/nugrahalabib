// Writes ../README.md from content.mjs so links, alt text and order stay in one place.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ABOUT, CARDS, CONTACT, HERO, JOURNEY, LINKS, PARTNERS, PRINCIPLES, SECTIONS } from './content.mjs';

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

const more = [
  ['Linky', 'Linky-Agentbuff', 'Open-source link shortener and link-in-bio pages with branded QR codes, click analytics, webhooks and a REST API', 'Next.js, Drizzle, PostgreSQL'],
  ['Absentra', 'Agentbuff-Absentra', 'Attendance for small businesses: GPS geofence and selfie clock-in, shifts, leave, payroll recap, and an MCP endpoint for agents', 'TypeScript, PostgreSQL, MCP'],
  ['AntiKebo', 'AgentBuff-AntiKebo', 'An alarm that keeps going until you are really awake, and asks your AI agent to keep nudging you', 'TypeScript, Rust, MCP'],
  ['CV-Buff', 'CV-Buff', 'Web CV editor with a live A4 preview, eight templates and optional AI rewriting', 'TanStack Start, React'],
  ['FinFreedom', 'FinFreedom', 'Personal finance for Indonesia with FIRE planning by Monte Carlo, tax and zakat helpers, and an MCP server', 'Next.js, Prisma'],
  ['KostCloud', 'AgentBuff-kost-management-system', 'Multi-tenant boarding-house management that grew out of the system behind Mutiara27', 'Laravel, MCP'],
  ['ANRI demo', 'ANRI-Project', 'Risk-intelligence demo for the National Archives of Indonesia, built at Spead AI', 'Next.js, Prisma'],
  ['nugrahalabib.com', 'web-portfolio-3.0', 'My site: static prerendered pages edited through a self-hosted CMS written for a non-technical owner', 'React, Payload CMS'],
];
const table = ['| Project | What it is | Built with |', '| --- | --- | --- |', ...more.map(([n, r, w, b]) => `| [${n}](https://github.com/nugrahalabib/${r}) | ${w} | ${b} |`)].join('\n');

const md = [
  '<!-- Every picture here is drawn by build/ (in the profile repo) from the content of nugrahalabib.com:',
  '     same hero, mascot, numbers, logo wall and journey. Edit build/content.mjs, then run build.mjs and readme.mjs. -->',
  '',
  link('https://nugrahalabib.com', pic('header', `${HERO.nameLines.join(' ')}. ${HERO.lead.join(' ')} ${HERO.proof}.`)),
  '',
  linkRow,
  '',
  pic('about', `${ABOUT.title}. ${ABOUT.bio[0]}`),
  '',
  pic('partners', `${PARTNERS.title}: ${PARTNERS.groups.map((g) => g.logos.map((l) => l.name).join(', ')).join('; ')}.`),
  '',
  pic('section-work', SECTIONS.work.title),
  '',
  ...cardRows,
  '',
  pic('principles', `${PRINCIPLES.title}. ${PRINCIPLES.items.map((i) => i.title).join('. ')}.`),
  '',
  pic('journey', `${JOURNEY.title} ${JOURNEY.lanes.map((l) => l.items.map((i) => i.label).join(', ')).join('; ')}.`),
  '',
  pic('section-more', SECTIONS.more.title),
  '',
  table,
  '',
  link(`mailto:${CONTACT.email}`, pic('contact', `${CONTACT.title}. ${CONTACT.lead} ${CONTACT.email}`)),
  '',
  linkRow,
  '',
].join('\n');

writeFileSync(join(HERE, '..', 'README.md'), md, 'utf8');
console.log('README.md', md.length, 'chars');
