# Backlog

---

## NOW (Current Phase)

### Phase 3: Auth + App Shell
- [ ] Install auth dependencies
- [ ] Create auth API routes for magic link
- [ ] Implement email sending (mock in MVP)
- [ ] Add session management
- [ ] Create auth middleware
- [ ] Update dashboard with real data
- [ ] Add user menu / sign-out
- [ ] Gate admin routes by role

---

## NEXT (Queued)

### Phase 2 (Prerequisite — apply schema)
- [ ] Apply schema to database (npm run db:push)
- [ ] Generate Prisma client
- [ ] Verify connection

### Phase 4: Document Ingestion
- [ ] Create document API routes
- [ ] Implement file upload flow
- [ ] Implement paste text flow
- [ ] Set up storage integration
- [ ] Add file validation
- [ ] Create version tracking

### Phase 4: Document Ingestion
- [ ] Create document API routes
- [ ] Implement file upload flow
- [ ] Implement paste text flow
- [ ] Set up storage integration
- [ ] Add file validation
- [ ] Create version tracking

### Phase 5: Analysis Job System
- [ ] Set up Redis
- [ ] Configure BullMQ queues
- [ ] Build worker job runner
- [ ] Create job status tracking
- [ ] Implement retry logic
- [ ] Add failure handling

---

## LATER (Planned)

### Phase 6: Document Parsing + Analysis V1
- [ ] Implement DOCX parser
- [ ] Implement PDF parser
- [ ] Build text normalization
- [ ] Add structure detection
- [ ] Create citation extraction
- [ ] Build typing/pasting heuristics
- [ ] Implement authorship signals

### Phase 7: Receipt Generation
- [ ] Design receipt data model
- [ ] Build receipt assembly service
- [ ] Create receipt UI
- [ ] Implement receipt sections
- [ ] Add summary blocks
- [ ] Build evidence notes
- [ ] Add caution language

### Phase 8: Share + Educator Review
- [ ] Create signed share links
- [ ] Build public receipt view
- [ ] Implement educator review form
- [ ] Add review status tracking
- [ ] Create review notes

### Phase 9: PDF Export
- [ ] Build printable receipt view
- [ ] Implement PDF generation
- [ ] Create export history

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
- [ ] Educator dashboard - waiting for Phase 2-10
- [ ] Organization/team accounts - waiting for Phase 2-10
- [ ] Institution workflows - waiting for Phase 2-10
- [ ] LMS integrations - waiting for Phase 2-10
- [ ] Advanced source analysis - waiting for Phase 6
- [ ] Collaboration features - future consideration
