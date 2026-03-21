# Current State

> Last updated: 2026-03-21

**Product Positioning:** Paper Check — Pre-submission paper checker for students

## What Has Been Built

### Phase 0: Project Control Layer ✅
- [x] Monorepo scaffold created
- [x] Project management files created
- [x] Docs folder with product-spec.md, technical-architecture.md, roadmap.md
- [x] Decisions.md with 8 architecture decisions

### Phase 1: Monorepo Foundation ✅
- [x] Repository structure created
- [x] npm workspaces + Turborepo configured
- [x] apps/web - Next.js 15 app with all MVP pages
- [x] apps/admin - Next.js 15 admin app scaffold
- [x] apps/worker - BullMQ background job processor scaffold
- [x] packages/db - Prisma schema and client with all entities
- [x] packages/shared - Types, constants, validation schemas
- [x] packages/analysis - Document parsers and heuristics (stubs)
- [x] packages/config - Shared TypeScript configs
- [x] infra/docker - Dockerfile and docker-compose.yml
- [x] infra/nginx - Nginx configuration
- [x] .env.example created
- [x] .gitignore created
- [x] README.md created

### Phase 2: Data Model ✅ (COMPLETE — not yet applied)
- [x] packages/db restructured into src/ layout
- [x] Prisma schema finalized with 15 models and 11 enums
- [x] docs/database-spec.md created
- [x] prisma/seed.ts placeholder created
- [x] package.json scripts updated
- [x] Schema NOT yet applied to a live database

### Phase 3: Auth + App Shell ✅
- [x] Magic link auth (JWT sessions, jose library)
- [x] Prisma schema: MagicLinkToken model added
- [x] Auth library: config, jwt, session, magic-link modules
- [x] API routes: login, signup, callback, logout, me
- [x] Next.js middleware: protected routes, auth redirects
- [x] Route groups: (public) and (app)
- [x] AppShell component with nav
- [x] Dashboard, documents, settings server-rendered with real DB data
- [x] AuthSecret generated and added to .env
- [x] jose dependency added to web package

### Phase 4: Document Ingestion ✅
- [x] Document creation page with paste/upload mode selector
- [x] Document detail page with version list
- [x] File upload flow with MIME type + size validation (.docx, .pdf, 10MB max)
- [x] Paste text flow storing content in DocumentVersion.content
- [x] Storage abstraction (local filesystem, swappable to S3)
- [x] Document/version API routes (POST, GET, PATCH)
- [x] Version creation API (handles both multipart upload + JSON paste)
- [x] Document status transitions to PROCESSING on version creation
- [x] Shared types synced with Prisma schema (UploadType enum)

### Phase 5: Analysis Job System ✅
- [x] BullMQ worker with Redis queue
- [x] Job lifecycle service (markStarted/Completed/Failed, progress tracking)
- [x] Worker HTTP server for web→worker communication (native Node.js, no Express)
- [x] Native HTTP enqueue endpoint (POST /enqueue)
- [x] Placeholder 4-step processing with realistic progress simulation
- [x] Exponential retry (2s, 4s, 8s), max 3 attempts
- [x] Queue helpers in web app (createAndEnqueueJob)
- [x] Prisma schema: added attempts + maxAttempts fields to AnalysisJob

### Phase 6: Document Parsing + Analysis V1 ✅
- [x] Real DOCX parsing with mammoth
- [x] Real PDF parsing with pdf-parse
- [x] Text normalization (unicode spaces, line endings, blank lines)
- [x] Citation extraction heuristics (URLs, DOIs, bracket, parenthetical, footnotes, bibliography)
- [x] Structured authorship signals building
- [x] Analysis pipeline: parse → normalize → extract citations → build signals
- [x] Worker job calls real analysis instead of placeholder
- [x] Analysis result stored in AnalysisJob.result (JSON)
- [x] TypeScript compilation successful for analysis package

