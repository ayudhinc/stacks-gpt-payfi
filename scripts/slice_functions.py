#!/usr/bin/env python3
"""
Walk dataset-raw/clar-src/, emit one JSONL line per Clarity function.
"""

import json, pathlib, re
from scripts.tree_sitter_loader import get_clarity_parser

SRC_DIR = pathlib.Path("dataset-raw/clar-src")
OUT_FILE = pathlib.Path("dataset-raw/functions.jsonl")
parser = get_clarity_parser()

VISIBILITY_NODES = {
    "define_public_function": "public",
    "define_private_function": "private",
    "define_read_only_function": "read-only",
}

def node_text(src_bytes, node):
    return src_bytes[node.start_byte: node.end_byte].decode()

with OUT_FILE.open("w", encoding="utf-8") as out:
    for clar_path in SRC_DIR.iterdir():
        if clar_path.suffix != ".clar": continue
        src = clar_path.read_bytes()
        tree = parser.parse(src)
        repo = clar_path.name.split("__")[0]
        file_name = "__".join(clar_path.name.split("__")[1:])  # remove prefix

        cursor = tree.walk()
        stack = [cursor.node]
        while stack:
            node = stack.pop()
            if node.type in VISIBILITY_NODES:
                fn_name_node = node.child_by_field_name("name")
                fn_name = node_text(src, fn_name_node)
                code_snippet = node_text(src, node)
                out.write(json.dumps({
                    "id": f"{repo}/{file_name}::{fn_name}",
                    "repo": repo,
                    "file": file_name,
                    "fn_name": fn_name,
                    "visibility": VISIBILITY_NODES[node.type],
                    "code": code_snippet,
                    "tags": []
                }) + "\n")
            # DFS
            for i in range(node.child_count - 1, -1, -1):
                stack.append(node.child(i))
print("✅ functions.jsonl written to", OUT_FILE)
