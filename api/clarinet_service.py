import subprocess, tempfile, json, os, pathlib, uuid

from dotenv import load_dotenv
load_dotenv()

SIMNET_URL   = os.getenv("SIMNET_URL", "http://localhost:3999")
PRIVATE_KEY  = os.getenv("DEPLOYER_PRIVKEY")           # from clarinet.toml
ACCOUNT      = os.getenv("DEPLOYER_ADDRESS")


def compile_snippet(code: str) -> list[str]:
    """Return list of diagnostic strings; empty if compile OK."""
    with tempfile.TemporaryDirectory() as tmp:
        path = pathlib.Path(tmp) / "contract.clar"
        path.write_text(code, encoding="utf-8")
        proc = subprocess.run(
            ["clarinet", "check", "--manifest-path", str(path)],
            capture_output=True, text=True
        )
        return proc.stderr.splitlines()

# stub – front-end will deploy with stacks.js
def deploy(code: str, contract_name: str | None = None) -> str:
    """Deploy to simnet; return txid. Raises on error."""
    raise NotImplementedError("Use /compile then call /deploy via Node helper.")