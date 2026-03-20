# Database Specification

> Last updated: 2026-03-19

## Overview

PostgreSQL database with Prisma ORM. Schema defined in `packages/db/prisma/schema.prisma`.

---

## Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `UserRole` | `STUDENT`, `EDUCATOR`, `ADMIN` | User permission levels |
| `MembershipRole` | `OWNER`, `ADMIN`, `MEMBER` | Org membership levels |
| `DocumentStatus` | `DRAFT`, `PROCESSING`, `READY`, `FAILED` | Document lifecycle |
| `AnalysisJobStatus` | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` | Job lifecycle |
| `ReceiptStatus` | `GENERATING`, `AVAILABLE`, `EXPIRED`, `REVOKED` | Receipt lifecycle |
| `UploadType` | `FILE_UPLOAD`, `PASTE` | Content ingestion type |
| `CitationType` | `WEB`, `BOOK`, `JOURNAL`, `OTHER` | Citation classification |
| `SourceReferenceType` | `DIRECT_QUOTE`, `PARAPHRASE`, `CITATION`, `WEB_SOURCE` | How source was used |
| `SharedLinkStatus` | `ACTIVE`, `REVOKED`, `EXPIRED` | Share link lifecycle |
| `ReviewStatus` | `PENDING`, `REVIEWED`, `FLAGGED` | Educator review status |
| `ExportStatus` | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `EXPIRED` | Export lifecycle |

---

## Models

### User
Core user account. Auth is magic-link based (no passwords).
- `id`, `email` (unique), `name`, `role`, `emailVerified`
- `createdAt`, `updatedAt`

### Organization
Multi-tenant container (schools, teams, institutions).
- `id`, `name`, `type`, `createdAt`, `updatedAt`
- Lightly used in MVP; fully active in Phase 3.

### Membership
User-to-organization relationship.
- `userId`, `organizationId`, `role`
- Unique constraint on `(userId, organizationId)`

### Document
Top-level document project owned by a user.
- `id`, `userId`, `title`, `status`, `createdAt`, `updatedAt`
- One user → many documents

### DocumentVersion
Version snapshot of document content.
- `id`, `documentId`, `version`, `content` (paste), `fileType` (upload)
- `@@unique([documentId, version])`
- One document → many versions

### DocumentUpload
Uploaded file metadata linked to a version.
- `id`, `versionId`, `originalName`, `storedPath`, `mimeType`, `size`, `fileType`
- `versionId` is unique (one file per version in MVP)

### AnalysisJob
Background job for document analysis.
- `id`, `documentId`, `versionId`, `status`, `progress`, `result`, `error`, timestamps
- One version → many analysis jobs (retry support)
- `@@index` on `status` for job queue queries
- `result` (JSON) stores structured analysis output: `{ documentId, versionId, status, signals, rawTextLength }`
  - `signals` contains `AuthorshipSignals` with ingestion type, text metrics, parsing info, citation analysis, structural analysis, and confidence indicators
  - See `packages/analysis/src/types.ts` for the full `AnalysisResult` and `AuthorshipSignals` type definitions

### AuthorshipReceipt
Generated receipt for a document version.
- `id`, `documentId`, `versionId`, `receiptData` (JSON), `status`
- One version → many receipts over time (v1, v2, re-analysis)
- Contains: `receiptSections`, `sharedLinks`, `educatorReviews`, `exports`

### ReceiptSection
Structured section within a receipt.
- `id`, `receiptId`, `type`, `title`, `content` (JSON), `sortOrder`
- `@@unique([receiptId, type])`

### Citation
Extracted citation from a document version.
- `id`, `versionId`, `type`, `raw`, `title`, `authors[]`, `year`, `url`
- One version → many citations

### SourceReference
Text excerpt linked to a citation.
- `id`, `citationId`, `type`, `text`, `startPos`, `endPos`
- Captures where in the document a source was used

### SharedLink
Signed share link to a receipt.
- `id`, `receiptId`, `token` (unique), `status`, `expiresAt`, `lastAccessedAt`
- Token is cryptographically random; signed URLs in Phase 3

### EducatorReview
Educator feedback on a shared receipt.
- `id`, `receiptId`, `educatorId` (optional), `educatorEmail` (for anonymous), `status`, `notes`, `reviewedAt`
- Supports both authenticated educators and anonymous email-based review

### Export
PDF/export artifact tracking.
- `id`, `receiptId`, `userId`, `format`, `status`, `filePath`, `fileSize`, `expiresAt`
- `@@index` on `(receiptId, userId)` for lookup

### AuditLog
Sensitive action and system event log.
- `id`, `userId`, `action`, `entity`, `entityId`, `metadata` (JSON), `ipAddress`, `createdAt`
- `@@index` on `(entity, entityId)` for entity-level audit queries
- `@@index` on `createdAt` for time-range queries

---

## Key Relationships

```
User
├── Document[]
│   └── DocumentVersion[]
│       ├── DocumentUpload?
│       ├── AnalysisJob[]
│       ├── Citation[]
│       │   └── SourceReference[]
│       └── AuthorshipReceipt[]
│           ├── ReceiptSection[]
│           ├── SharedLink[]
│           ├── EducatorReview[]
│           └── Export[]

