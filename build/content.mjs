// Every word and image in the profile. Copy follows nugrahalabib.com (content.json),
// LinkedIn and the verified fact sheets in _github/fakta. House rules: English, no dashes
// as punctuation, TikTok 130K+, AgentBuff since May 2025 with 57+ users / 700+ tasks,
// never name the engines behind Spead AI or AgentBuff, WIKA work is the owner's own.
import { measure } from './lib/svg.mjs';
import { uri } from './lib/assets.mjs';

export const HERO = {
  pill: 'Jakarta, Indonesia · Open for collaboration',
  nameLines: ['Nugraha Labib', 'Mujaddid'],
  lead: ['AI founder and agentic engineer. I build AI systems for', 'enterprises, government and small businesses.'],
  proof: 'Google for Startups 2025 · 130K+ followers · MM New Ventures Innovation',
  roles: [
    { title: 'AI enthusiast & developer', mascot: { file: 'mascot-point.webp', w: 241, h: 640 } },
    { title: 'Business entrepreneur', mascot: { file: 'mascot-suit.webp', w: 224, h: 640 } },
    { title: 'Analyst & researcher', mascot: { file: 'mascot-analyst.webp', w: 328, h: 640 } },
    { title: 'Contract & claim specialist', mascot: { file: 'mascot-contract.webp', w: 322, h: 640 } },
    { title: 'Architect', mascot: { file: 'mascot-architect.webp', w: 289, h: 640 } },
    { title: 'Content creator', mascot: { file: 'mascot-creator.webp', w: 259, h: 640 } },
    { title: 'Designer', mascot: { file: 'mascot-designer.webp', w: 268, h: 640 } },
  ],
};

export const LINKS = [
  { id: 'site', label: 'nugrahalabib.com', icon: 'globe', href: 'https://nugrahalabib.com', primary: true },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/nugrahalabib/' },
  { id: 'email', label: 'Email', icon: 'mail', href: 'mailto:nugrahalabib@gmail.com' },
  { id: 'tiktok', label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@nugrahalabib' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram', href: 'https://instagram.com/nugrahalabib' },
];

export const ABOUT = {
  title: 'About me',
  subtitle: 'Founder and Lead AI Engineer at Spead AI, based in Jakarta.',
  photo: 'photo-google.webp',
  name: 'Nugraha Labib Mujaddid',
  role: 'Founder and Lead AI Engineer, Spead AI',
  meta: 'JAKARTA · EN, ID, AR',
  whoAmI: 'Who am I?',
  bio: [
    'I am Nugraha Labib Mujaddid (Nugi), an AI founder, agentic engineer and entrepreneur. I bridge advanced technology with business innovation, corporate governance, legal compliance and the procurement rules that decide whether a system can really be deployed.',
    'As Founder and Lead AI Engineer of Spead AI, incubated at Caliana Indonesia and validated through the Google for Startups: AI Solution Lab Program 2025, I design multi-agent systems for government bodies, state-owned enterprises and regulated industries, hosted on private cloud or on premise. Our contextual RAG engine cut reporting turnaround by 87%. I also build AgentBuff, AI employees for small businesses, and lead the internal platforms of the EPCC Division at WIKA.',
    'My work is anchored in research and risk discipline: a Master of Management in New Ventures Innovation at Prasetiya Mulya, strategy work for the President Director of Caliana, and two years of multi-billion rupiah contracts and claims at PT Waskita Karya. Beyond software I run a 100+ room property business, two F&B brands and a TikTok channel with 130K+ followers.',
  ],
  numbersLabel: 'IN NUMBERS',
  highlights: [
    { value: '8+', label: 'Years running businesses' },
    { value: '8', label: 'Ventures since 2018' },
    { value: '3+', label: 'Years building AI systems' },
    { value: '4+', label: 'Years in software and cloud' },
    { value: '2', label: 'Years at a BUMN contractor' },
    { value: '5+', label: 'Years creating tech content' },
  ],
  toolsLabel: 'TOOLS I USE',
  tools: ['MCP', 'RAG', 'LangChain', 'LangGraph', 'n8n', 'Pinecone', 'pgvector', 'Python', 'TypeScript', 'Node.js', 'Next.js', 'React', 'Fastify', 'PostgreSQL', 'Docker', 'Google Cloud', 'Playwright', 'Figma', 'CapCut'],
};

