# PayFi Copilot – Technical Development Report

**Date:** 18 May 2025  
**Authors:** Dushyant Kashyap et al.

*(Originally prototyped under the code‑name **PayFi Copilot**; the end‑user product is now branded **ChatPayFi**. Internal SDK / CLI packages keep the `payfi‑copilot` identifier for backward compatibility.)*

---

## Abstract
PayFi Copilot is a research prototype that converts natural‑language payment
specifications into runnable Clarity smart‑contracts on the Stacks blockchain,
then compiles, deploys and exposes them as sBTC pay‑links.  
This paper documents the complete engineering workflow—from open‑source corpus
curation and LoRA fine‑tuning of Llama‑3‑8B to full‑stack integration with
FastAPI, SvelteKit, Clarinet dev‑chains and Stacks transaction tooling.

## 1 Introduction
Merchant onboarding to Bitcoin‑secured DeFi remains highly technical. PayFi
Copilot explores whether a lightweight LLM interface can democratise contract
authoring while preserving the security guarantees of sBTC.

---

## 2 System Overview
```mermaid
graph TD
  subgraph Browser
    A[Prompt
UI]
    B[Monaco
Editor]
  end
  subgraph API (GPU VM)
    C[/generate]
    D[/compile]
  end
  subgraph Clarity
Simnet
    E[clarinet console]
  end
  F[edge‑deploy.ts
(Node)]
  A -->|JSON| C
  C --> B
  B -->|code| D
  B -->|deploy| F --> E
```

| Layer | Tech | Purpose |
|-------|------|---------|
| LLM   | Llama‑3‑8B‑Instruct + 4‑bit QLoRA | NL→Clarity generation |
| Dataset | 10 OSS repos → 11 k fn‑level pairs | Domain adaptation |
| API | FastAPI + Peft | Serve generate/compile routes |
| Compile | Clarinet CLI | Static analysis inside simnet |
| Deploy | `@stacks/transactions` (Node) | Broadcast contracts |
| UI | SvelteKit + Tailwind | Chat / Editor / Tx viewer |

---

## 3 Dataset Preparation
### 3.1 Corpus Acquisition
* 10 seminal Stacks repos (Arkadiko, ALEX, Swapr, …) cloned to `dataset-src/`
* 598 `.clar` files → 134 k LOC

### 3.2 Function Slicing
A lightweight regex parser extracted **11 301** `define-*` blocks.  
Snippets \< 10 lines were discarded.

### 3.3 Keyword Tagging
Eight heuristic buckets provided coarse supervision (`swap-amm`, `loan-borrow`,
`token-ft-core` …).  
Final label stats:

| Tag | Samples |
|-----|---------|
| token‑ft‑core | 1 007 |
| admin‑owner | 673 |
| loan‑borrow | 239 |
| swap‑amm | 187 |
| ido‑launch | 112 |
| … | … |

### 3.4 Instruction Pair Construction
Each `(snippet, tag)` pair became a `<prompt, response>` record resulting in
**11 057** training examples.

---

## 4 Model Fine‑Tuning
* **Base:** `meta-llama/Meta-Llama-3-8B-Instruct`
* **Method:** 4‑bit QLoRA (bnb 0.43.1) on A100‑40GB
* **Hyper‑params**

| Epochs | BSz | LR | σ |
|--------|-----|----|---|
| 3 | 4×4 GA | 2 e‑4 | 0.05 |

*Training runtime:* 46 min; peak ΔVRAM ≈ 18 GB.

---

## 5 Backend Architecture
### 5.1 FastAPI Service
```text
api/
  main.py          – routes
  llm_service.py   – lazy LoRA loader
  clarinet_service.py – compile helper
```
Endpoints:

| Route | Method | Description |
|-------|--------|-------------|
| `/generate` | POST | LLM inference |
| `/compile` | POST | Clarinet `check` |
| `/deploy`* | POST | Node helper (edge-deploy.ts) |

\*Deployment routed to Node to leverage mature JS SDK.

---

## 6 Front‑End Integration
* **Chat →** `/generate` — streams code into Monaco.
* **Compile →** `/compile` — diagnostics overlay (shadcn `Alert`).
* **Deploy →** Node helper — returns `txid`; page `/tx/[txid]` shows QR.

---

## 7 Deployment & Hosting
* **GPU API**: A10‑24GB VM (Ubuntu 22.04, CUDA 12.3, Docker).
* **Front‑end**: Vercel static hosting pointing at
  `https://api.chatpayfi.com`.
* **Domains**: `ChatPayFi.com` (primary).

---

## 8 Future Work
1. **sBTC Fee sponsor** – abstract STX fees for merchants.
2. **Lightning bridge** – dual QR (on‑chain vs LN‑Invoice).
3. **LLM‑driven audits** – secondary model runs Slither‑style static checks.
4. **Cold‑storage sweep** – weekly cron triggers contract to flush fees.

---

## 9 References
* [Hiro Systems Clarinet Docs](https://docs.hiro.so/clarinet)
* [Stacks Transactions JS SDK](https://github.com/stacks-network/stacks.js)
* Dettmers, T. *et al.*, “QLoRA: Efficient Finetuning…” ACL 2023.

---

*© 2025 Ayudh Inc.*
