# Architecture Decisions

> Record all significant decisions with rationale

---

## 2026-03-19

### DEC-001: Monorepo Structure with Turborepo

**Decision:** Use npm workspaces with Turborepo for the monorepo structure.

**Rationale:**
- Simpler setup than pnpm or yarn workspaces
- Turborepo provides excellent build caching and orchestration
- Native npm support reduces tooling dependencies
- All team members likely have npm available

**Alternatives Considered:**
- pnpm workspaces - More modern but less familiar
- yarn workspaces - Solid but npm is sufficient
- Lerna - Older approach, less active development

**Status:** Accepted

---

### DEC-002: Next.js 15 for Web and Admin Apps

**Decision:** Use Next.js 15 as the framework for both web and admin applications.

**Rationale:**
- Server components provide excellent performance
- Built-in routing, API routes, and middleware
- Strong TypeScript support
- Large ecosystem of libraries
- App Router provides modern patterns

**Alternatives Considered:**
- Remix - Good but Next.js has broader adoption
- Vite + React - More manual setup needed
- Express + templates - Less modern

**Status:** Accepted

---

### DEC-003: PostgreSQL with Prisma ORM

**Decision:** Use PostgreSQL as the database with Prisma as the ORM.

**Rationale:**
- PostgreSQL is robust, well-supported, and scales well
- Prisma provides excellent TypeScript integration
- Great migration tooling
- Type-safe queries
- Works well with Docker

**Alternatives Considered:**
- MongoDB - Less structured, harder to enforce relations
- MySQL - PostgreSQL has better JSON support
- PlanetScale - Serverless adds complexity

**Status:** Accepted

---

### DEC-004: BullMQ + Redis for Job Queue

**Decision:** Use BullMQ with Redis for background job processing.

**Rationale:**
- Mature and well-tested
- Great TypeScript support
- Persistent job storage
- Retry logic built-in
- Redis is lightweight and fast

**Alternatives Considered:**
- SQS + Lambda - More ops complexity
- In-memory queue - No persistence
- pg-boss - Good but BullMQ more feature-rich

**Status:** Accepted

---

### DEC-005: Document Parsing Provider-Agnostic

**Decision:** Build modular document parsing with provider-agnostic integration.

**Rationale:**
- Document parsing libraries change frequently
- Need flexibility to swap implementations
- Separate parsing from analysis allows testing
- Clear interfaces between modules

**Alternatives Considered:**
- Single library integration - Too coupled
- External service - Adds latency and cost

**Status:** Accepted

---

### DEC-006: Magic Link Auth (No Passwords)

**Decision:** Use magic link / email authentication, no passwords.

**Rationale:**
- Better UX for occasional users (students)
- No password storage/reset complexity
- Lower security surface area
- Works well with email-first use case

**Alternatives Considered:**
- OAuth providers - Adds dependency, complexity
- Passwords + 2FA - More friction for students
- Auth0/Clerk - Adds third-party dependency

**Status:** Accepted (implementation pending)

---

### DEC-007: Evidence-Based Receipts (Not Definitive)

**Decision:** Present all analysis results as indicators, evidence, and summaries — never as definitive judgments.

**Rationale:**
- Academic integrity is paramount
- Our tools cannot definitively determine authorship
- Legal protection
- Builds trust with educators
- Ethical responsibility

**Alternatives Considered:**
- "Definite" claims - Misleading and irresponsible
- No analysis - Reduces product value

**Status:** Accepted (core principle)

---

### DEC-008: Docker + Nginx for Infrastructure

**Decision:** Use Docker containers with Nginx reverse proxy.

**Rationale:**
- Consistent development and production
- Easy local development with docker-compose
- Nginx provides security, caching, SSL termination
- Standard industry practice

**Alternatives Considered:**
- Vercel/Netlify - Good but less control
- AWS ECS - More complex
- Kubernetes - Overkill for MVP

