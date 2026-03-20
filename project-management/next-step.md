# Next Step

> Exactly one next recommended task

---

## TASK: Phase 3 - Auth + App Shell

**Objective:** Implement magic-link authentication and build the protected app shell with dashboard navigation.

**Dependencies:**
- Phase 2 schema applied to database (can work in parallel — schema is stable)
- Database must be accessible (local Postgres or Docker)

**Expected Files to Change:**
- `apps/web/app/login/page.tsx` — Magic link form
- `apps/web/app/signup/page.tsx` — Signup form
- `apps/web/app/api/auth/` — Auth API routes (magic link)
- `apps/web/src/middleware.ts` — Route protection
- `apps/web/src/components/` — Auth components (session provider, etc.)
- `packages/db/` — User model already defined, just needs API routes
- `apps/web/app/dashboard/page.tsx` — Update with real data
- `apps/admin/app/layout.tsx` — Add admin auth gate

**Steps:**
1. Install auth dependencies (e.g., `next-auth` or custom magic link implementation)
2. Create auth API routes for magic link login/signup
3. Implement email sending (use a mock/log transport in MVP)
4. Add session management (JWT or database sessions)
5. Create auth middleware for protected routes
6. Update dashboard with real document list from database
7. Add user menu / sign-out to navigation
8. Gate admin routes to ADMIN role

**Completion Criteria:**
- User can sign up and receive a magic link
- User can log in via magic link
- Dashboard shows user's actual documents
- Protected routes redirect unauthenticated users
- Admin routes protected by role check

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. Phase 3: Auth + App Shell (current)
3. Phase 4: Document Ingestion — Create document, upload, paste flows
4. Phase 5: Analysis Job System — Redis queue setup
5. Phase 6: Document Parsing + Analysis V1 — Implement parsers
6. Phase 7: Receipt Generation — Build receipt UI and logic

---

## After Phase 3 — Database Setup Reminder

After Phase 2 schema is applied, run these commands:

```bash
# Apply schema to database (no migration history)
npm run db:push --workspace=packages/db

# Generate Prisma client
npm run db:generate --workspace=packages/db

# Verify with Prisma Studio
npm run db:studio --workspace=packages/db
```
