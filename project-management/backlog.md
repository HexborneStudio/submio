# Backlog

---

## NOW (Current Phase)

### Phase 13: Student-First Validation

---

## DONE

### Phase 13: Student-First Product Restructure ✅
- [x] Landing page rewrite (student-first messaging)
- [x] Pricing page (student-friendly tiers)
- [x] Dashboard update ("Your Papers" heading)
- [x] Documents list update ("Start New Check" CTA)
- [x] Document detail page (summary-first UX)
- [x] Receipt page renamed to "Detailed Report"
- [x] Share section ("Share with Instructor")
- [x] AppShell nav ("Papers" label)
- [x] Product spec updated
- [x] Decisions documented (DEC-047 through DEC-050)

### Phase 9: PDF Export ✅
- [x] Build PDF template component (PdfReceiptDocument using @react-pdf/renderer)
- [x] Implement PDF generation service (exportReceiptPdf.ts)
- [x] Create export API route (POST /api/export/[receiptId])
- [x] Create export history API route (GET /api/export/history)
- [x] Add ExportPdfButton client component to receipt page
- [x] Export history tracked via existing Export model
- [x] Secure owner-only download via receipt ownership check

### Phase 8: Share Links + Educator Review ✅
- [x] Create signed share links (256-bit cryptographically random tokens)
- [x] Build public receipt view (unauthenticated, token-gated)
- [x] Implement educator review form (public, no auth required)
- [x] Add review status tracking (PENDING, REVIEWED, FLAGGED, NEEDS_FOLLOW_UP)
- [x] Create review notes display on shared receipt page

### Phase 7: Receipt Generation ✅
- [x] Build receipt data model (AuthorshipReceipt + ReceiptSection)
- [x] Create receipt assembly service
- [x] Design receipt UI sections
- [x] Build receipt view page

### Phase 6: Document Parsing + Analysis V1 ✅
- [x] Install mammoth (docx) and pdf-parse (pdf) libraries
- [x] Implement DocxParser.parse() with mammoth
- [x] Implement PdfParser.parse() with pdf-parse
- [x] Implement citation extraction heuristics
- [x] Implement text normalization
- [x] Implement authorship signals building
- [x] Wire real parsers into analyzeDocumentJob.ts

---

## NEXT (Queued)

### Phase 10: Admin Tools
- [ ] Build admin login gate
- [ ] Create user lookup
- [ ] Build receipt lookup
- [ ] Implement job inspection
- [ ] Create support logs view
- [ ] Build audit views

### Phase 11: Product Polish ✅
- [x] Finalize landing page
- [x] Build pricing page
- [x] Create onboarding flow
- [x] Add error/loading/empty states
- [x] Set up analytics hooks

### Phase 12: Hardening ✅
- [x] Add rate limiting (in-memory, IP-based, endpoint-specific presets)
- [x] Enhance file security (size, MIME, extension, path traversal, safe filename)
- [x] Add environment validation (Zod, fail-fast at startup)
- [x] Test coverage (Vitest + fileSecurity + rateLimit tests)
- [x] Production Docker/Nginx config (Dockerfiles, docker-compose, nginx conf)
- [x] Health check endpoint (GET /api/health with DB connectivity check)
- [x] Structured JSON logger (worker)
- [x] Route conflict fixed (removed duplicate app/documents/ directory)
- [x] Docs (deployment.md, security-hardening.md)

---

## BLOCKED

### Phase 13: Post-MVP
- [ ] Student feedback collection — validate restructure effectiveness
- [ ] Instructor dashboard — deferred (share links work without it)
- [ ] Organization/team accounts — waiting for Phase 2-10
- [ ] Institution workflows — deferred
- [ ] LMS integrations — deferred
- [ ] Advanced source analysis — waiting for Phase 6
- [ ] Collaboration features — future consideration

## DEFERRED (Educator-Facing)

These items are educator/institution facing and are lower priority than student-facing improvements:
- [ ] Educator dashboard for reviewing submitted reports
- [ ] Institution admin panels
- [ ] Bulk receipt review workflows
- [ ] Educator notification system

## Post-MVP Soft Launch Prep
- [x] Internal test plan — DONE
- [x] Soft launch checklist — DONE
- [x] Bug triage tracker — DONE
- [x] Feedback log — DONE
- [ ] Internal testing (3-5 users)
- [ ] Bug fixes from testing
- [ ] Soft launch (if criteria met)
