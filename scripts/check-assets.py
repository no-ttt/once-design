#!/usr/bin/env python3
"""Check literal local asset references in HTML, JS, JSON and CSS (no dependencies)."""
from pathlib import Path
import re
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
errors = []
checked = 0
for source in ROOT.rglob('*'):
    if not source.is_file() or source.suffix not in {'.html', '.css', '.js', '.json'}:
        continue
    if any(part.startswith('.') for part in source.relative_to(ROOT).parts):
        continue
    text = source.read_text()
    if source.suffix == '.css':
        refs = [(source.parent, m.group(2)) for m in re.finditer(r'url\(\s*([\'"]?)([^)\'"]+)\1\s*\)', text)]
    else:
        # JS/JSON asset values are resolved by pages one level below the root.
        base = source.parent if source.suffix == '.html' else ROOT / 'en'
        refs = [(base, m.group()) for m in re.finditer(r'(?:\.\./)?assets/[\w./-]+\.(?:jpg|jpeg|png|svg|webp|avif|mp4|css|js|json|woff2?|ttf|otf)\b', text)]
    for base, ref in refs:
        if ref.startswith(('data:', 'https:', 'http:', '//', '#')):
            continue
        target = base / unquote(re.split(r'[?#]', ref)[0])
        checked += 1
        if not target.is_file():
            errors.append(f'{source.relative_to(ROOT)}: {ref}')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'OK: {checked} local asset references exist. Dynamic paths should also be checked in a browser.')
