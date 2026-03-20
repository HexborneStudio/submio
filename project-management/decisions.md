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
