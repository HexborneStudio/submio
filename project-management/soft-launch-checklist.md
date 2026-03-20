# Soft Launch Checklist — Authorship Receipt MVP

**Launch Date:** TBD
**Environment:** Production/staging target
**Owner:** DeAngelo

---

## Pre-Launch: Environment Setup

### Infrastructure
- [ ] PostgreSQL 16+ database provisioned
- [ ] Redis 7+ instance provisioned (or Docker available)
- [ ] Server/VPS with 2GB+ RAM, Node.js 20+
- [ ] Domain/subdomain pointed to server (if applicable)
- [ ] Docker Engine installed on server
- [ ] Docker Compose available

### Environment Variables — Required
- [ ] `DATABASE_URL` — PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/authorship_receipt`)
- [ ] `AUTH_SECRET` — JWT signing key (generate: `openssl rand -hex 32`)
- [ ] `ADMIN_SECRET` — Admin access secret (min 8 chars, generate: `openssl rand -base64 24`)
- [ ] `REDIS_HOST` and `REDIS_PORT` OR `REDIS_URL`
- [ ] `NODE_ENV=production`

### Environment Variables — Optional
- [ ] `STORAGE_LOCAL_DIR` — custom storage path
- [ ] `WORKER_URL` — if worker on separate host
- [ ] `NEXT_PUBLIC_ANALYTICS_ENABLED` — enable analytics

### Build Verification
- [ ] `npm run db:generate --workspace=packages/db` succeeds
- [ ] `npm run build --workspace=apps/worker` succeeds
- [ ] `npm run build --workspace=apps/web` succeeds
- [ ] `npm run build --workspace=apps/admin` succeeds

---

## Pre-Launch: Database & Storage

- [ ] `docker-compose up -d postgres redis` (or equivalent)
- [ ] `npm run db:push --workspace=packages/db` — apply schema
- [ ] `npm run db:generate --workspace=packages/db` — generate Prisma client
- [ ] Storage directory created and writable by app user
- [ ] `/exports` directory created and writable

---

## Pre-Launch: Security

- [ ] `ADMIN_SECRET` changed from any default/dev value
- [ ] `AUTH_SECRET` is 32+ characters, randomly generated
- [ ] `DATABASE_URL` password is strong and not committed to git
- [ ] `NODE_ENV=production` set in deployment environment
- [ ] CORS configured appropriately (if cross-origin needed)
- [ ] Rate limiting confirmed active
- [ ] File upload validation confirmed active
- [ ] No `console.log` debug output in production code paths
- [ ] No `.env` file committed to repository
- [ ] `.env.example` reflects actual required variables

---

## Pre-Launch: Deployment

### Docker Deployment
- [ ] `docker-compose.yml` reviewed and environment variables set
- [ ] `docker-compose up -d` succeeds
- [ ] All containers running: `docker ps`
- [ ] Web app responds on configured port
- [ ] Worker starts and connects to Redis
- [ ] Admin app accessible

### Nginx
- [ ] Nginx config created for reverse proxy
- [ ] TLS/SSL configured (Let's Encrypt or purchased cert)
- [ ] `/health` endpoint responds
- [ ] `/worker/health` endpoint responds
- [ ] Websocket support enabled (for Next.js if needed)

### DNS
- [ ] Domain resolves to server
- [ ] HTTPS certificate valid and auto-renewing

---

## Pre-Launch: Monitoring

- [ ] Health endpoint `/api/health` returns 200
- [ ] Worker health endpoint accessible
- [ ] Redis connectivity confirmed
- [ ] PostgreSQL connectivity confirmed
- [ ] Disk space adequate (storage + exports)
- [ ] Memory/CPU usage within bounds

### Logging
- [ ] Structured logs writing to stdout (for Docker log collection)
- [ ] Error logs visible in `docker-compose logs worker`
- [ ] Failed job errors captured and readable

### Alerts (Nice-to-Have)
- [ ] Alert if web app goes down
- [ ] Alert if worker stops processing
- [ ] Alert if disk space low

---

## Pre-Launch: Backup & Rollback

- [ ] Database backup procedure documented
- [ ] `pg_dump` tested and backups working
- [ ] Backup schedule: daily minimum
- [ ] Rollback procedure documented (schema rollback + code rollback)
- [ ] `docker-compose down && git checkout <prev-tag> && docker-compose up -d` tested as rollback

---

## Launch Day

### 1 Hour Before
- [ ] All pre-launch checks complete
- [ ] Team/testers on standby
- [ ] Communication channel open (Slack, Discord, etc.)

### At Launch
- [ ] Announce to testers
- [ ] Monitor dashboard (admin overview)
- [ ] Monitor worker logs: `docker-compose logs -f worker`
- [ ] Monitor web logs: `docker-compose logs -f web`

### Immediate Post-Launch (First Hour)
- [ ] No crashes in web or worker logs
- [ ] Health endpoint still 200
- [ ] Test sign-up flow manually
- [ ] Monitor error channels

### Post-Launch (First 24 Hours)
- [ ] Check in at: 1hr, 4hr, 12hr, 24hr
- [ ] Monitor failed job count in admin
- [ ] Collect feedback from testers
- [ ] Address any blockers immediately

---

## Launch Criteria Gates

Before any launch event, all items below must be ✅:

| Gate | Description | Status |
|------|-------------|---------|
| G1 | All HIGH severity tests pass in internal test plan | |
| G2 | Admin can log in and see data | |
| G3 | Web app builds successfully | |
| G4 | Docker deployment verified | |
| G5 | No unhandled exceptions in worker logs | |
| G6 | Health endpoint returns 200 | |
| G7 | Rate limiting confirmed active | |
| G8 | File upload validation confirmed active | |

---

## Rollback Procedure

If critical issue found during launch:

```bash
# Option 1: Docker rollback
docker-compose down
git checkout <previous-stable-commit>
docker-compose up -d

# Option 2: Database rollback (if schema changed)
docker-compose exec postgres psql -U dev -d authorship_receipt -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:push --workspace=packages/db
```

---

## Contacts

| Role | Name | Contact |
|------|------|---------|
| Tech lead | | |
| On-call | | |
| Database admin | | |
