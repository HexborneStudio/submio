# Deploy to Railway — Step by Step

**Created:** 2026-03-22
**Status:** Ready to deploy

---

## What You Need

1. A [Railway](https://railway.app) account (free tier works)
2. GitHub repo connected to Railway (or push directly)

---

## Step 1: Authenticate Railway CLI

On your Mac (terminal with browser access):

```bash
# Install Railway CLI
brew install railway

# Login
railway login
# → Opens browser, click "Authorize"

# Verify
railway whoami
```

**Or** use an API token (no browser needed):
```bash
# Get token from: dashboard.railway.app → Account → API Tokens
export RAILWAY_TOKEN="your-token-here"
railway whoami
```

---

## Step 2: Get Railway API Token

1. Go to [dashboard.railway.app](https://dashboard.railway.app) → Account → API Tokens
2. Create a new token (name it "GitHub Actions" or "CLI")
3. Copy the token immediately — it only shows once

**For Railway CLI:**
```bash
export RAILWAY_TOKEN="your-token-here"
railway whoami
```

**For GitHub Actions (recommended):**
1. Go to your GitHub repo → Settings → Secrets and Variables → Actions
2. Add a new repository secret: `RAILWAY_TOKEN` = your Railway API token
3. Push the code and the deploy workflow will run automatically

---

## Step 3: Create Railway Project

```bash
cd ~/authorship-receipt

# Create new project
railway init
# → Follow prompts: select GitHub repo, choose region

# Or create from Railway dashboard:
# dashboard.railway.app → New Project → Connect GitHub repo
```

---

## Step 3: Provision Infrastructure

### PostgreSQL
```bash
railway add
# → Select: Provision PostgreSQL
```
Or via dashboard: New Project → Add Plugin → PostgreSQL

Note the connection string from the Railway PostgreSQL plugin settings.

### Redis
```bash
railway add
# → Select: Provision Redis
```
Or via dashboard: Add Plugin → Redis

---

## Step 4: Configure Environment Variables

Go to your Railway project → each service's Variables tab.

### Web App (`apps/web`)
```
NODE_ENV=production
DATABASE_URL=<postgresql connection string from Step 3>
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
NEXTAUTH_URL=https://<your-web-domain>.railway.app
APP_URL=https://<your-web-domain>.railway.app
```

### Worker (`apps/worker`)
```
NODE_ENV=production
DATABASE_URL=<same postgresql connection string>
REDIS_HOST=<redis hostname from Railway plugin>
REDIS_PORT=6379
ADMIN_SECRET=<random secret>
WORKER_PORT=3001
```

---

## Step 5: Deploy Services

### Option A: GitHub Actions (Recommended — Fully Automated)

1. Push this repo to GitHub
2. Add `RAILWAY_TOKEN` to GitHub repo Secrets (Settings → Secrets and Variables → Actions)
3. The workflow `.github/workflows/deploy.yml` runs automatically on push to main
4. Or: go to Actions tab → "Deploy to Railway" → Run workflow

No manual deployment after setup — every push to `main` deploys automatically.

### Option B: Railway CLI (Manual)

### Option A: Deploy from GitHub (Recommended)

1. Push the repo to GitHub
2. In Railway dashboard: New Project → Connect GitHub repo
3. Add each service:
   - **worker** — pointing to `apps/worker/`
   - **web** — pointing to `apps/web/`
4. Set root directory for each: `apps/worker` and `apps/web`
5. Set start commands:
   - Worker: `npm run dev`
   - Web: `npm start`
6. Add environment variables from Step 4
7. Click Deploy

### Option B: Deploy via Railway CLI

```bash
# Link to project
railway link <project-id>

# Deploy worker
cd apps/worker
railway up

# Deploy web
cd apps/web
railway up
```

---

## Step 6: Wire Worker to Web

After deploying the worker, update the web app's `enqueue` route to use the worker's Railway URL instead of `localhost:3007`:

```typescript
// apps/web/src/app/api/documents/[documentId]/enqueue/route.ts
// OR apps/web/app/api/documents/[documentId]/enqueue/route.ts
// Change:
`http://localhost:3007/enqueue`
// To:
`https://<worker-service-name>.up.railway.app/enqueue`
```

Add this URL as an environment variable:
```
WORKER_URL=https://<worker-service-name>.up.railway.app
```

---

## Step 7: Custom Domain (Optional)

1. Railway dashboard → Web service → Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` and `APP_URL` to your domain

---

## Step 8: Run Smoke Test

After deployment:

1. Open your app URL
2. Sign in with email
3. Create a paper check (paste 200+ words with fake citations)
4. Wait for analysis
5. Check summary + detailed report
6. Create share link
7. Open share link + submit instructor review
8. Export PDF
9. Check dashboard

---

## Files Prepared for Deployment

| File | Purpose |
|------|---------|
| `apps/web/railway.json` | Railway config (Dockerfile build) |
| `apps/worker/railway.json` | Railway config (Dockerfile build) |
| `apps/web/Dockerfile` | Web app production build |
| `apps/worker/Dockerfile` | Worker production build |
| `DEPLOY-RAILWAY.md` | This guide |

---

## Troubleshooting

**Worker can't connect to Redis:**
→ Check `REDIS_HOST` and `REDIS_PORT` in worker env vars

**Analysis jobs never complete:**
→ Check worker logs in Railway dashboard
→ Verify `DATABASE_URL` is correct in worker env vars
→ Check Redis is accessible from worker

**Web returns 500 on paper creation:**
→ Check web server logs
→ Verify `DATABASE_URL` is set in web env vars

**Magic links not working in production:**
→ You'll need to implement real email sending (Phase 11+)
→ For now: check server logs for magic link URLs logged to console

---

## Estimated Monthly Cost (Soft Launch)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Railway Hobby ($5/mo plan recommended) | — | $5 |
| PostgreSQL (Railway) | 500MB free | $5/500MB |
| Redis (Railway) | 30MB free | $5/1GB |
| **Total soft launch** | **~$0** | **~$15/mo** |

**Supabase + Upstash** are good free-tier alternatives if Railway costs become an issue.
