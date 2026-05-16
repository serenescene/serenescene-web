<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Serene Scene

- **CI:** GitHub Actions on push/PR to `main` or `master` — `npm ci`, `npm run lint`, `npm run build` (see `.github/workflows/ci.yml`).
- **Dependabot:** weekly npm + GitHub Actions updates (`.github/dependabot.yml`).
- **Deploy hook (optional):** GitHub secret `VERCEL_DEPLOY_HOOK_URL` — Vercel project → Settings → Git → **Deploy Hooks** → create for `main` → paste URL. Push to `main` runs `.github/workflows/deploy-web.yml` (skipped if secret is empty). You can rely on Vercel’s native Git integration instead; this hook is for “trigger only” without full Git sync if you prefer.
