# QA Report — 2026-03-20

## Summary

The monorepo has a solid foundation with well-structured code, but there are critical build failures that prevent deployment. The issues are primarily around:
1. **Web app build failure** — Next.js static generation fails due to PrismaClient initialization through workspace package imports
2. **Admin app build failure** — Expected DATABASE_URL missing during build (non-critical)
3. **TypeScript type mismatches** — Several fixed, some remain

Overall health: ⚠️ **WARNING** — Core flows are correctly implemented in code, but build infrastructure needs fixes before deployment.

---

## Flow Audit Results

### [Flow A] — Sign up / login flow
**Code Status:** ✅ PASS
**Issues:** None found in code paths.
**Files:**
- `apps/web/src/lib/auth/magic-link.ts` — token generation with randomBytes
- `apps/web/src/lib/auth/jwt.ts` — jose library for JWT, correct HS256
- `apps/web/src/lib/auth/session.ts` — requireUser/getCurrentUser correct
**Fix:** N/A

---

### [Flow B] — Create document flow
**Code Status:** ✅ PASS
**Issues:** None found.
**Files:**
- `apps/web/app/api/documents/route.ts` — POST handler validates with createDocumentSchema
**Fix:** N/A

---

### [Flow C] — Paste text flow
**Code Status:** ✅ PASS
**Issues:** None found. Auto-enqueue correctly triggered.
**Files:**
- `apps/web/app/api/documents/[documentId]/versions/route.ts`
- `apps/web/src/lib/queue-helpers.ts`
**Fix:** N/A

---

### [Flow D] — Upload DOCX/PDF flow
**Code Status:** ✅ PASS
**Issues:** None found. File security validators correctly used.
**Files:**
- `apps/web/app/api/documents/[documentId]/versions/route.ts` — MIME type and size validation
- `apps/web/src/lib/storage/fileSecurity.ts`
**Fix:** N/A

---

### [Flow E] — Analysis job runs
**Code Status:** ✅ PASS (after fix)
**Issues:** Fixed — `result?: unknown` not assignable to Prisma Json type.
**Files:**
- `apps/worker/src/services/jobLifecycleService.ts` — changed `unknown` to `object`
- `apps/worker/src/jobs/analyzeDocumentJob.ts`
**Fix:** Changed `result?: unknown` to `result?: object` in JobUpdate interface and updateJobProgress function.

---

### [Flow F] — Receipt generates
**Code Status:** ✅ PASS (after fix)
**Issues:** Fixed — `Record<string, unknown>` not assignable to Prisma Json. Also fixed missing `receipts` export in analysis package.
**Files:**
- `apps/worker/src/services/receiptService.ts` — used `Prisma.InputJsonValue` for proper casting
- `packages/analysis/index.ts` — added missing `export * from "./src/receipts/index.js"`
**Fix:** 
1. Added receipts export to root `packages/analysis/index.ts`
2. Changed casts to use `Prisma.InputJsonValue`

---

### [Flow G] — Receipt page renders
**Code Status:** ✅ PASS (after fix)
**Issues:** Fixed — Prisma relation field was `authorshipReceipt` not `authorshipReceipts`.
**Files:**
- `apps/web/app/(app)/documents/[documentId]/receipt/page.tsx`
**Fix:** Changed `authorshipReceipts` to `authorshipReceipt` in Prisma include and access.

---

### [Flow H] — Share link creates
**Code Status:** ✅ PASS
**Issues:** None found. Token uses randomBytes(32).
**Files:**
- `apps/web/src/lib/shareService.ts`
**Fix:** N/A

---

### [Flow I] — Share link opens
**Code Status:** ✅ PASS (after fix)
**Issues:** Fixed — TypeScript narrowing issue where `link` could be undefined after validity check.
**Files:**
- `apps/web/app/share/[token]/page.tsx`
- `apps/web/src/app/api/share/[token]/route.ts`
**Fix:** Added explicit `if (!link) return notFound()` checks.

---

### [Flow J] — Educator review submits
**Code Status:** ✅ PASS
**Issues:** None found.
**Files:**
- `apps/web/src/lib/reviewService.ts`
- `apps/web/src/app/api/share/review/route.ts`
**Fix:** N/A

---

### [Flow K] — PDF export works
**Code Status:** ✅ PASS
**Issues:** None found. Ownership verified before generating.
**Files:**
- `apps/web/app/api/export/[receiptId]/route.ts`
**Fix:** N/A

---

### [Flow L] — Admin login works
**Code Status:** ✅ PASS
**Issues:** None found. Middleware protects all paths correctly.
**Files:**
- `apps/admin/src/middleware.ts` — correct public path list
- `apps/admin/app/api/admin/login/route.ts`
**Fix:** N/A

---

