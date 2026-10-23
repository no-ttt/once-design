#!/usr/bin/env python3
"""Set every local CSS/JS reference's ?v= to a hash of that file's content (no dependencies).

A file's version only changes when its content changes, so browsers and the GitHub Pages
CDN always fetch matching CSS/JS for the HTML they received. Prints each file it rewrites.
"""
from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
# Pages and scripts load assets as ../assets/...; resolve from the assets folder.
REF = re.compile(r'((?:\.\./)?(assets/[\w./-]+\.(?:css|js)))(\?v=[^"\'\s)&#]*)?(?=["\'\s)#])')

sources = [p for folder in ('en', 'zh', 'assets') for p in (ROOT / folder).rglob('*')
           if p.is_file() and p.suffix in {'.html', '.css', '.js'}]
changed = set()
# Scripts can reference other scripts (trends-content.js loads article.js), so repeat until stable.
for _ in range(5):
    hashes = {}
    def version(match):
        target = ROOT / match.group(2)
        if not target.is_file():
            return match.group(0)
        if target not in hashes:
            hashes[target] = hashlib.md5(target.read_bytes()).hexdigest()[:8]
        return match.group(1) + '?v=' + hashes[target]
    updated = False
    for source in sources:
        text = source.read_text(encoding='utf-8')
        new = REF.sub(version, text)
        if new != text:
            source.write_text(new, encoding='utf-8')
            changed.add(source)
            updated = True
    if not updated:
        break
for source in sorted(changed):
    print(source.relative_to(ROOT))
