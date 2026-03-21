# Day 1 Test Sessions — Authorship Receipt MVP

**Date:** 2026-03-20
**Testers:** Tester A (Student), Tester B (Student)
**Observer:** DeAngelo
**Goal:** Validate student core flows — signup, document creation, receipt, share, export

---

## BEFORE EACH SESSION

- [ ] `feedback-log.md` open and ready to fill
- [ ] `bug-triage.md` open and ready
- [ ] Timer started at session start
- [ ] Tester given goal statement (see below)

---

## TESTER A — Student Flow

**Given goal:**
> "Go to http://localhost:3000 and try to create an authorship receipt for a document. Use the paste method. Don't ask me questions — just try what makes sense. I'll only help if you're completely stuck."

**Time started:** ___
**Time ended:** ___

### Core Flow Checklist

| Step | What to watch | Pass | Fail | Notes |
|------|---------------|------|------|-------|
| Landing page loads | Does anything confuse them immediately? | ☐ | ☐ | |
| Signs up / signs in | Any hesitation at auth screen? | ☐ | ☐ | |
| Creates document | Finds the button easily? | ☐ | ☐ | |
| Pastes text | Understands what to paste? | ☐ | ☐ | |
| Submits document | Redirected correctly? | ☐ | ☐ | |
| Sees status | Understands PENDING/PROCESSING? | ☐ | ☐ | |
| Waits for receipt | Checks back on their own? | ☐ | ☐ | |
| Opens receipt | All 8 sections visible? | ☐ | ☐ | |
| Reads receipt | Understands what it says? | ☐ | ☐ | |
| Caution box | Does they read / notice it? | ☐ | ☐ | |
| Creates share link | Finds the button? | ☐ | ☐ | |
| Exports PDF | Works correctly? | ☐ | ☐ | |

### Confusion Points
_record exact moments and what the tester said or did_

1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

### Unprompted Tester Comments
1. ________________________________________________
2. ________________________________________________

### Did they understand the receipt?
- [ ] Fully understood
- [ ] Partially understood — specifically: ____________
- [ ] Did not understand

Evidence: ________________________________________________

### Would they actually use this?
- [ ] Yes — reason: ____________
- [ ] No — reason: ____________

### Bugs Observed
| Bug ID | Description | Severity |
|--------|-------------|----------|
| | | |
| | | |

### Feedback to Log
Log in `feedback-log.md` immediately after session.

---

## TESTER B — Student Flow

**Given goal:**
> "Go to http://localhost:3000 and try to create an authorship receipt for a document. This time upload a PDF or Word file instead of pasting. Don't ask me questions — just try what makes sense. I'll only help if you're completely stuck."

**Time started:** ___
**Time ended:** ___

### Core Flow Checklist

| Step | What to watch | Pass | Fail | Notes |
|------|---------------|------|------|-------|
| Landing page loads | Any different hesitation than Tester A? | ☐ | ☐ | |
| Signs up / signs in | | ☐ | ☐ | |
| Creates document | | ☐ | ☐ | |
| Uploads file | Handles file picker easily? | ☐ | ☐ | |
| Submits document | | ☐ | ☐ | |
| Sees status | Understands PROCESSING? | ☐ | ☐ | |
| Waits for receipt | How long before they checked? | ☐ | ☐ | |
| Opens receipt | | ☐ | ☐ | |
| Receipt content | | ☐ | ☐ | |
| Creates share link | | ☐ | ☐ | |
| Exports PDF | | ☐ | ☐ | |

### Confusion Points
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

### Unprompted Tester Comments
1. ________________________________________________
2. ________________________________________________

### Did they understand the receipt?
- [ ] Fully understood
- [ ] Partially understood — specifically: ____________
- [ ] Did not understand

Evidence: ________________________________________________

### Would they actually use this?
- [ ] Yes — reason: ____________
- [ ] No — reason: ____________

### Bugs Observed
| Bug ID | Description | Severity |
|--------|-------------|----------|
| | | |
| | | |

### Feedback to Log
Log in `feedback-log.md` immediately after session.

---

## POST-SESSION SUMMARY (After Both Testers)

### Common Confusion Points
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

### Most Surprising Moment
________________________________________________

### Pattern: Where did both testers struggle?
________________________________________________

### Pattern: Where did both testers sail through?
________________________________________________

### Quick Wins to Fix Before Day 2
1. ________________________________________________
2. ________________________________________________

### Blockers Found
| Bug ID | Issue | Severity | Fix by when |
|--------|-------|----------|-------------|
| | | | |
| | | | |

### Commit After Day 1
```bash
cd ~/authorship-receipt
git add -A && git commit -m "chore: Day 1 internal test feedback"
```
