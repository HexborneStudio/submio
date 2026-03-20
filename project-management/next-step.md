# Next Step

> Exactly one next recommended task

---

## TASK: Phase 4 - Document Ingestion

**Objective:** Build the document creation flow and content ingestion (upload + paste).

**Dependencies:**
- Phase 3 auth complete (user can authenticate)
- Database accessible with schema applied
- Storage setup (local filesystem or S3-compatible)

**Expected Files to Change:**
- `apps/web/app/(app)/documents/new/page.tsx` — New document form
- `apps/web/app/(app)/documents/[documentId]/page.tsx` — Document detail + content
- `apps/web/app/(app)/documents/[documentId]/upload/page.tsx` — Upload flow
- `apps/web/app/api/documents/route.ts` — Create document API
- `apps/web/app/api/documents/[documentId]/versions/route.ts` — Create version API
- `packages/shared/validation/index.ts` — Add document validation schemas
- `apps/web/src/lib/storage.ts` — Storage helper (placeholder for S3/local)
- `packages/db/prisma/schema.prisma` — Potentially add filename field to DocumentUpload

**Steps:**
1. Create document creation page (title input)
2. Create document detail page with version list
3. Build upload page (file input → validate → store → create version)
4. Build paste page (text input → create version)
5. Add file validation (type: .docx, .pdf, size limit: 10MB)
6. Create document API routes (POST, GET)
7. Create version API routes (POST for upload + paste)
8. Set up storage helper (local /tmp uploads in dev, S3 in prod)
9. Update document status on version creation

**Completion Criteria:**
- User can create a new document (title)
- User can upload a .docx or .pdf file
- User can paste text directly
- Document shows version history
- File is validated (type + size)
- Storage path recorded in DocumentUpload

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. Phase 4: Document Ingestion (current)
4. Phase 5: Analysis Job System — Redis queue setup
5. Phase 6: Document Parsing + Analysis V1 — Implement parsers
6. Phase 7: Receipt Generation — Build receipt UI and logic

---

## Database Setup Reminder

Before Phase 4, apply Phase 2 schema:

```bash
# Apply schema to database (no migration history)
npm run db:push --workspace=packages/db

# Generate Prisma client
npm run db:generate --workspace=packages/db

# Verify with Prisma Studio
npm run db:studio --workspace=packages/db
```
