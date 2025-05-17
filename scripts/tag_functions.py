#!/usr/bin/env python3
"""
Auto-tag Clarity function snippets with coarse payment-pattern labels.

Input : dataset-raw/functions.jsonl      (produced by slice_functions.py)
Output: dataset-raw/functions.tagged.jsonl
         – identical schema but with a populated `tags` list
"""

import json
import pathlib
import re
import textwrap
from collections import Counter

# ──────────────────────────────────────────────────────────────────────────────
# 1.  Tag dictionary — extend / tweak as you like
# ──────────────────────────────────────────────────────────────────────────────
TAG_RULES = {
    # ── payment-flow primitives ───────────────────────────────────────────────
    "subscription-stream": [
        "stream", "drip", "vesting", "linear-vesting", "claim-vesting",
        "subscription", "subscribe", "unsubscribe", "daily", "monthly"
    ],
    "escrow-htlc": [
        "escrow", "htlc", "hashlock", "timelock", "time-lock",
        "redeem", "release", "lock-funds", "unlock-funds",
        "payment-channel", "channel-close"
    ],
    "swap-amm": [
        "swap", "exchange", "add-liquidity", "remove-liquidity",
        "provide-liquidity", "constant-product", "trade", "token-swap"
    ],
    "loan-borrow": [
        "borrow", "repay", "liquidate", "liquidation", "collateral",
        "deposit-collateral", "withdraw-collateral", "mint-stable",
        "redeem-stable", "create-vault", "close-vault", "loan"
    ],
    "ido-launch": [
        "ido", "launchpad", "create-pool", "register", "claim-ido",
        "redeem-tokens", "activate-ido", "allocation", "whitelist"
    ],
    # ── token basics ───────────────────────────────────────────────────────────
    "token-ft-core": [
        "transfer", "transfer-fixed", "mint", "burn", "approve",
        "increase-allowance", "decrease-allowance", "allowance",
        "balance-of", "total-supply", "decimals", "symbol", "name"
    ],
    "token-nft": [
        "token-uri", "get-token-uri", "set-token-uri", "nft",
        "mint-nft", "transfer-nft", "approve-nft", "collection",
        "royalty", "metadata"
    ],
    # ── admin / governance ────────────────────────────────────────────────────
    "admin-owner": [
        "set-owner", "change-owner", "is-owner", "only-owner",
        "pause", "unpause", "authorized", "add-admin", "set-admin"
    ],
}

# ──────────────────────────────────────────────────────────────────────────────
# 2.  Config & helper regex
# ──────────────────────────────────────────────────────────────────────────────
MIN_LINES   = 4    # ignore trivial getters / setters
HEAD_LINES  = 40    # scan only the first N lines of code
WORD_RE     = re.compile(r"[a-z0-9\-]+")

IN_FILE     = pathlib.Path("dataset-raw/functions.jsonl")
OUT_FILE    = pathlib.Path("dataset-raw/functions.tagged.jsonl")

TAG_RULES["token-ft-getter"] = [
    "get", "set", "balance", "allowance", "symbol", "name",
    "decimals", "total-supply", "owner", "approved"
]
# ──────────────────────────────────────────────────────────────────────────────
# 3.  Tagging logic
# ──────────────────────────────────────────────────────────────────────────────
def tag_snippet(snippet: dict) -> dict:
    """Return the snippet with `tags` filled according to TAG_RULES."""
    code_lines = [ln for ln in snippet["code"].splitlines() if ln.strip()]
    if len(code_lines) < MIN_LINES:
        snippet["tags"] = []              # too small → ignore
        return snippet

    # searchable tokens
    fn_tokens  = WORD_RE.findall(snippet["fn_name"].lower())
    code_head  = "\n".join(code_lines[:HEAD_LINES]).lower()

    tags_found = set()
    for tag, keywords in TAG_RULES.items():
        for kw in keywords:
            kw_lc = kw.lower()
            if kw_lc in fn_tokens or kw_lc in code_head:
                tags_found.add(tag)
                break                     # stop searching this tag’s list

    snippet["tags"] = sorted(tags_found)  # deterministic output
    return snippet

# ──────────────────────────────────────────────────────────────────────────────
# 4.  Main pass
# ──────────────────────────────────────────────────────────────────────────────
counters = Counter()

OUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with IN_FILE.open() as fin, OUT_FILE.open("w") as fout:
    for line in fin:
        snip = tag_snippet(json.loads(line))
        counters.update(snip["tags"] or ["__untagged__"])
        fout.write(json.dumps(snip) + "\n")

# ──────────────────────────────────────────────────────────────────────────────
# 5.  Summary
# ──────────────────────────────────────────────────────────────────────────────
total       = sum(counters.values())
tagged      = total - counters["__untagged__"]
untagged    = counters["__untagged__"]

print(textwrap.dedent(f"""
    ✅ Tagging complete
    Total snippets : {total}
    Tagged         : {tagged}
    Untagged       : {untagged}
    Top tags       : {counters.most_common(10)}
    Output         : {OUT_FILE}
""").strip())
