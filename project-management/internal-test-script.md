# Internal Test Script — Authorship Receipt MVP

**Version:** 1.0
**Date:** 2026-03-20
**Goal:** Validate MVP with 3-5 real users, capture bugs and confusion

---

## Before Testing Day 1

### Setup
- [ ] Dev environment running: `npm run dev --workspace=apps/worker` + `npm run dev --workspace=apps/web`
- [ ] Redis running: `docker run -d -p 6379:6379 redis:7-alpine`
- [ ] PostgreSQL running (or Docker started)
- [ ] `npm run db:push --workspace=packages/db` applied
- [ ] Admin secret known: `echo $ADMIN_SECRET`
- [ ] This document printed or on second screen
- [ ] `feedback-log.md` open in editor
- [ ] `bug-triage.md` open in editor

### Tester Assignments

| Day | Tester | Type | Flow |
|-----|--------|------|-------|
| Day 1 | Tester A | Student | STU-01 through STU-17 |
| Day 1 | Tester B | Student | STU-01 through STU-17 |
| Day 2 | Tester C | Educator | EDU-01, EDU-02, EDU-03 + open questions |
| Day 2 | You | Admin | ADM-01 through ADM-07 |
| Day 3 | All | Review | Bug fixes + pattern analysis |

---

## Day 1 — Student Flows

### Setup for Tester A
Give Tester A a fresh email address. Sit nearby but not in front of the screen. Tell them:

> "We're testing a new academic tool. I want you to try creating a document receipt. Don't worry if you get confused or stuck — that's the point of the test. I'll only help if you're completely blocked. Go to http://localhost:3000 and try to get to the part where you can see an authorship receipt for a document."

**Do not explain anything unless they are stuck for more than 2 minutes.**

Watch for:
- Hesitation at "Sign up" vs "Sign in"
- Confusion on the landing page
- Uncertainty about what "authorship receipt" means
- How they handle file upload vs paste
- Whether they notice the processing status
- Whether they understand the receipt when they see it

### Observer Notes for Tester A
```
Tester: A
Date:
Time started:
Time ended:
Flow completed fully: Yes / Partial / No

Confusion points observed (exact moments):
1.
2.
3.

Unexpected actions (what they did vs what you expected):
1.

What they said unprompted:
1.

Did they understand the receipt? Yes / Partially / No
Evidence:

Would they actually use this? Why or why not?

Other notes:
```

### Setup for Tester B
Same setup, fresh email. After Tester A is done, brief Tester B with the same instructions.

### Day 1 Wrap-Up
- [ ] Fill out feedback-log.md for Tester A
- [ ] Fill out feedback-log.md for Tester B
- [ ] Transfer any bugs to bug-triage.md
- [ ] Identify the most common confusion points
- [ ] Decide: any immediate fixes before Day 2?

---

## Day 2 — Educator + Admin Flows

### Educator Tester Setup
Give Tester C a shared link to an existing receipt (create one yourself before they arrive). Tell them:

> "A student shared this with you as an educator. Please open it and take a look. Tell me what you think it means and whether you'd find it useful in your work."

**Do not explain the product. Let them interpret it.**

Watch for:
- Whether they read the caution box
- Whether they misunderstand it as a verdict
- Whether the review form feels natural to fill out
- What they ask about the product
- Whether they trust it

### Questions for Educator Tester (ask after they explore freely)

1. "What do you think this document is?"
2. "What stood out to you most?"
3. "Would this be useful in your work? Why or why not?"
4. "What would make you trust this more?"
5. "Did anything feel unclear or misleading?"
6. "What was missing that you'd expect?"

### Observer Notes for Educator Tester
```
Tester: C
Date:
Time started:
Time ended:
Type: Educator / Educator-like reviewer

First interpretation of the receipt (their words):

Did they read the caution box? Yes / No / Skimmed
Did they misunderstand it as a verdict? Yes / No
Evidence:

What did they focus on most?

Did they use the review form? Did it feel natural?

Questions they asked:
1.
2.

Would they use this? Why or why not?

Other observations:
```

### Admin Testing (You)
Run through ADM-01 through ADM-07 yourself. Use the admin dashboard at http://localhost:3002 with `ADMIN_SECRET`.

Check:
- Can you find the test data from Day 1 testers?
- Are the user counts reasonable?
- Are receipts visible with correct status?
- Do failed jobs show meaningful errors?
- Is the support dashboard actionable?
- Is anything obviously broken or missing?

### Day 2 Wrap-Up
- [ ] Fill out feedback-log.md for Tester C
- [ ] Fill out feedback-log.md for admin observations
- [ ] Transfer any bugs to bug-triage.md
- [ ] Identify Day 3 priorities

---

## Day 3 — Pattern Review + Bug Fix Sprint

### Pattern Analysis
Review all feedback entries so far and answer:

1. **Most common confusion point?** ________________
2. **Most common trust issue?** ________________
3. **Receipt comprehension issues?** ________________
4. **Feature that users struggled with most?** ________________

### Bug Fix Criteria
Fix only bugs that:
- Were hit by multiple testers
- Are marked HIGH or BLOCKER severity
- Prevent completing a core flow

Do NOT fix:
- Single-occurrence polish issues
- Cosmetic issues unless severe
- Feature requests

### Day 3 Tasks
- [ ] Review feedback patterns
- [ ] Fix HIGH/BLOCKER bugs
- [ ] Update bug-triage.md with fix status
- [ ] Commit fixes: `git add -A && git commit -m "fix: [brief description]"`

---

## Quick Reference: What to Look For

### Student Tester — Red Flags
- [ ] Hesitates at "authorship receipt" — doesn't understand the concept
- [ ] Doesn't notice or understand the confidence badge
- [ ] Can't find the share link button
- [ ] Doesn't understand that citations are "indicators" not confirmations
- [ ] Thinks the receipt is a verdict
- [ ] Gets confused between "document" and "receipt"
- [ ] Can't find PDF export

### Educator Tester — Red Flags
- [ ] Interprets receipt as a plagiarism verdict
- [ ] Doesn't notice caution box
- [ ] Review form feels awkward or illegitimate
- [ ] Doesn't trust the methodology
- [ ] Asks "who wrote the analysis?" or "is this a blacklist?"
- [ ] Would not actually use this in their course

### Admin Tester — Red Flags
- [ ] Can't find test user data
- [ ] Job errors are unreadable
- [ ] Support dashboard doesn't surface the right info
- [ ] Tables are unreadable on mobile

---

## Post-Session: Filing Feedback

For every observation, ask:
1. Is this a **bug** (something broke) or a **UX issue** (confusing but worked) or a **feature request**?
2. How many testers experienced this?
3. On a scale of 1-3: How much did it block the user? (1 = minor confusion, 3 = completely stuck)

### Feedback Entry Template
```
| YYYY-MM-DD | Tester alias | STU-XX | Bug | High | "Short title" | "What happened" | Fix | You | Open |
```

### Bug Entry Template
```
| BUG-N | Title | Description | Testers affected | Severity | Status | Fix |
| BUG-001 | | | | High | Open | |
```

---

## Success Threshold

The MVP is ready for soft launch when:
- 3/3 testers can create a document without help
- 3/3 testers can explain what the receipt means
- 3/3 testers can create and share a link without confusion
- 0 BLOCKER bugs remain
- ≤ 2 HIGH bugs remain
- Educator tester does NOT interpret it as a verdict
