// Generates every profile SVG in a dark and a light variant into ../assets.
// Run: FONT_PYTHON=<python with fonttools+brotli> node build.mjs [name-filter]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES } from './lib/svg.mjs';
import { hero } from './components/hero.mjs';
import { readFileSync } from 'node:fs';
import { activity } from './components/activity.mjs';
import { heatmap } from './components/heatmap.mjs';
import { card } from './components/card.mjs';
import { about } from './components/about.mjs';
import { partners } from './components/partners.mjs';
import { journey } from './components/journey.mjs';
import { contact, linkButton, principles, sectionTitle } from './components/blocks.mjs';
import { ABOUT, CARDS, CONTACT, HERO, JOURNEY, LINKS, PARTNERS, PRINCIPLES, SECTIONS } from './content.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'assets');
mkdirSync(OUT, { recursive: true });
const only = process.argv[2];

const jobs = [
  { name: 'header', render: (t) => hero(t, HERO) },
  ...LINKS.map((l) => ({ name: `link-${l.id}`, render: (t) => linkButton(t, l) })),
  { name: 'heatmap', render: (t) => heatmap(t, JSON.parse(readFileSync(join(HERE, 'activity-data.json'), 'utf8'))) },
  { name: 'about', render: (t) => about(t, ABOUT) },
  { name: 'partners', render: (t) => partners(t, PARTNERS) },
  { name: 'section-work', render: (t) => sectionTitle(t, SECTIONS.work) },
  ...CARDS.map((item) => ({ name: `card-${item.id}`, render: (t) => card(t, item) })),
  { name: 'activity', render: (t) => activity(t, JSON.parse(readFileSync(join(HERE, 'activity-data.json'), 'utf8'))) },
  { name: 'principles', render: (t) => principles(t, PRINCIPLES) },
  { name: 'journey', render: (t) => journey(t, JOURNEY) },
  { name: 'section-more', render: (t) => sectionTitle(t, SECTIONS.more) },
  { name: 'contact', render: (t) => contact(t, CONTACT) },
];

for (const job of jobs.filter((j) => !only || j.name.includes(only))) {
  let size = 0;
  for (const theme of Object.values(THEMES)) {
    const svg = job.render(theme);
    size = svg.length;
    writeFileSync(join(OUT, `${job.name}-${theme.name}.svg`), svg, 'utf8');
  }
  console.log(`${job.name.padEnd(28)} ${(size / 1024).toFixed(1)} KB`);
}
