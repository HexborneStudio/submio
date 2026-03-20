# Current State

> Last updated: 2026-03-19

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
- No receipt generation (Phase 7) ✅ DONE
- No share link generation with tokens (Phase 8)
- No PDF export (Phase 9)
- No admin functionality (placeholders only)

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
│   ├── src/lib/storage/ — local filesystem abstraction
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
│   └── config (3 tsconfig files)
├── infra/ — docker/, nginx/
├── docs/ (5 docs) + project-management/ (5 files)
```

---

## Next Priority

**Phase 6: Document Parsing + Analysis V1** — Real PDF/DOCX parsing and authorship heuristics.

See: [next-step.md](./next-step.md)