### Phase 7: Receipt Generation ✅
- [x] Receipt assembly package (buildReceiptSummary, buildReceiptSections, assembleReceipt)
- [x] 8 receipt sections (overview, parsing, text-metrics, citations, sources, structural, confidence, processing)
- [x] Receipt persistence service (persistReceipt, getReceiptForVersion, getLatestReceiptForDocument)
- [x] Receipt page UI with confidence badge, warnings, notes, and disclaimer
- [x] Worker updated to assemble + persist receipt after analysis
- [x] Document detail page updated with processing status indicator

### Phase 8: Share Links + Educator Review ✅
- [x] Share link service (createShareLink, validateShareToken, revokeShareLink, getShareLinksForReceipt)
- [x] Educator review service (submitReview, getReviewsForReceipt)
- [x] Share link API routes (POST create, GET list, POST revoke, GET validate, POST review)
- [x] ShareSection client component with create/copy/revoke UI
- [x] Full shared receipt page (server component, public, no auth)
- [x] SubmitReviewForm client component for educator reviews
- [x] Prisma schema: SharedLink and EducatorReview models updated with proper relations

### Phase 9: PDF Export ✅
- [x] PDF template component (PdfReceiptDocument using @react-pdf/renderer)
- [x] PDF generation service (generateReceiptPdf, saveExportedPdf)
- [x] Export API route (POST /api/export/[receiptId])
- [x] Export history API route (GET /api/export/history)
- [x] ExportPdfButton client component on receipt page
- [x] Export record tracked in existing Export model
- [x] Owner-only access control via document ownership check

### Phase 11: Product Polish ✅
- [x] Analytics abstraction scaffold (trackEvent, trackPageView, AnalyticsEvent type)
- [x] Shared UI components (LoadingSpinner, LoadingSkeleton, EmptyState, ErrorState, PageLoader)
- [x] Complete rewrite of landing page (hero, how-it-works, what-is, caution, CTA, footer)
- [x] Complete rewrite of pricing page (clean tier card, feature grid)
- [x] Dashboard onboarding banner for 0-document users (👋 welcome card)
- [x] Documents list empty state replaced with EmptyState component
- [x] Analytics calls added: document_created, receipt_viewed, pdf_exported, share_link_created, educator_review_submitted
- [x] NEXT_PUBLIC_ANALYTICS_ENABLED env var added to .env.example

### Phase 12: Hardening ✅
- [x] Rate limiting (in-memory, IP-based, 6 endpoint-specific presets)
- [x] File security (size validation, MIME-to-extension matching, path traversal, safe filename)
- [x] Environment validation (Zod schema, fail-fast at startup)
- [x] Test setup (Vitest + tests for fileSecurity and rateLimit modules)
- [x] Production Dockerfiles (apps/web and apps/worker, node:20-alpine based)
- [x] docker-compose.yml updated (postgres, redis, worker, web, nginx, storage volume)
- [x] Nginx conf updated (health endpoints, clean upstream configs)
- [x] Health check endpoint (GET /api/health with PostgreSQL SELECT 1)
- [x] Worker structured JSON logger (replaces class-based Logger)
- [x] Route conflict fixed (removed duplicate app/documents/ directory)
- [x] docs/deployment.md and docs/security-hardening.md created

### Soft Launch Preparation ✅
- [x] Internal test plan (33 test cases across student/educator/admin/edge flows)
- [x] Soft launch checklist (env, security, deployment, monitoring, rollback)
- [x] Bug triage tracker (severity-ranked, empty template)
- [x] Feedback log (structured capture template)

---

## What Works

- Monorepo structure with npm workspaces and Turborepo
- TypeScript configured across all packages
- Next.js 15 apps scaffolded with App Router
- Tailwind CSS configured for web/admin apps
- Prisma schema with all core entities (16 models, 12 enums)
- Magic link authentication with JWT sessions (jose)
- Protected route middleware (public vs app route groups)
- Server-rendered dashboard, documents, settings with real DB data
- Document ingestion: upload (.docx/.pdf) + paste text
- Local filesystem storage abstraction (swappable to S3)
- BullMQ + Redis job queue with worker
- HTTP-based web→worker communication (native Node.js)
- Real document parsing (PDF via pdf-parse, DOCX via mammoth)
- Document text normalization and citation extraction heuristics
- Structured authorship signals generation
- Job retry with exponential backoff and capped attempts
- Docker + Nginx infrastructure configured
- Project memory system operational

