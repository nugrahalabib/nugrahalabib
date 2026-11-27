// Collects the numbers for the "Behind the private repos" panel from the GitHub API, using the
// owner's own gh login (private work is only visible to the account itself).
// Run: node build/activity-data.mjs   -> build/activity-data.json
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LOGIN = 'nugrahalabib';
const gh = (args) => JSON.parse(execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 1e8 }));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const q = `{user(login:"${LOGIN}"){contributionsCollection{restrictedContributionsCount contributionCalendar{totalContributions weeks{contributionDays{date contributionCount weekday}}}}}}`;
const cc = gh(['api', 'graphql', '-f', `query=${q}`]).data.user.contributionsCollection;
const days = cc.contributionCalendar.weeks.flatMap((w) => w.contributionDays);
const total = cc.contributionCalendar.totalContributions;
const privateCount = cc.restrictedContributionsCount;

const byMonth = new Map();
for (const d of days) {
  const key = d.date.slice(0, 7);
  byMonth.set(key, (byMonth.get(key) ?? 0) + d.contributionCount);
}
const months = [...byMonth.entries()].slice(-12).map(([k, v]) => ({ label: MONTHS[Number(k.slice(5)) - 1], total: v }));

let longest = 0;
let run = 0;
for (const d of days) {
  run = d.contributionCount > 0 ? run + 1 : 0;
  longest = Math.max(longest, run);
}
const active = days.filter((d) => d.contributionCount > 0).length;

// The last 26 weeks, day by day, for the heatmap at the top of the profile.
const HEAT_WEEKS = 26;
const heatWeeks = cc.contributionCalendar.weeks.slice(-HEAT_WEEKS)
  .map((w) => w.contributionDays.map((d) => ({ date: d.date, weekday: d.weekday, count: d.contributionCount })));
const heatDays = heatWeeks.flat();
const heatActive = heatDays.filter((d) => d.count > 0);
let heatLongest = 0;
let heatRun = 0;
for (const d of heatDays) {
  heatRun = d.count > 0 ? heatRun + 1 : 0;
  heatLongest = Math.max(heatLongest, heatRun);
}
// Colour levels split the active days into quarters, the way GitHub does.
const sorted = heatActive.map((d) => d.count).sort((a, b) => a - b);
const quantile = (p) => sorted[Math.floor(p * (sorted.length - 1))] ?? 0;
const busiest = heatDays.reduce((a, b) => (b.count > a.count ? b : a));
const heatmap = {
  from: heatDays[0].date,
  to: heatDays[heatDays.length - 1].date,
  total: heatDays.reduce((sum, d) => sum + d.count, 0),
  days: heatDays.length,
  active: heatActive.length,
  longest: heatLongest,
  busiest,
  thresholds: [quantile(0.25), quantile(0.5), quantile(0.75)],
  weeks: heatWeeks,
};

const since = days[0].date;
const until = days[days.length - 1].date;
const prs = gh(['api', `search/issues?q=author:${LOGIN}+is:pr+created:${since}..${until}&per_page=1`]).total_count;
const merged = gh(['api', `search/issues?q=author:${LOGIN}+is:pr+is:merged+created:${since}..${until}&per_page=1`]).total_count;

const data = {
  updated: until,
  subtitle: "Most of my work lives in private company repositories. Real numbers from GitHub.",
  period: `${since} to ${until}`,
  stats: [
    { value: total.toLocaleString('en-US'), label: 'contributions in', label2: 'the last 12 months' },
    { value: `${Math.round((privateCount / total) * 100)}%`, label: `of them in private`, label2: `repositories (${privateCount.toLocaleString('en-US')})` },
    { value: String(prs), label: 'pull requests opened,', label2: `${merged} merged` },
    { value: String(active), label: `active days, longest`, label2: `streak ${longest} days` },
  ],
  months,
  products: ['Spead AI', 'Spead AI Pro', 'AgentBuff', 'HC Platform', 'Q-NEXUS', 'DashPro', 'Kasir POS', 'Buff Your Money', 'KostCloud', 'Smart Home'],
  heatmap,
};
writeFileSync(join(HERE, 'activity-data.json'), JSON.stringify(data, null, 2));
console.log(JSON.stringify({ total, privateCount, prs, merged, active, longest, months: months.map((m) => `${m.label}:${m.total}`).join(' ') }));