const logo = (stem, name, svg = false) => ({ file: `logo-${stem}.${svg ? 'svg' : 'webp'}`, name });

export const PARTNERS = {
  title: 'Worked with and affiliated',
  subtitle: 'Brands I made campaigns for, places I worked, and where I learned.',
  groups: [
    {
      label: 'Brand campaigns',
      logos: [
        logo('asus', 'ASUS', true), logo('rog', 'ROG'), logo('philips', 'Philips', true), logo('capcut', 'CapCut'),
        logo('bibit', 'Bibit', true), logo('bardi', 'Bardi Smart Home'), logo('scarlett', 'Scarlett'), logo('makarizo', 'Makarizo'),
        logo('ripple', 'Ripple Indonesia'), logo('apexwarrior', 'Apex Warrior'), logo('t3tech', 'T3 Tech Group'), logo('loxus', 'Loxus Cleaner'),
      ],
    },
    {
      label: 'Worked at',
      logos: [
        logo('wika', 'Wijaya Karya', true), logo('caliana', 'Caliana Indonesia'), logo('waskita', 'Waskita Karya'),
        logo('tiktok', 'TikTok', true), logo('shopee', 'Shopee', true), logo('airmas', 'Airmas Asri'),
      ],
    },
    {
      label: 'Programs & education',
      logos: [
        logo('google-for-startups', 'Google for Startups', true), logo('prasetiyamulya', 'Universitas Prasetiya Mulya'), logo('undip', 'Universitas Diponegoro'),
        logo('ugm', 'Universitas Gadjah Mada', true), logo('wtr', 'Waskita Toll Road'), logo('ruangguru', 'Skill Academy by Ruangguru', true),
        logo('skala', 'Skala Architectural Course'), logo('kunkun', 'KUNKUN Visual'), logo('archinesia', 'ARCHINESIA'),
        logo('amoghasida', 'HMA Amoghasida'), logo('bekraf', 'Bekraf'),
      ],
    },
  ],
};

export const JOURNEY = {
  title: 'What I do, and how I got here.',
  subtitle: 'Everything I run and everything I have done, year by year.',
  footnote: 'Every entry, with proof, on nugrahalabib.com',
  lanes: [
    {
      label: 'AI & software',
      items: [
        { label: 'Spead AI · Founder & Lead AI Engineer', start: '2025-11' },
        { label: 'AgentBuff · CEO', start: '2025-05' },
        { label: 'WIKA EPCC · IT Specialist', start: '2026-10' },
        { label: 'Caliana · Strategic Initiative Analyst', start: '2025-07', end: '2025-12' },
      ],
    },
    {
      label: 'Businesses',
      items: [
        { label: 'NgR Service · laptop & PC service', start: '2018-01', end: '2021-12' },
        { label: 'Maxis Studio · design & build', start: '2019-02', end: '2020-06' },
        { label: 'LAB.in Studio · 3D visualisation, 30+ clients', start: '2020-09', end: '2024-08' },
        { label: 'Mutiara27 · 100+ room boarding house', start: '2022-01' },
        { label: 'Gultik & Soto Masnug · 5.0 from 300+ reviews', start: '2024-03' },
        { label: "D'Bestie Cafe · campus cafe", start: '2024-06' },
      ],
    },
    {
      label: 'Industry',
      items: [
        { label: 'Zurnalis Architect', start: '2019-04', end: '2019-07' },
        { label: 'Airmas Asri', start: '2020-01', end: '2020-03' },
        { label: 'Waskita Karya · contracts & claims', start: '2022-08', end: '2024-07' },
      ],
    },
    {
      label: 'Content',
      items: [
        { label: 'TikTok @nugrahalabib · 130K+ followers', start: '2021-11' },
        { label: 'Shopee · official creator & affiliate', start: '2022-05', end: '2024-06' },
      ],
    },
    {
      label: 'Education',
      items: [
        { label: 'Diponegoro University · B.Arch, cum laude', start: '2017-08', end: '2021-12' },
        { label: 'Prasetiya Mulya · MM New Ventures Innovation', start: '2024-10' },
      ],
    },
  ],
};