**Status:** Accepted

---

## Superseded Decisions

None yet.

---

## 2026-03-20 (Phase 6)

### DEC-024: Heuristic-Only Citation Extraction

**Decision:** Citation extraction uses regex patterns and heuristics only — it does NOT definitively identify or verify citations.

**Rationale:**
- True citation verification requires academic database lookups (CrossRef, Google Scholar, etc.)
- MVP scope is evidence presentation, not authoritative citation checking
- Heuristics detect patterns (URLs, DOIs, bracket numbers, author-year formats) reliably
- Warnings are surfaced when citation details cannot be parsed
- All results are labeled as indicators, not definitive findings

**Alternatives Considered:**
- CrossRef/Google Scholar API integration — Adds latency, cost, external dependency
- Citation parsing libraries — Still require heuristic fallback for non-standard formats

**Status:** Accepted

---

### DEC-025: File Protocol for Workspace Dependencies

**Decision:** Use `file:` protocol instead of `workspace:` protocol for local package dependencies in package.json.

**Rationale:**
- `workspace:*` protocol has inconsistent npm support across npm 10.x versions
- `file:../relative/path` works reliably with both npm and TypeScript module resolution
- Combined with tsconfig `paths` mapping, TypeScript compiles cleanly
- Trade-off: less elegant than `workspace:*`, but more reliable in this environment

**Alternatives Considered:**
- pnpm workspaces — Would resolve the protocol issue but adds new package manager
- TypeScript project references — More correct but significantly more setup

**Status:** Accepted (environment-specific workaround)

---

### DEC-026: Analysis Package Separate from Shared Types

**Decision:** The `packages/analysis` package has its own `src/types.ts` with analysis-specific types rather than importing all types from `packages/shared`.

**Rationale:**
- `AuthorshipSignals`, `AnalysisResult`, `CitationAnalysisResult` are analysis-internal concepts
- Keeping them in the analysis package maintains encapsulation
- Shared package contains only cross-cutting types (User, Document, etc.)
- Parser interfaces (`ParsedDocument`) live in `parsers/documentParser.ts` to co-locate with implementations

**Alternatives Considered:**
- All types in shared — Bloats shared package with analysis-specific concepts
- Types scattered across packages — Hard to maintain, circular dependency risk

**Status:** Accepted

---

## 2026-03-19 (Phase 2)

### DEC-009: PostgreSQL as Primary Database

**Decision:** Use PostgreSQL as the relational database.

**Rationale:**
- Robust, mature, well-supported
- Excellent JSONB support for semi-structured receipt data
- Strong indexing capabilities for audit log queries
- Works excellently with Prisma
- Easy Docker setup for local dev

**Alternatives Considered:**
- MySQL — Less flexible JSON support
- SQLite — Not suitable for production multi-user workloads
- MongoDB — Less structured, harder to enforce relations

**Status:** Accepted

---

### DEC-010: Prisma as ORM

**Decision:** Use Prisma as the ORM for database access.

**Rationale:**
- Best-in-class TypeScript integration with generated types
- Excellent migration tooling
- Type-safe queries with autocomplete
- Clean, readable schema syntax
- Works well across multiple apps in the monorepo

**Alternatives Considered:**
- Drizzle — Lighter but less mature migration tooling
- TypeORM — More boilerplate, less ergonomic
- Raw SQL — No type safety, high error risk

**Status:** Accepted

---

### DEC-011: Multi-Tenant Structure from Day One

**Decision:** Include organizations and memberships in the schema even though MVP is student-first.

**Rationale:**
- Adding multi-tenancy later is painful (DEC-011)
- Organizations and memberships are lightweight now
- Enables Phase 3 institution dashboard without schema migration
- No performance cost for null/missing data

**Alternatives Considered:**
- Add later — More painful migration, potential data loss
- Single-tenant only — Limits long-term scalability

**Status:** Accepted

---

