# Next Step

> Exactly one next recommended task

---

## TASK: Validate Student-First Restructure

**Objective:** Review all updated copy, flows, labels, and summary-first result experience to ensure consistency.

**Next Steps:**
1. Run the verification grep command to catch any remaining old terminology
2. Visually verify the landing page, pricing page, dashboard, documents list
3. Test the summary-first flow on a document with a completed receipt
4. Verify the "Share with Instructor" label appears correctly
5. Ensure all empty states show the new student-first language

**Verification command:**
```bash
cd ~/authorship-receipt
grep -r "educator\|Educator\|Authorship Receipt\|Create Document\|receipt" apps/web/src/app --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".next" | head -30
```

**Success criteria:**
- No instances of "educator" (should be "instructor") in app pages
- No instances of "Authorship Receipt" as primary brand in visible UI
- No instances of "Create Document" as button text
- Summary-first UX visible on document detail page when status is READY

---

## Previous TASK: Student-First Product Restructure (Phase 13)

**Objective:** Reposition the product from educator transparency tool to pre-submission paper checker for students. Presentation layer only, no backend changes.

**Changes made:**
- Landing page rewritten with student-first messaging
- Pricing page updated with student-friendly tiers
- Dashboard shows "Your Papers" with student onboarding
- Document detail page shows summary-first check result
- Receipt page renamed to "Detailed Report"
- Share section updated to "Share with Instructor"
- All terminology aligned (Documents → Papers, Processing → Checking, etc.)

**Dependencies:**
- Phase 12: Hardening (complete)
- Internal testing (pending)

---

## To Run the App

```bash
# 1. Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# 2. Apply schema
npm run db:push --workspace=packages/db
npm run db:generate --workspace=packages/db

# 3. Install all deps
npm install

# 4. Start worker (terminal 1)
npm run dev --workspace=apps/worker

# 5. Start web (terminal 2)
npm run dev --workspace=apps/web
```
