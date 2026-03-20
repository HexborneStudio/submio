# Next Step

> Exactly one next recommended task

---

## TASK: Phase 10 - Admin Tools

**Objective:** Build admin dashboard with user/receipt lookup, job inspection, audit logs, and support views.

**Dependencies:**
- Phase 9 PDF export (current phase)

**Expected Files to Change:**
- `apps/admin/app/page.tsx` — Admin dashboard home
- `apps/admin/app/users/page.tsx` — User lookup
- `apps/admin/app/receipts/page.tsx` — Receipt lookup
- `apps/admin/app/jobs/page.tsx` — Job inspection
- `apps/admin/app/logs/page.tsx` — Audit log viewer
- `apps/admin/app/support/page.tsx` — Support ticket view
- `packages/db/prisma/schema.prisma` — Admin role check on User

**Steps:**
1. Build admin middleware gate (requireAdmin from session)
2. Create user lookup with document/receipt counts
3. Create receipt lookup by ID or document
4. Build job inspection view (status, progress, attempts)
5. Create audit log viewer
6. Build support logs view

**Completion Criteria:**
- Admin can view all users and their documents
- Admin can inspect any receipt by ID
- Admin can view job queue status
- Admin can view audit logs
- Non-admin users cannot access admin routes

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. ~~Phase 4: Document Ingestion~~ ✅ DONE
4. ~~Phase 5: Analysis Job System~~ ✅ DONE
5. ~~Phase 6: Document Parsing + Analysis V1~~ ✅ DONE
6. ~~Phase 7: Receipt Generation~~ ✅ DONE
7. ~~Phase 8: Share + Educator Review~~ ✅ DONE
8. ~~Phase 9: PDF Export~~ ✅ DONE
9. Phase 10: Admin Tools (current)
10. Phase 11: Product Polish
11. Phase 12: Hardening

---

## To Run the Worker

```bash
# 1. Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# 2. Apply schema (Phases 2-5)
npm run db:push --workspace=packages/db
npm run db:generate --workspace=packages/db

# 3. Install all deps
npm install

# 4. Start worker (terminal 1)
npm run dev --workspace=apps/worker

# 5. Start web (terminal 2)
npm run dev --workspace=apps/web
```
