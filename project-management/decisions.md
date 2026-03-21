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

---

## 2026-03-20 (Phase 7)

### DEC-027: Receipt Assembly in Analysis Package

**Decision:** Receipt assembly logic (`buildReceiptSummary`, `buildReceiptSections`, `assembleReceipt`) lives in `packages/analysis/src/receipts/` rather than in the worker.

**Rationale:**
- Keeps analysis logic centralized in one package
- Enables future use cases (preview receipt before persisting, receipt diffing)
- Worker only needs to call `assembleReceipt()` and `persistReceipt()` — clean separation
- Receipt shape is defined by the analysis package, not the persistence layer

**Alternatives Considered:**
- Receipt assembly in worker service — Tighter coupling, harder to test in isolation
- Receipt assembly in web app — Worker needs to know receipt shape before persisting

**Status:** Accepted

---

### DEC-028: Dual Storage: Full Receipt + Individual Sections

**Decision:** Store both the complete `AssembledReceipt` JSON in `AuthorshipReceipt.receiptData` AND individual `ReceiptSection` records in `ReceiptSection` table.

**Rationale:**
- `receiptData` JSON provides full audit trail and export capability (complete snapshot)
- `ReceiptSection` records enable flexible, section-by-section rendering in the UI
- Section-level storage allows future partial updates (re-analyze just citations section)
- Both are derived from the same data at write time — no duplication of business logic

**Alternatives Considered:**
- Store only JSON — Simpler but harder to query sections individually
- Store only sections — Requires reconstructing the full receipt for exports
- Store sections in separate receipt-specific tables — Over-engineering for current needs

**Status:** Accepted

---

### DEC-029: Ordered Sections via sortOrder Column

**Decision:** `ReceiptSection` uses an integer `sortOrder` column to define display order rather than relying on array order in the JSON.

**Rationale:**
- Explicit `sortOrder` is simpler to query and render (ORDER BY sortOrder ASC)
- Allows adding/removing sections without re-serializing the full JSON
- Future section additions can be slotted in without renumbering (e.g., insert at position 3.5)
- Consistent with how database-ordered lists are handled elsewhere in the system

**Alternatives Considered:**
- Array order in JSON — Fragile, requires re-reading full JSON to render correctly
- Enum for section order — More type-safe but requires schema change to add sections

**Status:** Accepted

---

### DEC-030: Receipt Disclaimer Always Visible

**Decision:** The evidence-based receipt disclaimer is displayed on every receipt view and printed/exported receipt.

**Rationale:**
- Core principle from DEC-007: receipts are evidence-based indicators, not definitive judgments
- Educator and student users must see the disclaimer prominently on every view
- Disclaimer appears in: summary block, confidence section (yellow caution box), and footer disclaimer box
- Builds trust and sets correct expectations about what the tool does and does not claim

**Alternatives Considered:**
- Disclaimer only on export — Students might not see it before sharing
- Disclaimer only once on first view — Important context should always be visible
- Disclaimer in hover/tooltip — Too subtle for a legal-safety message

**Status:** Accepted

---

### DEC-031: Share Tokens Use Cryptographically Random 256-bit Values

**Decision:** Share link tokens are generated using Node.js `crypto.randomBytes(32)` encoded as base64url, producing 43 characters with 256 bits of entropy.

**Rationale:**
- Tokens must be unguessable even with partial knowledge of the creator
- cuid() is sequential and predictable — not suitable for security tokens
- 256 bits exceeds the 128-bit minimum recommended for URL-safe tokens
- base64url encoding avoids URL-unsafe characters (+, /, =)
- No need for signed/JWT tokens at MVP stage — token is the secret

**Alternatives Considered:**
- cuid() — Sequential, predictable, exposes receipt enumeration
- UUID v4 — Only 122 bits of entropy, slightly weaker
- JWT signed tokens — More complexity, requires key management, no benefit at MVP

**Status:** Accepted

---

### DEC-032: Share Token Validation Returns 404 for All Invalid States