const SHOWCASE = (repo) => `https://github.com/nugrahalabib/${repo}`;
const RUNNING = { label: 'Running', tone: 'red' };
const LIVE = { label: 'Live', tone: 'green' };

/** Drawn cover for AI Co-Founder, which has no screenshots: its pipeline, idea to investor docs. */
function coFounderCover(theme, box) {
  const steps = ['Idea', 'Validation', 'Financial model', 'Brand kit', 'Investor docs'];
  const parts = [`<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="${theme.name === 'dark' ? '#121214' : '#fbfbfd'}"/>`];
  parts.push(`<image href="${uri('logo-cofounder.webp')}" x="${box.x + 40}" y="${box.y + 40}" width="64" height="64" style="${theme.name === 'dark' ? 'filter:invert(1)' : ''}"/>`);
  parts.push(`<text class="cvm" x="${box.x + 122}" y="${box.y + 62}">AGENTBUFF CO-FOUNDER</text>`);
  parts.push(`<text class="cvh" x="${box.x + 120}" y="${box.y + 96}">LLM proposes, code disposes.</text>`);
  let x = box.x + 40;
  const y = box.y + 190;
  steps.forEach((step, i) => {
    const w = measure(step, 'inter-600', 14) + 30;
    const done = i < 3;
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="38" rx="19" fill="${done ? theme.redDeep : theme.panel}" stroke="${done ? theme.redDeep : theme.border}"/>`);
    parts.push(`<text class="cvs" x="${x + 15}" y="${y + 24}" style="fill:${done ? '#ffffff' : theme.text}">${step}</text>`);
    if (i < steps.length - 1) parts.push(`<path d="M${x + w + 5} ${y + 19}h12m-4 -4l4 4-4 4" stroke="${theme.muted}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
    x += w + 22;
  });
  const bars = [0.35, 0.5, 0.42, 0.66, 0.58, 0.8, 0.95];
  bars.forEach((v, i) => {
    const bh = v * 70;
    parts.push(`<rect x="${box.x + 40 + i * 30}" y="${box.y + box.h - 26 - bh}" width="18" height="${bh}" rx="4" fill="${i === bars.length - 1 ? theme.redDeep : theme.chipBorder}"/>`);
  });
  parts.push(`<text class="cvm" x="${box.x + 270}" y="${box.y + box.h - 30}">EVERY NUMBER FROM TESTED CODE</text>`);
  return parts.join('');
}

