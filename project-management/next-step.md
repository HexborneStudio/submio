# Next Step

> Exactly one next recommended task

---

## TASK: Phase 6 - Document Parsing + Analysis V1

**Objective:** Replace placeholder processing with real PDF/DOCX text extraction and authorship heuristics.

**Dependencies:**
- Phase 5 job system running (worker + Redis + BullMQ)
- Documents can be created with upload or paste (Phase 4)

**Expected Files to Change:**
- `packages/analysis/src/parsers/docxParser.ts` — Implement DOCX parsing (mammoth.js)
- `packages/analysis/src/parsers/pdfParser.ts` — Implement PDF parsing (pdf-parse)
- `packages/analysis/src/parsers/textParser.ts` — Enhance text normalization
- `packages/analysis/src/heuristics/typingAnalysis.ts` — Implement typing vs pasting detection
- `packages/analysis/src/heuristics/citationAnalysis.ts` — Implement citation extraction
- `packages/analysis/src/heuristics/originalityAnalysis.ts` — Implement risk signal detection
- `apps/worker/src/jobs/analyzeDocumentJob.ts` — Call real parsers instead of placeholder

**Steps:**
1. Install parsing libraries: `mammoth` (docx), `pdf-parse` (pdf)
2. Implement `DocxParser.parse()` to extract text from .docx
3. Implement `PdfParser.parse()` to extract text from .pdf
4. Update `analyzeDocumentJob.ts` to call real parsers
5. Implement citation extraction (regex + pattern matching)
6. Implement typing/pasting heuristics (pattern analysis)
7. Implement basic originality risk signals
8. Wire all into the placeholder processing pipeline

**Completion Criteria:**
- DOCX files are parsed and text is extracted
- PDF files are parsed and text is extracted
- Citations are extracted from text
- Typing patterns are analyzed
- Result data is structured for receipt assembly
- Phase 5 placeholder processing fully replaced

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. ~~Phase 4: Document Ingestion~~ ✅ DONE
4. ~~Phase 5: Analysis Job System~~ ✅ DONE
5. Phase 6: Document Parsing + Analysis V1 (current)
6. Phase 7: Receipt Generation — Build receipt UI and logic

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
