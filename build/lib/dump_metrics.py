"""Dump per-character advance widths (as fraction of em) for each subset font into metrics.json."""
import json, sys, pathlib
from fontTools.ttLib import TTFont

fonts_dir = pathlib.Path(sys.argv[1])
out = {}
for f in sorted(fonts_dir.glob('*.woff2')):
    font = TTFont(str(f))
    upem = font['head'].unitsPerEm
    cmap = font.getBestCmap()
    hmtx = font['hmtx']
    out[f.stem] = {chr(cp): round(hmtx[g][0] / upem, 4) for cp, g in cmap.items()}
pathlib.Path(sys.argv[2]).write_text(json.dumps(out), encoding='utf-8')
print('fonts:', list(out))
