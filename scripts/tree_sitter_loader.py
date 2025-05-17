# scripts/tree_sitter_loader.py
from tree_sitter import Language, Parser
import pathlib, os

TS_LIB = pathlib.Path("tools/build/my-languages.so")
if not TS_LIB.exists():
    Language.build_library(
        str(TS_LIB),
        [ "tools/tree-sitter-clarity" ]
    )
CLARITY = Language(str(TS_LIB), "clarity")

def get_clarity_parser():
    p = Parser(); p.set_language(CLARITY)
    return p
