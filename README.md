# SRM Girls Survival AI — Next.js (Starter)

This repository contains a starter Next.js project for the **SRM Girls Survival AI** website:
- Multi-page UI: Home, Chat (AI), Mess game, Guide, Map
- Simple `/api/ask` server endpoint (proxies to OpenAI)
- Light-spring pastel, comic-style UI with 3D tilt & voice (browser TTS)

## Quick local run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` in the project root with:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Deploy on Vercel
1. Push this repo to GitHub.
2. Import the project in Vercel (vercel.com) and set the Environment Variable:
   - `OPENAI_API_KEY`
3. Deploy — Vercel will build and serve the site globally.

## Notes
- The `/api/ask` endpoint in this starter proxies requests to OpenAI. Do NOT expose your API key on the client.
- Tweak the `system` prompt inside `/pages/api/ask.js` to tune sarcasm level.
- Replace placeholder images in `/public` with your own assets for stronger comic/cel-shaded look.
