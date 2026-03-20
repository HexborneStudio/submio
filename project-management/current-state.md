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

---

## What Works

- Monorepo structure with npm workspaces and Turborepo
- TypeScript configured across all packages
- Next.js 15 apps scaffolded with App Router
- Tailwind CSS configured for web/admin apps
- Prisma schema with all core entities defined (15 models, 11 enums)
- All MVP pages created as placeholders
- Worker has stub implementations for jobs and services
- Analysis package has stubs for parsing and heuristics
- Docker + Nginx infrastructure configured
- Project memory system operational

---

## What Does Not Exist Yet

- No actual authentication implemented (no login/signup logic)
- No database migrations applied (schema defined but not deployed)
- No actual document parsing (stubs only)
- No real authorship analysis (stubs only)
- No receipt generation logic
- No share link generation with tokens
- No PDF export
- No admin functionality (placeholders only)
- No actual storage integration

---

## Current Architecture Snapshot

```
authorship-receipt/
├── apps/web (Next.js 15, Tailwind) - 17 pages
├── apps/admin (Next.js 15, Tailwind) - 6 pages
├── apps/worker (BullMQ, Redis) - 5 services + 2 jobs
├── packages/
│   ├── db/
│   │   ├── prisma/schema.prisma (15 models, 11 enums)
│   │   ├── prisma/seed.ts
│   │   ├── src/index.ts
│   │   └── src/client.ts
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

**Phase 3: Auth + App Shell** — Scaffold auth flow and protected dashboard.

See: [next-step.md](./next-step.md)
