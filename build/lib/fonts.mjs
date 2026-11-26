// Embeds only the glyphs an SVG actually uses, so every image stays a few KB
// and renders with the real brand fonts inside GitHub's <img> sandbox.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(HERE, '..', 'fonts');
const PYTHON = process.env.FONT_PYTHON; // a Python with fonttools + brotli

export const FAMILY = {
  'inter-400': { family: 'NInter', weight: 400 },
  'inter-500': { family: 'NInter', weight: 500 },
  'inter-600': { family: 'NInter', weight: 600 },
  'inter-700': { family: 'NInter', weight: 700 },
  'inter-800': { family: 'NInter', weight: 800 },
  'mono-400': { family: 'NMono', weight: 400 },
  'mono-500': { family: 'NMono', weight: 500 },
  'mono-700': { family: 'NMono', weight: 700 },
};

export const SANS = "NInter, Inter, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
export const MONO = "NMono, 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** Characters that appear inside <text> elements of the SVG body. */
function usedCharacters(svgBody) {
  const chunks = [...svgBody.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map((m) => m[1]);
  const plain = decodeEntities(chunks.join('').replace(/<[^>]+>/g, ''));
  return [...new Set(plain + ' ')].join('');
}

function subsetToBase64(fontKey, chars) {
  if (!PYTHON) throw new Error('Set FONT_PYTHON to a Python that has fonttools and brotli');
  const work = mkdtempSync(join(tmpdir(), 'nsub-'));
  try {
    const textFile = join(work, 'chars.txt');
    const outFile = join(work, 'out.woff2');
    writeFileSync(textFile, chars, 'utf8');
    execFileSync(PYTHON, [
      '-m',
      'fontTools.subset',
      join(FONTS_DIR, `${fontKey}.woff2`),
      `--text-file=${textFile}`,
      '--flavor=woff2',
      '--layout-features=kern,liga,calt,tnum',
      `--output-file=${outFile}`,
    ]);
    return readFileSync(outFile).toString('base64');
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

/** Returns an @font-face block for every font key used, subset to the SVG's text. */
export function fontFaces(svgBody, fontKeys) {
  const chars = usedCharacters(svgBody);
  return fontKeys
    .map((key) => {
      const { family, weight } = FAMILY[key];
      const data = subsetToBase64(key, chars);
      return `@font-face{font-family:${family};font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2');}`;
    })
    .join('');
}
