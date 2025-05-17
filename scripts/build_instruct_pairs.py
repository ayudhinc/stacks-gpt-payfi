#!/usr/bin/env python3
"""
Convert tagged snippets into instruction-tuning pairs.

Input : dataset-raw/functions.tagged.jsonl   (output of tag_functions.py)
Output: dataset-raw/instruct_pairs.jsonl
"""

import json, pathlib, random, textwrap

SRC = pathlib.Path("dataset-raw/functions.tagged.jsonl")
DST = pathlib.Path("dataset-raw/instruct_pairs.jsonl")

random.seed(42)
pairs_written = 0
bad_lines     = 0

with SRC.open(encoding="utf-8") as fin, DST.open("w", encoding="utf-8") as fout:
    for raw in fin:
        try:
            snip = json.loads(raw)
        except json.JSONDecodeError:
            bad_lines += 1
            continue                        # skip junk lines

        if not snip.get("tags"):
            continue                        # un-tagged → ignore

        for tag in snip["tags"]:
            prompt = (
                f"Write a Clarity {tag.replace('-', ' ')} function named "
                f"`{snip['fn_name']}` that performs the described logic."
            )
            fout.write(json.dumps({"prompt": prompt, "response": snip["code"]}) + "\n")
            pairs_written += 1

print(textwrap.dedent(f"""
    ✅ instruct_pairs.jsonl created
    Source file   : {SRC.name}
    Pairs written : {pairs_written}
    Bad JSON lines: {bad_lines}
    Output        : {DST}
""").strip())
