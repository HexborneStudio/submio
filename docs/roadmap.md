# Roadmap

> Last updated: 2026-03-19

## Phase 0: Project Control Layer
**Goal:** Create system so the project never loses state.

- [x] Monorepo scaffold
- [x] Project management files
- [ ] Product spec documentation
- [ ] Technical architecture documentation
- [ ] Database specification
- [ ] API specification

---

## Phase 1: Monorepo Foundation
**Goal:** Valid running monorepo with placeholder apps.

- [x] Repo scaffold
- [x] Workspace config
- [x] Root scripts
- [x] Web app scaffold
- [x] Admin app scaffold
- [x] Worker app scaffold
- [x] DB package
- [x] Shared package
- [x] Analysis package
- [x] Config package
- [x] Infra folders (Docker, Nginx)
- [x] Starter docs

---

## Phase 2: Data Model
**Goal:** Database foundation for all entities.

- [ ] Prisma schema
- [ ] Database enums
- [ ] Core tables
- [ ] Migrations
- [ ] DB seed placeholders

---

## Phase 3: Auth + App Shell
**Goal:** Users can sign in and reach dashboard.

- [ ] Login/signup flow
- [ ] Magic link auth
- [ ] Protected dashboard shell
- [ ] User settings
- [ ] Base navigation
- [ ] Admin access scaffold

---

## Phase 4: Document Ingestion
**Goal:** User can create document and submit content.

- [ ] Create document
- [ ] Upload document
- [ ] Paste text flow
- [ ] Storage integration
- [ ] File validation
- [ ] Version creation

---

## Phase 5: Analysis Job System
**Goal:** Submitted documents processed asynchronously.

- [ ] Redis queue setup
- [ ] Worker job runner
- [ ] Analysis job creation
- [ ] Job status tracking
- [ ] Retry/failure handling

---

## Phase 6: Document Parsing + Analysis V1
**Goal:** System produces structured analysis data.

- [ ] Parse docx
- [ ] Parse pdf
- [ ] Normalize extracted text
- [ ] Detect basic structure
- [ ] Extract simple citations
- [ ] Heuristic indicators
- [ ] Typing vs pasting estimation
- [ ] Authorship signal model v1

---

## Phase 7: Receipt Generation
**Goal:** Full in-app authorship receipt.

- [ ] Receipt data model
- [ ] Receipt assembly service
- [ ] Receipt UI
- [ ] Receipt sections
- [ ] Summary status blocks
- [ ] Evidence notes
- [ ] Confidence/caution language

---

## Phase 8: Share + Educator Review
**Goal:** Student can share, educator can review.

- [ ] Signed share link
- [ ] Public receipt view
- [ ] Educator review form
- [ ] Review status
- [ ] Review notes

---

## Phase 9: PDF Export
**Goal:** Receipt can be exported as PDF.

- [ ] Printable receipt view
- [ ] PDF generation service
- [ ] Export history

---

## Phase 10: Admin Tools
**Goal:** Internal control layer for support and trust.

- [ ] Admin login gate
- [ ] User lookup
- [ ] Receipt lookup
- [ ] Job inspection
- [ ] Support logs
- [ ] Audit views

---

## Phase 11: Product Polish
**Goal:** Usable product shell.

- [ ] Landing page
- [ ] Pricing page
- [ ] Onboarding
- [ ] Error states
- [ ] Loading states
- [ ] Empty states
- [ ] Analytics hooks

---

## Phase 12: Hardening
**Goal:** Production-ready MVP.

- [ ] Rate limiting
- [ ] File security
- [ ] Storage cleanup
- [ ] Monitoring hooks
- [ ] Environment validation
- [ ] Test coverage on core paths
- [ ] Docker and Nginx production config

---

## Phase 13: Post-MVP
**Future phases (not in initial scope):**

- [ ] Educator dashboard
- [ ] Organization/team accounts
- [ ] Institution workflows
- [ ] LMS integrations
- [ ] Advanced source analysis
- [ ] Collaboration features