/** Featured work, in README order (two per row). */
export const CARDS = [
  {
    id: 'spead-ai', href: SHOWCASE('spead-ai-showcase'), cover: 'cover-spead-ai.webp', status: RUNNING,
    kicker: 'SPEAD AI · FOUNDER & LEAD AI ENGINEER', title: 'Spead AI',
    description: 'Multi-agent AI that runs inside your own infrastructure: cited document Q&A, a document studio and connectors, for government, BUMN and regulated companies.',
    facts: [{ value: '87%', label: 'faster reporting' }, { value: 'On-prem', label: 'or private cloud' }, { value: '2025', label: 'Google for Startups' }],
  },
  {
    id: 'agentbuff', href: SHOWCASE('agentbuff-showcase'), cover: 'cover-agentbuff.webp', status: RUNNING,
    kicker: 'AGENTBUFF · CEO', title: 'AgentBuff',
    description: 'AI employees that work around the clock inside WhatsApp and Telegram for small businesses, with a marketplace of skills, connectors and business apps.',
    facts: [{ value: '57+', label: 'users' }, { value: '700+', label: 'tasks done' }, { value: '4.9/5', label: 'from 20 reviews' }],
  },
  {
    id: 'spead-pro-wika', href: SHOWCASE('spead-pro-wika-showcase'), cover: 'cover-spead-pro.webp', status: { label: 'Pilot', tone: 'green' },
    kicker: 'WIKA EPCC · TENDER & LEGAL', title: 'Spead AI Pro',
    description: 'AI workspace for the tender and contract team: it fills the tender document review from a contract package and checks every quote against the source.',
    facts: [{ value: 'Cited', label: 'every quote verified' }, { value: 'PDF + Office', label: 'read with OCR' }, { value: 'SSO + 2FA', label: 'company sign-in' }],
  },
  {
    id: 'hc-platform', href: SHOWCASE('wika-hc-platform-showcase'), cover: 'cover-hc-platform.webp', status: LIVE,
    kicker: 'WIKA EPCC · HUMAN CAPITAL', title: 'HC Platform',
    description: "One door for Human Capital work that replaced the team's Excel workbooks: tender certificates, assignment letters, training, employee data and an AI assistant.",
    facts: [{ value: '6', label: 'apps in one door' }, { value: 'Sep 2026', label: 'live since' }, { value: 'RLS', label: 'data per division' }],
  },
  {
    id: 'q-nexus', href: SHOWCASE('wika-q-nexus-showcase'), cover: 'cover-q-nexus.webp', status: LIVE,
    kicker: 'WIKA EPCC · PROCUREMENT', title: 'Q-NEXUS',
    description: 'Vendor procurement for EPCC tenders, from RFQ and BOQ revisions to quotation reading, technical and commercial evaluation, negotiation and a price database.',
    facts: [{ value: '10', label: 'roles, one flow' }, { value: 'RFQ to award', label: 'end to end' }, { value: 'ID | EN', label: 'bilingual' }],
  },
  {
    id: 'agentbuff-pos', href: SHOWCASE('agentbuff-pos-showcase'), cover: 'cover-pos.webp', status: LIVE,
    kicker: 'AGENTBUFF · MARKETPLACE', title: 'Kasir POS',
    description: 'A phone-first point of sale for Indonesian shops that opens the store to AI agents over MCP; anything that changes data waits for a person to approve.',
    facts: [{ value: '14', label: 'MCP resources' }, { value: '6', label: 'agent tools' }, { value: 'Human', label: 'approves actions' }],
  },
  {
    id: 'presentation-skills', href: SHOWCASE('AgentBuff-Presentation-Skills'), cover: 'cover-presentation.webp', status: { label: '9 stars', tone: 'grey' },
    kicker: 'OPEN SOURCE · MIT', title: 'Presentation Skills',
    description: 'A skill any coding agent can follow to build HTML decks for non-designers, then export PDF, PNG or PPTX that match the HTML pixel for pixel.',
    facts: [{ value: '34', label: 'design templates' }, { value: '4', label: 'export formats' }, { value: 'Any agent', label: 'Claude Code, Codex' }],
  },
  {
    id: 'co-founder', href: SHOWCASE('AgentBuff-Co-Founder'), coverSvg: coFounderCover,
    kicker: 'OPEN SOURCE · MIT', title: 'AI Co-Founder',
    description: 'From a raw idea to a sourced validation score, a financial model, a brand kit and investor documents, with every number computed by tested code.',
    facts: [{ value: '3', label: 'LLM providers' }, { value: 'BYOK', label: 'keys stay yours' }, { value: 'MCP', label: 'gateway built in' }],
  },
  {
    id: 'future-companion', href: SHOWCASE('Future-Companion'), cover: 'cover-companion.webp',
    kicker: 'EXHIBITION · PRASETIYA MULYA', title: 'Future Companion',
    description: 'An exhibition piece set in 2075: visitors design an AI companion, talk to it by voice for five minutes and order it, while the app collects research data.',
    facts: [{ value: '2075', label: 'story year' }, { value: '5 min', label: 'live voice talk' }, { value: 'MIT', label: 'open source' }],
  },
  {
    id: 'berseni', href: SHOWCASE('Website-Berseni.id'), cover: 'cover-berseni.webp', status: LIVE,
    kicker: 'CLIENT WORK · BERSENI.ID', title: 'Berseni.id',
    description: 'Bilingual site and CMS for an Indonesian art community: painting classes, workshops, an artwork shop and a blog, all edited from one admin panel.',
    facts: [{ value: 'ID | EN', label: 'bilingual' }, { value: '95', label: 'commits shipped' }, { value: 'Live', label: 'berseni.id' }],
  },
];

