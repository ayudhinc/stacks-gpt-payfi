# ChatPayFi

Natural‑language → Clarity smart‑contract generator for **sBTC‑powered payments**  
*(Stacks Bitcoin L2 • Hackathon 2025 “Best use of sBTC” winner)*
*(developer SDK package name: `payfi‑copilot`)*

---

## ✨ Features

* **Chat‑to‑Contract** – Llama‑3‑8B LoRA converts English payment specs into runnable Clarity.
* **One‑click Compile & Deploy** – Clarinet checks then on‑chain broadcast.
* **sBTC Pay‑Links** – Generates `stacks://pay?...` URLs + QR codes.
* **Browser REPL** – Monaco editor with diagnostics; auto‑save.
* **Cold‑storage Sweep** – Weekly cron to move merchant funds to cold BTC.

---

## 🗂 Repo Layout

```
stacks-gpt-payfi/
├ api/                      *FastAPI back‑end*
├ payfi-copilot-lora/       *LoRA checkpoint*
├ payfi-copilot-ui/         *SvelteKit front‑end*
├ scripts/                  *Dataset & training*
└ dataset-*                 *Local corpora (git‑ignored)*
```

---

## 🖥️ Local Dev

### 1 Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.10 / 3.11 | bitsandbytes wheels |
| Node   | ≥ 20 | front‑end & deploy helper |
| Clarinet | ≥ 3.0 | dev‑net |
| Docker + GPU | optional | prod API |

### 2 Setup

```bash
git clone --recursive <repo>
cd stacks-gpt-payfi
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
npm -C payfi-copilot-ui install
```

Create `.env`:

```
PAYFI_LORA_PATH=payfi-copilot-lora
VITE_API_BASE=http://localhost:8000
VITE_STACKS_NODE=http://localhost:3999
DEPLOYER_PRIVKEY=<clarinet key>
```

### 3 Run

```bash
clarinet console &      # simnet
uvicorn api.main:app --reload
npm -C payfi-copilot-ui run dev
```

Open <http://localhost:5173>.

---

## 🚀 Production

### GPU Docker VM

```bash
docker build -t payfi-copilot .
docker run --gpus all -e PAYFI_LORA_PATH=/app/payfi-copilot-lora -p 80:8000 payfi-copilot
```

Point `api.chatpayfi.com` to VM IP; deploy front‑end on Vercel.

---

## 🧪 Smoke Test

```bash
curl -X POST $VITE_API_BASE/generate   -H "content-type: application/json"   -d '{"prompt":"Daily subscription with 3‑day trial"}'
```

---

## 💰 Training Stats

* **Runtime:** ~6 H pure training (8 h incl. setup)  
* **Hardware:** RunPod H100 PCIe (24 vCPU / 188 GB RAM)  
* **Cost:** ~ $11

---

## Roadmap

- sBTC fee sponsor
- Lightning dual‑mode checkout
- Automated audits
