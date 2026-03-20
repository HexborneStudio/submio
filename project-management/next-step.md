# Next Step

> Exactly one next recommended task

---

## TASK: Phase 7 - Receipt Generation

**Objective:** Build the receipt data model, receipt assembly service, and receipt UI sections.

**Dependencies:**
- Phase 6 analysis pipeline running (document parsing, citation extraction)
- Phase 4 document ingestion (documents can be created with content)
- Phase 5 job system (worker can process analysis jobs)

**Expected Files to Change:**
- `packages/db/prisma/schema.prisma` — Add `AuthorshipReceipt` and `ReceiptSection` models
- `packages/analysis/src/services/assembleReceiptService.ts` — Build structured receipt data
- `apps/worker/src/services/assembleReceiptService.ts` — Call analysis signals → receipt data
- `apps/web/app/(app)/receipt/[receiptId]/page.tsx` — Receipt view page
- `apps/web/app/share/[token]/page.tsx` — Public share view page
- `apps/worker/src/jobs/generateReceiptJob.ts` — Receipt generation job processor

**Steps:**
1. Finalize `AuthorshipReceipt` and `ReceiptSection` Prisma models (already in schema)
2. Build receipt assembly service that transforms `AnalysisResult` into receipt sections
3. Design receipt UI sections: overview, authorship signals, citations, sources, originality
4. Create receipt view page with all sections
5. Add share link generation and public receipt view
6. Add educator review form

**Completion Criteria:**
- Documents with processed versions show a complete receipt
- Receipt includes: overview, authorship indicators, citation list, source references
- Educator can review and annotate a shared receipt
- Share link provides public read-only access

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. ~~Phase 4: Document Ingestion~~ ✅ DONE
4. ~~Phase 5: Analysis Job System~~ ✅ DONE
5. ~~Phase 6: Document Parsing + Analysis V1~~ ✅ DONE
6. Phase 7: Receipt Generation (current)
7. Phase 8: Share + Educator Review
8. Phase 9: PDF Export
9. Phase 10: Admin Tools
10. Phase 11: Product Polish
11. Phase 12: Hardening

---

## To Run the Worker

```bash
# 1. Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# 2. Apply schema (Phases 2-5)
npm run db:push --workspace=packages/db
npm run db:generate --workspace=packages/db

# 3. Install all deps
npm install

# 4. Start worker (terminal 1)
npm run dev --workspace=apps/worker

# 5. Start web (terminal 2)
npm run dev --workspace=apps/web
```
