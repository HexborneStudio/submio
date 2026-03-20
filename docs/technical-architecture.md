# Technical Architecture

> Last updated: 2026-03-19

## Overview

A monorepo-based application with separate apps for web, admin, and worker functionality, using shared packages for common code.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Next.js Server Routes, Worker App |
| Database | PostgreSQL |
| ORM | Prisma |
| Queue | Redis + BullMQ |
| Storage | Object Storage (S3-compatible) |
| Auth | Email/Magic Link |
| Infra | Docker, Nginx |

---

## Monorepo Structure

```
authorship-receipt/
├── apps/
│   ├── web/          # Marketing, auth, dashboard, document workspace
│   ├── admin/        # Internal admin dashboard
│   └── worker/       # Background job processor
├── packages/
│   ├── db/           # Prisma schema and client
│   ├── shared/       # Types, constants, validation
│   ├── analysis/     # Document parsing, heuristics
│   └── config/       # Shared tsconfig files
├── infra/
│   ├── docker/       # Dockerfile, docker-compose
│   └── nginx/        # Nginx configuration
└── docs/             # Documentation
```

---

## App Responsibilities

### apps/web
- User-facing application
- Marketing pages
- Authentication
- Dashboard
- Document upload/workspace
- Receipt view
- Share pages for educators
- Settings

### apps/admin
- Internal admin dashboard
- User lookup
- Receipt inspection
- Job monitoring
- Support tools
- Audit logs

### apps/worker
- Background job processing
- Document parsing
- Authorship analysis
- Receipt assembly
- PDF export generation

---

## Package Responsibilities

### packages/db
- Prisma schema definitions
- Database migrations
- Database client singleton
- Query helpers

### packages/shared
- TypeScript type definitions
- Shared constants
- Zod validation schemas
- Utility functions

### packages/analysis
- Document parsers (docx, pdf, text)
- Authorship heuristics
- Citation analysis
- Originality detection

### packages/config
- Shared TypeScript configurations
- ESLint configs
- Environment helpers

---

## Data Flow

### Document Processing Flow
1. User uploads file or pastes text
2. Content stored with DocumentVersion
3. AnalysisJob created and queued
4. Worker picks up job
5. Parser extracts text
6. Heuristics analyze content
7. Receipt assembled and stored
8. User notified (future)

### Receipt Sharing Flow
1. User generates receipt
2. SharedLink created with unique token
3. Educator accesses via share URL
4. Educator reviews and optionally comments
5. Review status updated

---

## API Design

API routes are organized under `/api/` in the web app:

```
/api/
├── auth/           # Authentication endpoints
├── documents/      # Document CRUD
├── receipts/       # Receipt operations
├── shares/         # Share link management
├── reviews/        # Educator reviews
├── admin/          # Admin-only endpoints
```

---

## Database Schema

Core entities:
- **users** - Students, educators, admins
- **organizations** - Schools, teams
- **memberships** - User-organization relationships
- **documents** - User document projects
- **document_versions** - Version snapshots
- **document_uploads** - Uploaded files
- **analysis_jobs** - Processing jobs
- **authorship_receipts** - Generated receipts
- **receipt_sections** - Structured receipt data
- **citations** - Extracted citations
- **source_references** - Citation sources
- **shared_links** - Shareable links
- **educator_reviews** - Educator feedback
- **exports** - PDF exports
- **audit_logs** - Action logs

---

## Security

- Signed share links with expiry
- Role-based access control
- Rate limiting on API endpoints
- File validation and type checking
- Secure storage access
- Audit logging for sensitive actions

---

## Environment Configuration

All configuration via environment variables:
- Database connection
- Redis connection
- Auth secrets
- Storage credentials
- App URLs

---

## Build & Deploy

1. `npm install` - Install dependencies
2. `npm run build` - Build all apps
3. `docker-compose up` - Run all services
4. `npm run db:migrate` - Run migrations
5. `npm run db:seed` - Seed initial data