**Decision:** When a share token is invalid, revoked, or expired, the API returns HTTP 404 with no information about which state applies.

**Rationale:**
- Any information distinguishing "revoked" from "expired" from "invalid" is metadata that could aid an attacker
- Security through no information leakage: all invalid tokens look identical
- The shared receipt page itself shows different user-facing messages (revoked/expired/invalid) but only after server-side validation confirms the token format is valid
- The educator review form is public, so any feedback about token validity would be an information leak

**Alternatives Considered:**
- Return 403 for revoked, 410 for expired, 404 for invalid — Leaks information about token lifecycle
- Return same message for all cases in API but different messages in UI — Extra complexity with no security benefit

**Status:** Accepted

---

### DEC-033: Educator Reviews Are Public (No Auth Required)

**Decision:** The educator review form on shared receipt pages requires no authentication. Any visitor with the share link can submit a review.

**Rationale:**
- Reduces friction for educators reviewing student work
- Educator identity (name + optional email) is captured in the review itself
- The share link creator can revoke access at any time, limiting who can review
- No account creation required for educators
- Reviewer email is optional — educators can remain pseudonymous

**Alternatives Considered:**
- Require educator account — Adds friction, requires invite flow
- Magic link for educators — Same friction as student flow, no benefit

**Status:** Accepted

---

### DEC-034: ReviewStatus Includes NEEDS_FOLLOW_UP (Not Just FLAGGED)

**Decision:** The `ReviewStatus` enum includes both `FLAGGED` (from prior schema) and `NEEDS_FOLLOW_UP` as distinct statuses.

**Rationale:**
- `FLAGGED` implies something is wrong; `NEEDS_FOLLOW_UP` is more neutral and actionable
- "Needs follow-up" is language educators actually use in academic review workflows
- Both statuses coexist: FLAGGED for serious concerns, NEEDS_FOLLOW_UP for routine questions
- Preserves backwards compatibility with any code that checks for FLAGGED

**Status:** Accepted

---

### DEC-035: PDF Generation Uses @react-pdf/renderer (Client-Side Reactive)

**Decision:** Use `@react-pdf/renderer` (version 4.x) for server-side PDF generation of authorship receipts. The `renderToBuffer()` function is called in API route handlers (not client-side).

**Rationale:**
- React-native library that works in Node.js without requiring Chrome/headless browser
- Component-based templating matches the existing React/Next.js codebase
- Supports React 19 (`^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`)
- No external binary dependencies (unlike puppeteer/chromium)
- `renderToBuffer` is synchronous and works in Next.js App Router route handlers

**Alternatives Considered:**
- `html-pdf-node` — Requires HTML template separate from React components; deprecated puppeteer dependency
- `puppeteer-core` / `@sparticuz/chromium` — Requires Chrome binary; heavier footprint
- `@react-pdf/renderer` client-side (browser) — Would expose generation logic to client; not chosen

**Status:** Accepted

---

### DEC-036: PDF Export Is Synchronous (No Worker Queue)

**Decision:** PDF export is handled synchronously in the web app's API route handler rather than via the BullMQ worker queue.

**Rationale:**
- PDF generation is fast (receipt data is already assembled)
- No external binary dependency (using @react-pdf/renderer)
- Reduces queue complexity for a simple operation
- Export record created immediately with COMPLETED status
- If PDF generation fails, user gets an immediate error response

**Alternatives Considered:**
- Worker queue export (via exportReceiptJob) — Adds latency and complexity; overkill for simple PDF generation
- Async (fire-and-forget) — User wouldn't get immediate download; poor UX

**Note:** If PDF generation becomes slow or requires external services (e.g., headless Chrome), this decision should be revisited and the worker queue approach implemented.

**Status:** Accepted

---

## 2026-03-20 (Phase 11)

### DEC-037: Analytics Scaffold Uses MVP Console-Log Pattern

**Decision:** Analytics tracking uses a scaffold that logs to console in development and is a no-op in production, with a clear TODO to integrate a real provider.

