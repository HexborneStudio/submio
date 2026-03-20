# Next Step

> Exactly one next recommended task

---

## TASK: Phase 5 - Analysis Job System

**Objective:** Build the background job system using BullMQ + Redis to process document analysis asynchronously.

**Dependencies:**
- Phase 4 document ingestion complete (documents and versions can be created)
- Redis running (docker or local)
- Document status transitions to PROCESSING on version creation (already done in Phase 4)

**Expected Files to Change:**
- `apps/worker/src/index.ts` — Enable BullMQ connection
- `apps/worker/src/queues/index.ts` — Queue definitions (analyzeDocument, exportReceipt)
- `apps/worker/src/jobs/analyzeDocumentJob.ts` — Implement actual analysis job
- `apps/web/app/api/documents/[documentId]/versions/route.ts` — Add job dispatch on version creation
- `packages/db/prisma/schema.prisma` — Add `AnalysisJob` model
- `.env.example` — Redis configuration

**Steps:**
1. Set up BullMQ queues in worker app
2. Create job types: analyzeDocument, exportReceipt
3. Wire version creation API to dispatch analyzeDocument job
4. Build job status tracking (update AnalysisJob status as it runs)
5. Implement retry logic with exponential backoff
6. Add failure handling and dead letter queue
7. Build job status API endpoint for frontend polling

**Completion Criteria:**
- Creating a document version dispatches an analysis job
- Job runs asynchronously in the worker
- Frontend can poll job status via API
- Job retries on transient failures
- Job status updates: PENDING → PROCESSING → COMPLETED/FAILED
- Document status updated to READY on COMPLETED, FAILED on failure

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. ~~Phase 4: Document Ingestion~~ ✅ DONE
4. Phase 5: Analysis Job System (current)
5. Phase 6: Document Parsing + Analysis V1 — Implement parsers
6. Phase 7: Receipt Generation — Build receipt UI and logic

---

## Database Setup Reminder

Before Phase 5, apply Phase 2 schema (if not already done):

```bash
# Apply schema to database (no migration history)
npm run db:push --workspace=packages/db

# Generate Prisma client
npm run db:generate --workspace=packages/db

# Verify with Prisma Studio
npm run db:studio --workspace=packages/db
```
