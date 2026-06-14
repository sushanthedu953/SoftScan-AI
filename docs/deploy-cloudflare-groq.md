# Deploy SoftScan AI with Cloudflare Pages and Groq

This setup keeps the AI API key out of the browser.

## 1. Create a Groq API key

1. Go to https://console.groq.com/keys.
2. Create an API key.
3. Copy it once and keep it private.

## 2. Push this repo to GitHub

```bash
git add .
git commit -m "Add Cloudflare Groq AI proxy"
git push
```

## 3. Create the Cloudflare Pages app

1. Go to https://dash.cloudflare.com.
2. Open **Workers & Pages**.
3. Choose **Create application**.
4. Choose **Pages**.
5. Connect your GitHub repository.
6. Use these build settings:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

Cloudflare will deploy the React app and the `functions/api/ai.ts` Pages Function together.

## 4. Add environment variables

In the Cloudflare Pages project:

1. Open **Settings**.
2. Open **Environment variables**.
3. Add this production secret:

| Name | Value |
| --- | --- |
| `GROQ_API_KEY` | your Groq key |

Optional:

| Name | Value |
| --- | --- |
| `GROQ_MODEL` | `llama-3.1-8b-instant` |
| `ALLOWED_ORIGIN` | your deployed site URL, for example `https://softscan-ai.pages.dev` |

After adding variables, redeploy the latest deployment.

## 5. Test the hosted API

Open the deployed site and go to `/status`.

Expected result:

- Web app: OK
- Local scan history: OK
- AI provider: Groq connected
- winget integration: OK

## GitHub Pages note

GitHub Pages can host the frontend, but it cannot safely store AI secrets. If you use GitHub Pages for the React app, keep the Cloudflare Function as a separate API endpoint and set this build variable:

```env
VITE_AI_PROXY_URL=https://your-worker-or-pages-function-url/api/ai
```

For the simplest free setup, use Cloudflare Pages for both the frontend and the API function.
