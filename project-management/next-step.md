# Next Step

> Exactly one next recommended task

---

## TASK: Phase 8 - Share + Educator Review

**Objective:** Build share link generation, public receipt view, and educator review form.

**Dependencies:**
- Phase 7 receipt generation (receipts are persisted and viewable)
- Phase 4 document ingestion (documents can be created with content)

**Expected Files to Change:**
- `packages/db/prisma/schema.prisma` — Check SharedLink + EducatorReview models
- `apps/web/src/lib/share.ts` — Share link generation service
- `apps/web/app/(app)/documents/[documentId]/receipt/page.tsx` — Add "Share" button
- `apps/web/app/share/[token]/page.tsx` — Public read-only receipt view
- `apps/web/app/api/share/route.ts` — POST to create share link
- `apps/worker/src/services/reviewService.ts` — Educator review persistence
- `apps/web/app/api/review/route.ts` — POST to submit educator review

**Steps:**
1. Create share link generation with signed token
2. Build public receipt view page (unauthenticated, token-gated)
3. Implement educator review form with notes and status
4. Add review status tracking to receipt view
5. Create review notes display on public receipt

**Completion Criteria:**
- User can generate a share link for any available receipt
- Share link opens public receipt view without authentication
- Educator can submit review with notes and status (Verified, Concerns, Rejected)
- Review appears on the shared receipt view

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. ~~Phase 4: Document Ingestion~~ ✅ DONE
4. ~~Phase 5: Analysis Job System~~ ✅ DONE
5. ~~Phase 6: Document Parsing + Analysis V1~~ ✅ DONE
6. ~~Phase 7: Receipt Generation~~ ✅ DONE
7. Phase 8: Share + Educator Review (current)
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
