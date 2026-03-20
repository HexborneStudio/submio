# Next Step

> Exactly one next recommended task

---

## TASK: Run Internal Testing (Soft Launch)

**Objective:** Validate all MVP flows with 3-5 internal testers before any external launch.

**Next Steps:**
1. Distribute internal-test-plan.md to testers
2. Each tester runs through the test cases
3. Record bugs in bug-triage.md (BUG-001, BUG-002, etc.)
4. Record feedback in feedback-log.md
5. Fix any BLOCKER or HIGH severity bugs
6. Re-assess launch readiness score

**Verification:**
- MVP readiness score moves toward 8/10 or higher
- All HIGH severity tests pass

---

## Previous TASK: Phase 13 - Post-MVP Planning

**Objective:** Plan the next set of features beyond the MVP core. Review what's been built, identify the highest-leverage next features, and define the Phase 13 scope.

**Dependencies:**
- Phase 12: Hardening (current phase) — completing

**Key areas to consider:**
1. **Educator dashboard** — educators need a way to see receipts submitted by students, track review status, flag suspicious work
2. **Organization/team accounts** — multiple users per institution, shared settings
3. **Institution workflows** — school-wide settings, integrations
4. **LMS integrations** — Canvas, Blackboard, Moodle, Google Classroom
5. **Advanced source analysis** — citation databases, plagiarism detection integration
6. **Collaboration features** — shared documents, team analysis
7. **Storage cleanup job** — delete orphaned uploaded files

**Steps:**
1. Review current backlog items and prioritize by user value vs. implementation complexity
2. Define scope for Phase 13 (target: 3-5 features)
3. Create implementation plan with clear acceptance criteria
4. Begin with highest-leverage feature

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. ~~Phase 4: Document Ingestion~~ ✅ DONE
4. ~~Phase 5: Analysis Job System~~ ✅ DONE
5. ~~Phase 6: Document Parsing + Analysis V1~~ ✅ DONE
6. ~~Phase 7: Receipt Generation~~ ✅ DONE
7. ~~Phase 8: Share + Educator Review~~ ✅ DONE
8. ~~Phase 9: PDF Export~~ ✅ DONE
9. ~~Phase 10: Admin Tools~~ ✅ DONE
10. ~~Phase 11: Product Polish~~ ✅ DONE
11. ~~Phase 12: Hardening~~ ✅ DONE
12. Soft Launch Prep ✅ DONE
13. Internal Testing (current)

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
