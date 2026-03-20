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

---

## What Works

- Monorepo structure with npm workspaces and Turborepo
- TypeScript configured across all packages
- Next.js 15 apps scaffolded with App Router
- Tailwind CSS configured for web/admin apps
- Prisma schema with all core entities defined (15 models, 11 enums, MagicLinkToken)
- Magic link authentication with JWT sessions
- Protected route middleware
- Server-rendered dashboard, documents, settings with real DB data
- Route group separation (public vs app)
- Worker has stub implementations for jobs and services
- Analysis package has stubs for parsing and heuristics
- Docker + Nginx infrastructure configured
- Project memory system operational

---

## What Does Not Exist Yet

- No database migrations applied (schema defined but not deployed)
- No actual email sending (magic link logged to console in dev)
- No actual document parsing (stubs only)
- No real authorship analysis (stubs only)
- No receipt generation logic
- No share link generation with tokens
- No PDF export
- No admin functionality (placeholders only)
- No actual storage integration
- No document creation/upload flow (Phase 4)

---

## Current Architecture Snapshot

```
authorship-receipt/
├── apps/web (Next.js 15, Tailwind)
│   ├── app/(public)/ — landing, pricing, privacy, terms
│   ├── app/(app)/ — dashboard, documents, settings (auth-gated)
│   ├── app/api/auth/ — login, signup, callback, logout, me
│   ├── app/auth/callback/
│   ├── src/lib/auth/ — config, jwt, session, magic-link
│   ├── src/components/app/AppShell.tsx
│   └── src/middleware.ts
├── apps/admin (Next.js 15, Tailwind) - 6 pages (placeholder auth gate)
├── apps/worker (BullMQ, Redis) - 5 services + 2 jobs
├── packages/
│   ├── db/
│   │   ├── prisma/schema.prisma (16 models, 11 enums + MagicLinkToken)
│   │   ├── prisma/seed.ts
│   │   └── src/
│   ├── shared (types, constants, zod validation)
│   ├── analysis (4 parsers, 3 heuristic modules)
│   └── config (3 tsconfig files)
├── infra/
│   ├── docker/ (Dockerfile, docker-compose)
│   └── nginx/ (nginx.conf, site config)
├── docs/ (4 docs) + project-management/ (5 files)
```

---

## Next Priority

**Phase 4: Document Ingestion** — Document creation and content upload/paste flow.

See: [next-step.md](./next-step.md)
