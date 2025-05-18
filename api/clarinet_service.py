import subprocess, tempfile, json, os, pathlib, uuid
from stacks.transactions import Contract, broadcast_transaction, StacksNetwork
from dotenv import load_dotenv
load_dotenv()

SIMNET_URL   = os.getenv("SIMNET_URL", "http://localhost:3999")
PRIVATE_KEY  = os.getenv("DEPLOYER_PRIVKEY")           # from clarinet.toml
ACCOUNT      = os.getenv("DEPLOYER_ADDRESS")

network = StacksNetwork(custom_node_url=SIMNET_URL)

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

def deploy(code: str, contract_name: str | None = None) -> str:
    """Deploy to simnet; return txid. Raises on error."""
    contract_name = contract_name or f"ai_{uuid.uuid4().hex[:8]}"
    tx = (Contract.deploy()
          .set_contract_name(contract_name)
          .set_code_body(code)
          .set_sender_key(PRIVATE_KEY)
          .set_anchor_mode(AnchorMode.Any)
          .build())
    receipt = broadcast_transaction(tx, network)
    if receipt.is_error:            # type: ignore
        raise RuntimeError(receipt.error)
    return receipt.tx_id            # type: ignore