### DEC-012: Version-Level Receipt History

**Decision:** A document version can have multiple AuthorshipReceipts over time.

**Rationale:**
- Users may want to re-analyze after edits
- Version is immutable content snapshot; receipt is a separate event
- Allows tracking "v1 receipt" vs "v2 receipt" after re-analysis
- No reason to restrict this relationship

**Alternatives Considered:**
- One receipt per version — Too restrictive
- Receipts linked only to document — Loses version precision

**Status:** Accepted

---

### DEC-013: Citation Linked to Version, Not Receipt

**Decision:** Citation model links directly to DocumentVersion, not through AuthorshipReceipt.

**Rationale:**
- Citations are properties of the document content itself
- Receipts come and go; citations persist with the version
- Simpler queries for citation analysis
- Can reconstruct any receipt's citation state from version citations

**Alternatives Considered:**
- Citation → Receipt — Would duplicate citations across receipts for same version
- Citation → Document — Loses version precision

**Status:** Accepted

---

## 2026-03-20 (Phase 3)

### DEC-014: Magic Link Auth (No Passwords)

**Decision:** Use magic link authentication via email — no passwords.

**Rationale:**
- Better UX for occasional users (students)
- No password storage or reset complexity
- Lower security surface area
- Works well with email-first use case
- Clean to implement with JWT + database token table

**Alternatives Considered:**
- OAuth providers (Google, GitHub) — Adds dependency and account linking complexity
- Passwords + 2FA — More friction for student users
- Third-party auth (Auth0, Clerk, NextAuth) — Adds third-party dependency and cost

**Status:** Accepted

---

### DEC-015: JWT Sessions via Cookie

**Decision:** Use JWT stored in an httpOnly cookie for session management.

**Rationale:**
- Stateless sessions — no database lookup on every request
- Cookie prevents XSS token theft (httpOnly)
- HTTPS-only in production (secure flag)
- Simple, no Redis session store needed for MVP
- jose library is lightweight and fast

**Alternatives Considered:**
- Database sessions — Requires Redis or DB lookup on every request, more latency
- localStorage + Bearer token — Vulnerable to XSS
- NextAuth/database sessions — Adds dependency for simple MVP use case

**Status:** Accepted

---

### DEC-016: Route Groups for Public vs Protected Separation

**Decision:** Use Next.js route groups (public) and (app) to separate public and protected routes.

**Rationale:**
- Clean URL structure without nested directories
- (app)/layout.tsx handles auth check for all protected routes
- Middleware handles redirects for non-Next.js routes
- Scalable — easy to add new protected/public routes

**Alternatives Considered:**
- Middleware-only — Would need auth check in every page/layout
- Nested directories — Messy URL structure (/app/dashboard)
- Parallel directories — More complex Next.js routing

**Status:** Accepted

---

### DEC-017: Server Components for Dashboard/Documents/Settings

**Decision:** Use Next.js server components for authenticated pages (dashboard, documents, settings).

**Rationale:**
- Direct database access without API overhead
- Auth check via `getCurrentUser()` at the layout level
- Simpler code — no client-side data fetching
- Automatic caching benefits from Next.js

**Alternatives Considered:**
- Client components with SWR/fetch — More code, more API endpoints
- API routes for everything — Extra network hop, more complex

**Status:** Accepted

---

### DEC-018: Magic Link Logged to Console in Development

**Decision:** In development mode, the magic link is logged to console and included in the API response (debugLink field).

**Rationale:**
- No email service needed for local development
- Faster iteration
- Clear UX: user sees the link immediately
- Production will use a real email provider (SES, Resend, etc.)

**Alternatives Considered:**
- Real email in dev — Requires SMTP config or third-party API
- File-based queue — More complexity for MVP

**Status:** Accepted

---

## 2026-03-20 (Phase 4)

### DEC-019: Ingestion via Versioned Document Model

