# Authorship Receipt

A document authorship transparency platform that helps students prove how their documents were created and helps educators review writing-process evidence.

## Project Status

**Phase 0-1 Complete** — Monorepo scaffold and project control layer established.

See [docs/product-spec.md](./docs/product-spec.md) for full product specification.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Next.js Server Routes, Worker App |
| Database | PostgreSQL (Prisma) |
| Queue | Redis + BullMQ |
| Storage | Object Storage |
| Infra | Docker, Nginx |

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
npm run db:generate --workspace=packages/db

# Run migrations
npm run db:migrate --workspace=packages/db

# Start development
npm run dev
```

## Project Structure

```
authorship-receipt/
├── apps/
│   ├── web/          # Marketing, auth, dashboard
│   ├── admin/        # Internal admin dashboard
│   └── worker/       # Background job processor
├── packages/
│   ├── db/           # Prisma schema
│   ├── shared/       # Types, constants, validation
│   ├── analysis/     # Document parsing, heuristics
│   └── config/       # Shared configs
├── infra/
│   ├── docker/       # Docker configuration
│   └── nginx/        # Nginx configuration
├── docs/             # Documentation
└── project-management/
```

## Documentation

- [Product Specification](./docs/product-spec.md)
- [Technical Architecture](./docs/technical-architecture.md)
- [Roadmap](./docs/roadmap.md)
- [Current State](./project-management/current-state.md)
- [Build Log](./project-management/build-log.md)

## Principles

1. **Evidence-Based** — All findings are presented as indicators, never definitive judgments
2. **Transparency-First** — Help users understand what analysis shows and cannot show
3. **Academic Integrity** — Designed to support honesty, not circumvent it

## Non-Goals

- ❌ NOT a plagiarism detection tool
- ❌ NOT a "beat Turnitin" tool
- ❌ NOT an undetectable AI writing tool
- ❌ NOT a paper-writing service

## License

Private project.