### [Flow M] — Admin pages load
**Code Status:** ✅ PASS
**Issues:** None found. Query functions use correct Prisma includes/selects.
**Files:**
- `apps/admin/src/lib/adminQueries.ts`
**Fix:** N/A

---

## Critical Issues (Must Fix Before Deployment)

### 1. Web app build failure — PrismaClient module resolution
**Severity:** 🔴 CRITICAL
**Issue:** Next.js static generation fails with `PrismaClient is not a constructor` when building the web app. This happens because:
- The web app uses TypeScript path aliases pointing to workspace package source files (`../../packages/db/src/index.ts`)
- When Next.js bundles these imports, the `PrismaClient` class from `@prisma/client` is not properly resolved through the re-export chain
- Pages that import services which instantiate `PrismaClient` at module level fail during static generation

**Workaround:** 
- The `dynamic = 'force-dynamic'` export was added to the share page but doesn't resolve the underlying issue
- Need to restructure how workspace packages are consumed OR accept that web app cannot be fully statically generated

**Files Involved:**
- `apps/web/tsconfig.json` — path aliases
- `packages/db/src/index.ts` — exports from `./client` (which imports @prisma/client)
- `apps/web/app/share/[token]/page.tsx` — imports shareService which creates PrismaClient at module level

**Recommended Fix:** 
Option A: Change workspace package consumption to use compiled dist output instead of TypeScript sources
Option B: Lazy-load PrismaClient in service files (initialize on first use, not at module level)
Option C: Accept web app requires a Node.js runtime (not fully static)

---

### 2. Admin app prerender failure (DATABASE_URL missing)
**Severity:** 🟡 MODERATE (expected during CI/CD without test database)
**Issue:** During `next build`, Next.js attempts to prerender admin pages which query the database. Without DATABASE_URL, PrismaClient initialization fails.
**Files Involved:**
- `apps/admin/app/users/page.tsx` and other admin pages
**Recommended Fix:** 
- Ensure DATABASE_URL is set in build environment, OR
- Mark all admin pages as `export const dynamic = 'force-dynamic'` to skip prerendering

---

### 3. Duplicate lockfile warning
**Severity:** 🟢 LOW
**Issue:** Next.js warns about multiple lockfiles (`/Users/hexbornestudio/package-lock.json` and `/Users/hexbornestudio/authorship-receipt/package-lock.json`)
**Files Involved:**
- Root workspace at `/Users/hexbornestudio/`
**Recommended Fix:** Remove the outer package-lock.json or configure `outputFileTracingRoot` in Next.js config

---

## Non-Critical Issues

1. **Vitest config included in Next.js build** — `vitest.config.ts` was being type-checked by Next.js. Fixed by excluding from tsconfig.
2. **Extension handling in re-exports** — `auth/index.ts` and `storage/index.ts` used `.ts` extensions which don't work with `isolatedModules`. Fixed by removing extensions (TypeScript resolves without extension).

---

## Unverifiable (Need Runtime Verification)

1. **Full end-to-end flow** — Cannot test without running database, Redis, and all services
2. **Magic link email delivery** — Email sending is logged to console in dev, cannot verify actual email delivery
3. **Worker job processing** — Requires BullMQ + Redis running
4. **PDF generation** — Requires actual receipt data
5. **Admin authentication** — Requires ADMIN_SECRET environment variable
6. **Rate limiting** — Requires Redis running

---

## Fixes Applied During This Sprint

1. `packages/analysis/index.ts` — Added missing receipts export
2. `apps/web/src/lib/auth/index.ts` — Removed `.ts` extension from re-exports
3. `apps/web/src/lib/storage/index.ts` — Removed `.ts` extension
4. `apps/worker/src/services/jobLifecycleService.ts` — Changed `unknown` to `object` for Prisma Json
5. `apps/worker/src/services/receiptService.ts` — Used `Prisma.InputJsonValue` for proper casting
6. `apps/worker/src/http-server.ts` — Fixed void return type for res.end()
7. `apps/web/app/(app)/documents/[documentId]/receipt/page.tsx` — Fixed `authorshipReceipts` to `authorshipReceipt`
8. `apps/web/app/api/export/history/route.ts` — Removed non-existent `completedAt` field
9. `apps/web/app/share/[token]/page.tsx` — Added TypeScript narrowing fix for link
10. `apps/web/src/app/api/share/[token]/route.ts` — Added TypeScript narrowing fix
11. `packages/db/src/index.ts` — Changed export path (no extension)
12. `apps/web/tsconfig.json` — Added path aliases for `@authorship-receipt/db`
13. `apps/admin/tsconfig.json` — Added path aliases for `@authorship-receipt/db`
14. `apps/web/tsconfig.json` — Excluded `vitest.config.ts`
