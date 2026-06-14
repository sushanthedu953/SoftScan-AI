# SoftScan AI

AI-powered software health assistant for Windows. Upload a `winget` export, review outdated and at-risk apps, and generate update scripts.

## Features

- Upload `.txt` or `.json` software inventories
- Dashboard with security / update / up-to-date status
- SoftScan Copilot chat (Cloudflare Pages Function + Groq, with optional local Gemini fallback)
- Scan history (browser localStorage)
- Batch and per-app PowerShell update scripts

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

Local development works in offline fallback mode unless you configure an AI provider. The recommended hosted setup is Cloudflare Pages + `/api/ai` + a Groq secret. See [docs/deploy-cloudflare-groq.md](docs/deploy-cloudflare-groq.md).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Export installed apps (Windows)

```powershell
winget list | ConvertTo-Json | Out-File installed_apps.json
```

Upload the file in the app chat section.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, Zustand, React Router, Cloudflare Pages Functions, Groq API, optional Google Gemini API

## License

Private / MIT — update as needed.