---

## What Does Not Exist Yet

- No database migrations applied (schema defined but not deployed)
- No actual email sending (magic link logged to console in dev)
- No real authorship analysis beyond citation extraction and text metrics
- Admin tools are placeholders (Phase 10 not started)
- No educator dashboard for reviewing submitted receipts
- No organization/team account support
- No storage cleanup job (orphaned files accumulate)

---

## Current Architecture Snapshot

```
authorship-receipt/
├── apps/web (Next.js 15, Tailwind)
│   ├── app/(public)/ — landing, pricing, privacy, terms
│   ├── app/(app)/ — dashboard, documents, settings (auth-gated)
│   ├── app/(app)/documents/[documentId]/ — document detail + receipt page
│   ├── app/api/auth/ — login, signup, callback, logout, me
│   ├── app/api/documents/ — document CRUD, versions, enqueue
│   ├── app/auth/callback/
│   ├── src/lib/auth/ — config, jwt, session, magic-link
│   ├── src/lib/storage/ — local filesystem abstraction + fileSecurity
│   ├── src/middleware/rateLimit.ts — in-memory rate limiter + RATE_LIMITS presets
│   ├── src/lib/rateLimitRoute.ts — withRateLimit() API route wrapper
│   ├── src/lib/queue-helpers.ts — createAndEnqueueJob
│   ├── src/components/app/AppShell.tsx
│   └── src/middleware.ts
├── apps/admin (Next.js 15, Tailwind) - 6 pages (placeholder auth gate)
├── apps/worker (BullMQ, Redis)
│   ├── src/utils/ — env.ts, logger.ts
│   ├── src/queues/ — BullMQ analysisQueue
│   ├── src/services/ — jobLifecycleService, receiptService
│   ├── src/jobs/ — analyzeDocumentJob (analysis + receipt), exportReceiptJob
│   ├── src/routes/ — enqueue (HTTP endpoint)
│   └── src/http-server.ts — native Node.js HTTP server
├── packages/
│   ├── db/prisma/schema.prisma (16 models, 12 enums)
│   ├── shared (types, constants, zod validation)
│   ├── analysis (4 parsers, citation heuristics, signals, receipts)
│   └── config (tsconfig files + src/env.ts → dist/env.js)
├── infra/ — docker/, nginx/
├── docs/ (5 docs) + project-management/ (5 files)
```

---

## Day 1 Readiness Check

**Pre-testing verification (run before each session):**
```bash
# Health check
curl http://localhost:3000/api/health
# Expect: {"status":"ok",...}

# Worker health
curl http://localhost:3001/health
# Expect: {"status":"ok"}

# Check no recent failed jobs in worker output
```

**Must be running:**
- PostgreSQL on port 5432 (Docker or local)
- Redis on port 6379
- `npm run dev --workspace=apps/worker` (Tab 2, port 3001)
- `npm run dev --workspace=apps/web` (Tab 3, port 3000)

**Known working commit:** `572bde5` (build fix) + `636561e` (launch docs)

**If broken:** `git checkout 636561e && npm install`

**Test materials needed:**
- Sample PDF file (< 10MB)
- Sample DOCX file (< 10MB)
- `day1-test-sessions.md` — open during sessions
- `feedback-log.md` — open during sessions
- `bug-triage.md` — open during sessions

---

## Next Priority

**Founder Live Review** — Run one live founder review of the student flow from landing page to paper check result. Verify all copy feels natural, trustworthy, and student-friendly in a real browser.

See: [next-step.md](./next-step.md)
