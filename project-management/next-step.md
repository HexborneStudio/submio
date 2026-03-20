# Next Step

> Exactly one next recommended task

---

## TASK: Phase 9 - PDF Export

**Objective:** Build printable receipt view and PDF generation with export history.

**Dependencies:**
- Phase 7 receipt generation (receipts are rendered)
- Phase 8 share links (receipt is shareable)

**Expected Files to Change:**
- `packages/db/prisma/schema.prisma` — Check Export model exists
- `apps/web/src/lib/exportService.ts` — PDF generation service
- `apps/web/app/(app)/documents/[documentId]/receipt/export/route.ts` — Trigger export
- `apps/web/app/(app)/documents/[documentId]/receipt/print/page.tsx` — Printable receipt view
- `apps/web/app/api/share/[token]/print/page.tsx` — Printable shared receipt
- `apps/worker/src/services/exportPdfService.ts` — Worker-side PDF generation
- `apps/worker/src/jobs/exportReceiptJob.ts` — Export queue job

**Steps:**
1. Build printable receipt page (print CSS, no nav)
2. Implement PDF generation (puppeteer or @react-pdf/renderer)
3. Create export history tracking (Export model)
4. Wire export through worker queue
5. Add download button to receipt page

**Completion Criteria:**
- User can download receipt as PDF
- Shared receipt can be downloaded as PDF
- Export history is tracked per receipt per user
- PDF is stored and retrievable

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. ~~Phase 4: Document Ingestion~~ ✅ DONE
4. ~~Phase 5: Analysis Job System~~ ✅ DONE
5. ~~Phase 6: Document Parsing + Analysis V1~~ ✅ DONE
6. ~~Phase 7: Receipt Generation~~ ✅ DONE
7. ~~Phase 8: Share + Educator Review~~ ✅ DONE
8. Phase 9: PDF Export (current)
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