**Rationale:**
- Analytics is essential for understanding user behavior and conversion
- Integrating a real provider (Mixpanel, PostHog, Amplitude) requires account setup and SDK installation
- The scaffold provides the type-safe interface (AnalyticsEvent union) so adding real tracking is a one-file change
- Console logging in dev means developers see events without any external dependency
- No third-party SDK loaded in the browser until a real provider is configured

**Alternatives Considered:**
- Integrate Mixpanel/PostHog immediately — Requires account, SDK, and privacy policy before the product is ready
- Use a fake/mock analytics in tests — Overkill for MVP; scaffold is sufficient
- Skip analytics entirely — Makes it impossible to understand usage patterns

**Status:** Accepted

---

### DEC-038: Empty/Loading/Error States Use Shared Components

**Decision:** Empty, loading, and error states across all pages use shared components from `components/ui/`.

**Rationale:**
- Consistent UX across the entire product — users see the same patterns everywhere
- Shared components are easier to update (change in one place propagates everywhere)
- LoadingSkeleton, EmptyState, ErrorState, PageLoader are generic enough to be reused
- Specific pages can still provide custom content (icon, title, description, action) via props

**Alternatives Considered:**
- Inline empty/loading states per page — Duplication, inconsistent UX, harder to maintain
- Only add states to critical pages — Inconsistent; users expect polish everywhere

**Status:** Accepted

---

### DEC-039: Onboarding Banner for 0-Document Users on Dashboard

**Decision:** New users (with 0 documents) see a welcome banner on the dashboard with a direct CTA to create their first document.

**Rationale:**
- Reduces time-to-first-receipt by guiding users to the create flow immediately after signup
- The banner appears only when relevant (0 documents) — disappears automatically as users add content
- Shows at a glance what the product does (transparency for academic work) without requiring exploration
- Friendly emoji + copy reduces intimidation for first-time users

**Alternatives Considered:**
- Mandatory onboarding flow — Friction; users may abandon
- Empty dashboard with just a button — Less informative, misses teaching moment
- No onboarding guidance — Confusing for first-time users unfamiliar with the concept

**Status:** Accepted

---

### DEC-040: In-Memory Rate Limiting for Single-Instance Deployments

**Decision:** Use an in-memory Map-based rate limiter as the default implementation. Provide Redis-backed rate limiting as a production recommendation.

**Rationale:**
- Simple, zero-dependency implementation for development and single-instance deployments
- Rate limit state is lost on restart but that's acceptable for the use case
- Multi-instance production should use Redis (documented in security-hardening.md)
- IP-based limiting with path-scoped keys provides adequate protection against script attacks

**Alternatives Considered:**
- Redis-based from day one — adds complexity for dev setup, requires Redis even for local dev
- Third-party rate limiting library — adds a dependency; the implementation is simple enough to own

**Status:** Accepted

---

### DEC-041: Fail-Fast Environment Validation at Startup

**Decision:** All required environment variables are validated via Zod at startup using `validateEnv()`. The application exits immediately with a clear error message listing all missing/invalid variables.

**Rationale:**
- Prevents cryptic runtime errors from misconfigured deployments
- Clear, actionable error messages (not just "DATABASE_URL is required")
- Worker validates env at module import time (before connecting to Redis/Postgres)
- Web app has `ensureEnvValid()` helper for server-side startup validation

**Alternatives Considered:**
- Validation on first use — errors appear mid-request, harder to diagnose
- No validation — common cause of production incidents

**Status:** Accepted

---

### DEC-042: Separate app-level and route-level rate limiting

**Decision:** Rate limiting is applied at the API route level using `withRateLimit()` wrapper, not via Next.js middleware. The rate limit config presets are defined centrally.

**Rationale:**
- Next.js edge middleware runs before dynamic imports are resolved, making per-route config harder
- `withRateLimit()` wrapper is explicit and easy to apply to specific routes
- Config presets (RATE_LIMITS) are defined centrally for consistency
- Middleware helper (`createRateLimitHandler`) still exists for HTTP handler wrapping

