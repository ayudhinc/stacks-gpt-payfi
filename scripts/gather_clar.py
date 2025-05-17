#!/usr/bin/env python3
"""
Gather every *.clar file from dataset-src/{repo}/ and copy it to
dataset-raw/clar-src/, prefixing the filename with the repo name.
Also emit a quick summary (files, total LOC).
"""

import shutil, textwrap, pathlib

SRC_ROOT = pathlib.Path("dataset-src")
DST_ROOT = pathlib.Path("dataset-raw/clar-src")
DST_ROOT.mkdir(parents=True, exist_ok=True)

count_files = 0
count_lines = 0

for clar_path in SRC_ROOT.rglob("*.clar"):
    repo = clar_path.parts[1] if clar_path.parts[0] == "dataset-src" else clar_path.parts[0]
    dst_name = f"{repo}__{clar_path.name}"
    dst_path = DST_ROOT / dst_name
    shutil.copy2(clar_path, dst_path)

    count_files += 1
    with clar_path.open("r", encoding="utf-8", errors="ignore") as f:
        count_lines += sum(1 for _ in f)

print(textwrap.dedent(f"""
    ✅ Gather complete
    Files copied : {count_files}
    Total LOC    : {count_lines}
    Output dir   : {DST_ROOT}
""").strip())
