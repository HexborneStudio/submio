# Day 1 Runbook — Internal Testing Setup

**Date:** 2026-03-20
**Purpose:** Everything to set up before Day 1 internal testing begins

---

## 1. VERIFY APPS ARE READY

### Run this to confirm everything builds
```bash
cd ~/authorship-receipt

# Verify build
npm run build --workspace=apps/worker
npm run build --workspace=apps/web
npm run build --workspace=apps/admin
```

### If build fails, check last known working commit:
```bash
git log --oneline -5
# If broken: git checkout 572bde5 && npm install
```

---

## 2. START ALL SERVICES

Open **4 terminal tabs** or use a terminal multiplexer.

### Tab 1 — PostgreSQL + Redis
```bash
# Option A: Docker (recommended)
docker run -d --name authorship-postgres \
  -e POSTGRES_DB=authorship_receipt \
  -e POSTGRES_USER=dev \
  -e POSTGRES_PASSWORD=devpassword \
  -p 5432:5432 \
  postgres:16-alpine

docker run -d --name authorship-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Tab 2 — Worker
```bash
cd ~/authorship-receipt
npm run dev --workspace=apps/worker
# Should say: Worker HTTP server on port 3001
# Should say: Connected to Redis
```

### Tab 3 — Web App
```bash
cd ~/authorship-receipt
npm run dev --workspace=apps/web
# Should say: Ready on http://localhost:3000
```

### Tab 4 — Admin (optional for Day 1)
```bash
cd ~/authorship-receipt
npm run dev --workspace=apps/admin
# Should say: Ready on http://localhost:3002
```

---

## 3. DATABASE SETUP

### Apply schema (only if database is fresh)
```bash
cd ~/authorship-receipt
npm run db:push --workspace=packages/db
npm run db:generate --workspace=packages/db
```

### Verify DB is working
```bash
# Check if web app responds
curl http://localhost:3000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## 4. PREPARE TEST MATERIALS

### Test accounts to create during sessions
Do NOT pre-create — testers will sign up themselves. Just ensure:
- [ ] Email accessible or magic link visible in console
- [ ] You can see the console output for magic links

### Sample files to have ready on desktop
- [ ] `sample-paper.pdf` — a real PDF paper (create or find)
- [ ] `sample-paper.docx` — a real DOCX paper (create or find)
- [ ] Both under 10MB

To create test files: open Google Docs/Word, write 3 paragraphs, export as PDF and DOCX.

### Links to open before testers arrive
- [ ] http://localhost:3000 — landing page
- [ ] http://localhost:3000/login — login page
- [ ] http://localhost:3000/dashboard — should redirect to login if not signed in

---

## 5. ADMIN SECRET

Know your admin secret before testing:
```bash
echo $ADMIN_SECRET
# If not set, set it:
# echo "ADMIN_SECRET=my-secret-123" >> ~/.authorship-receipt.env
# source ~/.authorship-receipt.env
```

---

## 6. OBSERVER SETUP

### Before Tester A arrives
- [ ] `day1-test-sessions.md` open
- [ ] `feedback-log.md` open
- [ ] `bug-triage.md` open
- [ ] Terminal with worker logs visible (Tab 2)
- [ ] Timer running

### What to say to Tester A
> "We're testing a new academic tool. I want you to try creating a document receipt. Don't worry if you get confused or stuck — that's the point. I'll only help if you're completely blocked. Go to http://localhost:3000 and try to get to the part where you can see an authorship receipt for a document."

### What to say to Tester B
> Same as Tester A, but ask them to use the upload method (PDF or Word file) instead of pasting.

---

## 7. DURING THE SESSION

### What to record in real time
- [ ] Exact moment they hesitate (watch their face/mouse)
- [ ] Exact words they say unprompted
- [ ] Which step they got stuck on
- [ ] How long the receipt took to generate (watch worker logs)

### Worker log things to watch for
```
[BullMQ] Job completed — check this means receipt generated
[BullMQ] Job failed — note the error
```

### Timer
- Start timer when tester opens the landing page
- Stop timer when they have a PDF exported or give up
- Record: ___ minutes elapsed

---

## 8. IMMEDIATELY AFTER EACH SESSION (within 15 min)

### 1. Fill feedback-log.md
Open `feedback-log.md` and add one entry per observation.

### 2. Fill bug-triage.md
If you observed a bug (something broke or blocked them), add it to bug-triage.md immediately.

### 3. Check worker logs
```bash
# Look for any errors in the worker output
```

### 4. Reset for next tester
- [ ] Sign out of the test account (or use incognito)
- [ ] Clear browser cache if needed
- [ ] Reset worker job state if needed

---

## 9. QUICK SYSTEM HEALTH CHECK (run before each session)

```bash
# 1. Health endpoint
curl http://localhost:3000/api/health
# Expect: {"status":"ok",...}

# 2. Worker is running
curl http://localhost:3001/health
# Expect: {"status":"ok"}

# 3. Redis connected (check worker logs in Tab 2)

# 4. No recent failed jobs
# Check worker log for: [BullMQ] Job failed
```

---

## 10. COMMON ISSUES AND QUICK FIXES

### "Connection refused" on localhost:3000
→ Web app not started. Run: `npm run dev --workspace=apps/web`

### "Magic link not working"
→ In dev mode, magic link is printed in the worker terminal. Check Tab 2 logs.

### Receipt never生成 (stays PROCESSING)
→ Worker may be disconnected from Redis. Restart Tab 2:
```bash
# Ctrl+C Tab 2, then:
npm run dev --workspace=apps/worker
```

### Build fails
→ Roll back to last known good:
```bash
git checkout 572bde5
npm install
npm run build --workspace=apps/worker
npm run build --workspace=apps/web
```

---

## 11. END OF DAY 1

### Before leaving
- [ ] All feedback logged in `feedback-log.md`
- [ ] All bugs logged in `bug-triage.md`
- [ ] `day1-test-sessions.md` filled out completely
- [ ] Patterns identified for Day 2

### Commit Day 1 results
```bash
cd ~/authorship-receipt
git add -A && git commit -m "chore: Day 1 internal test feedback"
```

---

## QUICK REFERENCE CARD (print this)

```
DAY 1 SETUP CHECKLIST
=====================
□ Postgres Docker running (port 5432)
□ Redis Docker running (port 6379)
□ Worker running (Tab 2, port 3001)
□ Web app running (Tab 3, port 3000)
□ Admin running (Tab 4, port 3002)
□ Health check: curl localhost:3000/api/health
□ Sample PDF and DOCX ready on desktop
□ feedback-log.md open
□ bug-triage.md open
□ day1-test-sessions.md open
□ Timer ready

STOPPED? QUICK FIXES
=====================
Worker down → npm run dev --workspace=apps/worker
Web down → npm run dev --workspace=apps/web
Redis down → docker restart authorship-redis
DB down → docker restart authorship-postgres
```
