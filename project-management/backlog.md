# Backlog

---

## NOW (Current Phase)

### Phase 10: Admin Tools

---

## DONE

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

### Phase 11: Product Polish
- [ ] Finalize landing page
- [ ] Build pricing page
- [ ] Create onboarding flow
- [ ] Add error/loading/empty states
- [ ] Set up analytics hooks

### Phase 12: Hardening
- [ ] Add rate limiting
- [ ] Enhance file security
- [ ] Build storage cleanup
- [ ] Add monitoring hooks
- [ ] Environment validation
- [ ] Test coverage
- [ ] Production Docker/Nginx config

---

## BLOCKED

### Phase 13: Post-MVP
- [ ] Educator dashboard — waiting for Phase 2-10
- [ ] Organization/team accounts — waiting for Phase 2-10
- [ ] Institution workflows — waiting for Phase 2-10
- [ ] LMS integrations — waiting for Phase 2-10
- [ ] Advanced source analysis — waiting for Phase 6
- [ ] Collaboration features — future consideration