export const PRINCIPLES = {
  title: 'How I build',
  subtitle: 'Five rules that show up in every system I ship.',
  items: [
    { icon: 'calc', title: 'Numbers come from code', text: 'In AI Co-Founder and Buff Your Money the model may propose, but tested code computes every figure a user sees.' },
    { icon: 'quote', title: 'Every quote is checked', text: 'Spead AI Pro tells the reviewer whether each citation appears in full, in part or not at all in the contract.' },
    { icon: 'check', title: 'People approve side effects', text: 'Agents on Kasir POS or on company systems can draft; a person approves anything that changes data.' },
    { icon: 'box', title: 'Isolation by default', text: 'One container per AgentBuff user, tenant limits in the data layer, row level security on the WIKA platforms.' },
    { icon: 'server', title: 'It runs where the data lives', text: 'Spead AI deploys to private cloud or on premise for government bodies, BUMN and regulated industries.' },
  ],
};

export const CONTACT = {
  title: 'Contact',
  subtitle: 'For collaboration, AI consulting, sponsorship, or a quick hello.',
  meta: 'JAKARTA, INDONESIA · GMT+7',
  lead: 'Email works best.',
  email: 'nugrahalabib@gmail.com',
  note: 'A short note about what you have in mind helps me reply faster. LinkedIn, TikTok and Instagram are linked below.',
  mascot: { file: './mascot-businessman.webp', w: 272, h: 720 },
};

export const SECTIONS = {
  work: { title: 'Selected work', note: 'SCREENSHOTS FROM THE LIVE PRODUCTS' },
  more: { title: 'More on GitHub', note: 'OPEN SOURCE AND EXPERIMENTS' },
};

// "More on GitHub": compact link cards, two per row, so the section reads well on a phone too.
export const MORE = [
  { name: 'DashPro', repo: 'wika-pms-showcase', kicker: 'WIKA EPCC · SHOWCASE', description: 'Project monitoring for WIKA EPCC, rebuilt with secure sign-in and a formula engine.', stack: ['Next.js', 'PostgreSQL'] },
  { name: 'Buff Your Money', repo: 'agentbuff-bym-showcase', kicker: 'AGENTBUFF · SHOWCASE', description: 'Personal and family finance that your AI agent fills in from a chat message.', stack: ['Next.js', 'PostgreSQL', 'MCP'] },
  { name: 'Smart Home', repo: 'agentbuff-tuya-showcase', kicker: 'AGENTBUFF · SHOWCASE', description: 'Control Tuya and Smart Life devices by chatting with your AI agent.', stack: ['Next.js', 'MCP'] },
  { name: 'KostCloud', repo: 'agentbuff-kostcloud-showcase', kicker: 'AGENTBUFF · SHOWCASE', description: 'Boarding-house management for owners, grown from the system behind Mutiara27.', stack: ['Laravel', 'MCP'] },
  { name: 'Linky', repo: 'Linky-Agentbuff', kicker: 'OPEN SOURCE · MIT', description: 'Short links and link-in-bio pages with QR codes, analytics and webhooks.', stack: ['Next.js', 'Drizzle', 'PostgreSQL'] },
  { name: 'FinFreedom', repo: 'FinFreedom', kicker: 'OPEN SOURCE · MIT', description: 'Personal finance for Indonesia with FIRE planning, tax and zakat helpers.', stack: ['Next.js', 'Prisma', 'MCP'] },
  { name: 'Absentra', repo: 'Agentbuff-Absentra', kicker: 'AGENTBUFF', description: 'Attendance for small businesses: GPS and selfie clock-in, shifts, leave, payroll.', stack: ['TypeScript', 'PostgreSQL', 'MCP'] },
  { name: 'AntiKebo', repo: 'AgentBuff-AntiKebo', kicker: 'AGENTBUFF', description: 'An alarm that keeps going until you are really awake, with your AI agent nudging you.', stack: ['TypeScript', 'Rust', 'MCP'] },
  { name: 'ANRI demo', repo: 'ANRI-Project', kicker: 'SPEAD AI · DEMO', description: 'Risk intelligence demo for the National Archives of Indonesia, built at Spead AI.', stack: ['Next.js', 'Prisma'] },
  { name: 'nugrahalabib.com', repo: 'web-portfolio-3.0', kicker: 'PERSONAL SITE', description: 'My site: static pages edited through a self-hosted CMS made for a non-technical owner.', stack: ['React', 'Payload CMS'] },
];
