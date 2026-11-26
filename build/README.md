# How the profile pictures are made

Every image in the profile README is an SVG drawn by these scripts from the content of
[nugrahalabib.com](https://nugrahalabib.com): the same hero, 3D mascot, numbers, logo wall,
journey and contact. Each picture comes in a light and a dark version, and GitHub shows the one
that matches the reader's theme.

- `content.mjs` holds every word, number and link.
- `components/` draws each section (hero, about, logo wall, work cards, journey, contact).
- `lib/svg.mjs` holds the palette: white and `#f5f5f7` on light GitHub, lit graphite on dark GitHub,
  with `#ce3330` as the accent, as on the website.
- Fonts are Inter and JetBrains Mono (SIL Open Font License), subset to the glyphs each picture uses
  and embedded, so the text renders the same everywhere.
- Motion is CSS and SMIL inside the SVG (the typing role line, the mascot changing costume, the
  numbers counting up, the journey bars drawing in) and stops for readers who prefer reduced motion.

Build:

```sh
pip install fonttools brotli
FONT_PYTHON=python node build/build.mjs   # writes assets/*-dark.svg and *-light.svg
node build/readme.mjs                     # writes README.md
```
