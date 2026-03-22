# Soft Launch Plan — Authorship Receipt MVP

**Status:** Ready to proceed
**Date:** 2026-03-22
**Product:** Authorship Receipt — paper check tool for students

---

## Deploy Target

**Current:** Local Mac Mini (dev environment only)
**Recommended for soft launch:** Deploy to a reliable cloud host with PostgreSQL + Redis

**Minimum viable production stack:**
- Web app: Node.js 18+ with Next.js 15
- Worker: Node.js 18+ with BullMQ + Redis
- Database: PostgreSQL 15+ (Neon, Supabase, or Railway recommended for soft launch)
- Cache/Queue: Redis (Upstash or Railway)
- Storage: Local disk or S3-compatible (for file uploads if Phase 4 implemented)

**Deploy options ranked by simplicity for soft launch:**
1. **Railway** — easiest; Postgres + Redis + Node.js deployment from GitHub
2. **Render** — free tier available; good for Next.js
3. **Fly.io** — good for long-running worker + web app
4. **DigitalOcean App Platform** — simple, predictable pricing
5. **Vercel** — easiest for Next.js but worker/BullMQ needs separate service

---

## Required Environment Variables

### Web App (`apps/web`)
```
DATABASE_URL=postgresql://user:pass@host:5432/authorship_receipt
REDIS_URL=redis://host:6379
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.com
APP_URL=https://your-domain.com
```

### Worker (`apps/worker`)
```
DATABASE_URL=postgresql://user:pass@host:5432/authorship_receipt
REDIS_HOST=host
REDIS_PORT=6379
ADMIN_SECRET=<random secret for admin routes>
WORKER_PORT=3001
```

### Optional
```
EMAIL_FROM=noreply@your-domain.com    # For magic link emails
EMAIL_PROVIDER=resend                  # Or: smtp, sendgrid
RESEND_API_KEY=                        # If using Resend
```

---

## Launch Checklist

### 1 Week Before Deploy
- [ ] Choose and set up cloud provider (Railway recommended)
- [ ] Provision PostgreSQL database
- [ ] Provision Redis instance
- [ ] Configure environment variables on hosting platform
- [ ] Set up custom domain (e.g., `papercheck.app` or subdomain of existing domain)
- [ ] Enable HTTPS/TLS
- [ ] Point DNS to production host

### 3 Days Before Deploy
- [ ] Run `npm run build` for both `apps/web` and `apps/worker` — verify clean builds
- [ ] Create production database schema: `npx prisma migrate deploy`
- [ ] Verify Redis connection
- [ ] Set up monitoring: Uptime robot or similar (free)
- [ ] Set up error tracking: Sentry (free tier)

### 1 Day Before Deploy
- [ ] Deploy worker service first — verify health endpoint responds
- [ ] Deploy web app — verify homepage loads
- [ ] Test magic link sign-in with a real email
- [ ] Run one full paper check end-to-end in production
- [ ] Test share link creation and review submission
- [ ] Verify PDF export works

### Launch Day
- [ ] Set `APP_URL` and `NEXTAUTH_URL` to production domain
- [ ] Monitor error logs for first hour
- [ ] Monitor database connection pool
- [ ] Monitor BullMQ job queue — verify jobs complete without errors
- [ ] Smoke test: sign in → create paper → check receipt → share → review

### Post-Launch (Days 1-7)
- [ ] Monitor daily: error rate, job queue depth, database size
- [ ] Check for: failed analysis jobs, stuck sessions, Redis memory
- [ ] Collect first user feedback
- [ ] Fix any issues found in real usage

---

## Manual Smoke Test (Post-Deploy)

Run this manually after every deploy:

```
1. Open app URL in browser → verify homepage loads
2. Sign in with test email → magic link arrives → click link → logged in
3. Click "New Paper Check" → paste 200+ words with fake citations
4. Submit → wait 10 seconds → summary page appears
5. Click "Detailed Report" → verify sections visible (Citation, Confidence, Technical Details)
6. Click "Share with Instructor" → "Create & Copy Link" → token returned
7. Open share URL → receipt visible → fill review form → submit
8. Review appears below receipt
9. Click "Export PDF" → download triggered
10. Go to Dashboard → paper appears in list
```

---

## First-User Feedback Capture

**Process:**
1. Invite 2-5 trusted early users (students or instructors you know)
2. Send them the app URL + a brief description of what to test
3. Ask them to run through the smoke test above
4. Collect feedback via:
   - Simple Google Form (link: what worked, what confused you, what broke)
   - Or: direct Telegram message
5. Triage feedback within 48 hours

**Feedback form questions (minimum):**
- Did the sign-in process work?
- Did the summary page make sense?
- Was the detailed report easy to understand?
- Did the share/review feature work for your instructor?
- What was confusing?
- What would you change?

---

## Rollback Plan

If the deploy causes issues:

1. **Immediate (< 1 hour):** Revert to previous deployment on hosting platform (most platforms have one-click rollback)
2. **Database:** If schema changed, run `prisma migrate resolve --rolled back` to mark the migration as rolled back
3. **Redis:** Clear job queue if jobs are stuck: `redis-cli FLUSHDB` (warning: loses pending jobs)
4. **Communication:** Post status update to wherever users will see it
5. **Diagnosis:** Check worker logs, web logs, PostgreSQL query performance

**Rollback triggers:**
- Error rate > 5% in first hour
- Analysis jobs consistently failing
- Users unable to sign in
- Database connection errors

---

## First 7 Days Watchlist

| Metric | Check | Alert Threshold |
|--------|-------|----------------|
| Error rate | Sentry / hosting dashboard | > 2% of requests |
| Analysis job failures | BullMQ dashboard | > 10% jobs failing |
| Session auth failures | Web server logs | > 5% of auth attempts |
| Database size | PostgreSQL dashboard | Growing > 1GB/day |
| Redis memory | Redis dashboard | Approaching plan limit |
| Sign-up rate | Database User count | Zero new users (growth check) |
| Share link usage | sharedLink table count | Zero links created (feature adoption) |

---

## What's NOT Included in Soft Launch

These are Phase 10+ features — not needed for initial launch:

- Email sending (magic links still logged to console in dev; production email needs Resend/SendGrid)
- Admin dashboard (placeholder only)
- Real-time analysis progress updates (jobs run async, user polls)
- Organization/team accounts
- Instructor dashboard for reviewing submitted receipts
- Bulk analysis
- API rate limiting
- File upload beyond local disk
