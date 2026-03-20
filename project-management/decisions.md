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