**Status:** Accepted

---

### DEC-043: Remove Duplicate app/documents/ Route Group

**Decision:** Removed the non-route-group `app/documents/` directory entirely, keeping only `app/(app)/documents/`.

**Rationale:**
- Next.js route groups `(app)` serve files at the path without the group name in the URL
- Having both `app/documents/` and `app/(app)/documents/` creates a routing conflict where the non-group files would shadow or be shadowed by the route group
- The `(app)` group provides the correct URL structure (`/documents/`) and should be the canonical location

**Status:** Accepted

---

### DEC-044: Health Check Endpoint for Load Balancer Compatibility

**Decision:** Added `GET /api/health` endpoint that validates database connectivity and returns `{ status: "ok", timestamp }` with HTTP 200 on success, HTTP 500 on failure.

**Rationale:**
- Kubernetes/load balancers need a liveness/readiness probe that doesn't require authentication
- The endpoint intentionally does NOT check Redis (worker handles Redis health separately)
- Returning 500 on DB failure signals the load balancer to stop routing traffic
- Nginx proxies `/health` → `web:3000/api/health` for containerized deployments

**Status:** Accepted

---

### DEC-045: Workspace Package Import Resolution

**Decision:** The monorepo uses TypeScript path aliases pointing to workspace package source files, not compiled output.

**Rationale (Past):**
- Workspace packages (`@authorship-receipt/db`, etc.) are symlinked via npm workspaces
- TypeScript path aliases pointed to source files for direct access during development
- This worked for type-checking but broke at runtime when Next.js tried to bundle

**Problem Found (2026-03-20):**
- Next.js static generation fails with `PrismaClient is not a constructor`
- Root cause: PrismaClient class not properly exported through the re-export chain in bundled output
- Affects: All web app pages that import from workspace packages

**Status:** Open — awaiting resolution (see next-step.md)

**Resolution Options:**
1. Consume compiled `dist/` output instead of TypeScript source
2. Lazy-load PrismaClient in service files
3. Accept Node.js runtime requirement (no static export)

### DEC-046: Soft Launch Scope

**Decision:** Internal testing with 3-5 real users before any external launch.

**Rationale:** Catch real-world usage issues before exposing to public. MVP is feature-complete for core flows.

**Status:** Accepted

---

## 2026-03-21 (Phase 13)

### DEC-047: Student-First Product Positioning

**Decision:** Reposition the product from "educator transparency tool" to "pre-submission paper checker for students."

**Rationale:**
- Primary value prop is helping students catch issues before submission
- Instructor sharing is repositioned as optional post-submission action
- "Authorship Receipt" brand → "Paper Check" branding
- Target user: student preparing to submit work
- Core promise: catch issues before your professor does

**Status:** Accepted

---

### DEC-048: Summary-First UX on Document Detail Page

**Decision:** The document detail page (paper check result page) shows a summary-first layout with clear submission readiness status before any detailed report.

**Rationale:**
- Students need immediate actionable feedback
- Summary-first matches the "pre-flight check" mental model
- Detailed report is secondary/investigation layer
- Clear status: "Ready to Submit" / "Needs Review" / "Issues Found"

**Status:** Accepted

---

### DEC-049: Detailed Report Demoted to Secondary Layer

**Decision:** The detailed report (formerly "Authorship Receipt") is accessible via "View Detailed Report" button, not shown by default.

**Rationale:**
- Summary provides immediate value
- Detailed report is for investigation when issues are found
- Reduces cognitive load for students just wanting quick feedback
- Maintains full data access for those who need it

**Status:** Accepted

---

### DEC-050: Share with Instructor Repositioned

**Decision:** "Share with Educator" renamed to "Share with Instructor" and repositioned as an optional post-submission action.

**Rationale:**
- Student is the primary user
- Instructor sharing is optional, not the core use case
- Explanatory text updated to clarify it's for sharing before or after submission
- Reinforces that the tool helps students first

**Status:** Accepted
