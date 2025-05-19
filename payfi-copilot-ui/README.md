# ChatPayFi UI

AI-assisted Clarity contract builder

## Stack
- SvelteKit (latest)
- Tailwind CSS v3 + @tailwindcss/typography
- svelte-monaco-editor
- Svelte stores
- FastAPI backend (http://localhost:8000)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## Directory layout

```
payfi-copilot-ui/
├ src/
│ ├ routes/
│ │ ├ +page.svelte        # landing & chat
│ │ ├ +layout.svelte      # global layout & dark mode
│ │ ├ editor/+page.svelte # code editor / compile / deploy
│ │ └ tx/[txid]/+page.svelte # explorer & pay-link
│ ├ lib/
│ │ ├ api.ts             # typed fetch helpers
│ │ └ stores.ts          # prompt & code stores
│ └ app.d.ts
├ static/
│ └ logo.svg
├ tailwind.config.cjs
├ postcss.config.cjs
├ package.json
├ README.md
```

## Features
- Chat-to-contract (AI chat → Clarity code)
- Monaco editor (Clarity syntax)
- Compile & deploy Clarity contracts
- Transaction explorer & pay-link
- Responsive & dark mode

---

For Monaco editor Clarity highlighting, you may need to add a custom grammar or use plaintext as fallback.