Organization
└── Membership[]
    └── User[]

User
├── Membership[]
├── EducatorReview[]
├── Export[]
└── AuditLog[]

AuditLog → User? (nullable for system events)
EducatorReview → User? (nullable for anonymous educators)
```

---

## Indexes

| Model | Index | Purpose |
|-------|-------|---------|
| User | `email` | Login lookup |
| User | `role` | Admin queries |
| Organization | `type` | Filter by type |
| Membership | `organizationId` | Org membership list |
| Document | `userId` | User's documents |
| Document | `status` | Status filter |
| DocumentVersion | `[documentId, version]` | Unique version constraint |
| DocumentVersion | `documentId` | Version list for document |
| DocumentUpload | `versionId` | Unique: one upload per version |
| AnalysisJob | `documentId` | Document job list |
| AnalysisJob | `versionId` | Version job list |
| AnalysisJob | `status` | Job queue queries |
| AuthorshipReceipt | `documentId` | Document receipts |
| AuthorshipReceipt | `versionId` | Version receipts |
| AuthorshipReceipt | `status` | Status filter |
| Citation | `versionId` | Version citations |
| Citation | `type` | Type filter |
| SourceReference | `citationId` | Reference list for citation |
| SharedLink | `receiptId` | Links for a receipt |
| SharedLink | `status` | Active/expired filter |
| EducatorReview | `receiptId` | Reviews for a receipt |
| EducatorReview | `status` | Pending review filter |
| Export | `receiptId` | Receipt exports |
| Export | `userId` | User's export history |
| Export | `status` | Export queue |
| AuditLog | `userId` | User's actions |
| AuditLog | `action` | Action type queries |
| AuditLog | `[entity, entityId]` | Entity audit trail |
| AuditLog | `createdAt` | Time-range queries |

---

## Migration Commands

```bash
# Install dependencies (from repo root)
npm install

# Generate Prisma client
npm run db:generate --workspace=packages/db

# Push schema (no migration history — good for early dev)
npm run db:push --workspace=packages/db

# Create migration (with history)
npm run db:migrate --workspace=packages/db

# Seed database
npm run db:seed --workspace=packages/db

# Open Prisma Studio
npm run db:studio --workspace=packages/db
```

---

## Notes

- `@@map` not used in MVP — table names match model names
- No soft deletes in MVP — hard deletes with `onDelete: Cascade`
- JSON fields (`receiptData`, `result`, `metadata`) use PostgreSQL JSONB
- All timestamps are UTC
- No row-level security in MVP — handled at the API layer