**Decision:** All document content (uploaded files and pasted text) is stored as a DocumentVersion linked to a Document.

**Rationale:**
- Documents have multiple versions over time — each upload/paste creates a new immutable version
- Version stores the content (paste) or a reference to stored file (upload)
- Allows comparing authorship indicators across versions
- Clear audit trail of document history
- Receipts link to a specific version, not the document

**Alternatives Considered:**
- Store all content in a single Document record — loses version history, harder to track changes
- Store only latest version — no historical comparison, breaks receipt reproducibility

**Status:** Accepted

---

### DEC-020: Storage Abstraction with Local Default

**Decision:** A storage abstraction layer (`saveFile`, `deleteFile`, `getFileUrl`) with local filesystem as the default development implementation.

**Rationale:**
- Interface is designed to swap to S3/GCS/Azure Blob without changing any call sites
- Local dev requires no cloud credentials — just set `STORAGE_LOCAL_DIR`
- `getFileUrl` normalizes the returned URL so routing works identically in dev and prod
- Production storage vars are optional until S3 is configured
- Uploaded files get unique names (`timestamp-random.ext`) to avoid collisions and path exposure

**Alternatives Considered:**
- Use S3 directly in dev — Requires cloud credentials for every developer
- Use base64 data URIs — Works for small files but poor for 10MB documents
- Store files in database as BLOBs — Bad for large files, performance degrades

**Status:** Accepted

---

### DEC-021: BullMQ + Redis for Job Queue

**Decision:** Use BullMQ as the queue library with Redis as the backend.

**Rationale:**
- BullMQ is the de-facto standard for Node.js background jobs
- Redis is lightweight and already minimal for the MVP
- BullMQ handles retries, backoff, concurrency, and dead-letter management out of the box
- BullMQ jobs are stored in Redis with persistence — survives restarts
- `ioredis` is already in worker package.json from Phase 1

**Alternatives Considered:**
- pg-boss (PostgreSQL-backed) — Adds DB load, less mature than BullMQ
- SQS + Lambda — More ops complexity, not local-first
- In-memory queue (like Agenda with MongoDB) — No persistence, poor for production

**Status:** Accepted

---

### DEC-022: HTTP-Based Web→Worker Communication

**Decision:** Web app communicates with the worker via HTTP (POST /enqueue) rather than sharing a queue connection or using a separate service bus.

**Rationale:**
- Simplest MVP approach — no shared Redis credentials between apps
- Worker exposes a tiny HTTP server on port 3001 (native Node.js, no Express)
- Web app uses native `fetch()` — no additional dependencies in web app
- Worker enqueues via BullMQ internally — no complexity leak
- If worker is down, web gracefully marks job as FAILED without blocking user

**Alternatives Considered:**
- Web app connects directly to Redis — Shares Redis URL, more coupling, security risk
- BullMQ in both apps — Adds BullMQ as web dependency, heavyweight
- Message queue service (SQS/SNS) — Overkill for MVP, adds third-party dependency

**Status:** Accepted

---

### DEC-023: Placeholder Processing Separated from Real Analysis

**Decision:** Worker placeholder processing is a complete, runnable stub that clearly separates the processing pipeline from the job infrastructure, making it easy to swap in real implementations in Phase 6 without touching the job system.

**Rationale:**
- Phase 5 is infrastructure — job queue, not analysis logic
- The placeholder has 4 clear steps (load, parse, analyze, assemble) matching the real pipeline
- Each step updates progress (20%, 40%, 70%, 90%) for realistic UI feedback
- Throwing errors triggers real BullMQ retry behavior
- Replacing the placeholder only requires changing one function in `analyzeDocumentJob.ts`

**Alternatives Considered:**
- Skip placeholder, build real analysis in Phase 5 — Scope creep, delays job system testing
- Use a "todo" comment instead of runnable code — Can't verify job infrastructure until Phase 6

**Status:** Accepted
