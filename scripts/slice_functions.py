#!/usr/bin/env python3
"""
Regex-based Clarity function slicer.
Extracts every (define-public|define-private|define-read-only ...) block
and writes one JSONL line per function.
"""

import json, pathlib, re, textwrap

SRC_DIR = pathlib.Path("dataset-raw/clar-src")
OUT_FILE = pathlib.Path("dataset-raw/functions.jsonl")

FUNC_RE = re.compile(
    rb"\(\s*(define-(?:public|private|read-only))\s+\(([^)\s]+)",  # (define-public (fn-name
    re.IGNORECASE,
)

def slice_file(path: pathlib.Path):
    src = path.read_bytes()
    results = []
    for m in FUNC_RE.finditer(src):
        start = m.start()          # start of “(define-public …”
        depth = 0
        i = start
        while i < len(src):
            if src[i:i+1] == b"(":
                depth += 1
            elif src[i:i+1] == b")":
                depth -= 1
                if depth == 0:
                    i += 1  # include the closing paren
                    break
            i += 1
        snippet = src[start:i].decode(errors="ignore")
        results.append(
            {
                "id": f"{path.name}::{m.group(2).decode()}",
                "repo": path.name.split("__")[0],
                "file": "__".join(path.name.split("__")[1:]),
                "fn_name": m.group(2).decode(),
                "visibility": m.group(1).decode().split("-")[1],
                "code": snippet,
                "tags": [],
            }
        )
    return results

all_snippets = []
for clar in SRC_DIR.iterdir():
    if clar.suffix == ".clar":
        all_snippets.extend(slice_file(clar))

with OUT_FILE.open("w", encoding="utf-8") as f:
    for row in all_snippets:
        f.write(json.dumps(row) + "\n")

print(
    textwrap.dedent(
        f"""
    ✅ Slicing complete
    Files scanned   : {len(list(SRC_DIR.iterdir()))}
    Functions found : {len(all_snippets)}
    Output          : {OUT_FILE}
"""
    ).strip()
)
