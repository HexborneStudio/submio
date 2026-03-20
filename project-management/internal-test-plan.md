# Internal Test Plan — Authorship Receipt MVP

**Version:** 1.0
**Date:** 2026-03-20
**Scope:** Full end-to-end MVP test
**Testers:** 3-5 internal users

---

## How to Use This Plan

Test each flow below. Mark each test case as:
- ✅ PASS — worked correctly
- ⚠️ PARTIAL — worked but with issues
- ❌ FAIL — did not work
- 🔍 UNTESTED — not yet run

Record specific observations, error messages, or confusion points.

---

## Student Flows

### STU-01: Account Signup
**Steps:**
1. Open web app at http://localhost:3000
2. Click "Sign up"
3. Enter email address
4. Click "Create Account"
5. Check console/dev tools for magic link (dev mode logs it)
6. Click magic link
7. Should redirect to /dashboard

**Expected:** Account created, magic link sent, session active after click
**Severity if fail:** High

---

### STU-02: Create Document (Paste Text)
**Steps:**
1. Logged in as test student
2. Click "Create Document" on dashboard
3. Enter document title: "Test Paper Draft"
4. Select "Paste text"
5. Paste 3+ paragraphs of Lorem Ipsum or real text
6. Click "Create"
7. Should redirect to document detail page

**Expected:** Document created, status shows PENDING or PROCESSING
**Severity if fail:** High

---

### STU-03: Create Document (Upload DOCX)
**Steps:**
1. On documents list, click "Create Document"
2. Select "Upload file"
3. Upload a real .docx file (under 10MB)
4. Enter document title
5. Submit

**Expected:** Document created, file uploaded, status shows PROCESSING
**Severity if fail:** High

---

### STU-04: Create Document (Upload PDF)
**Steps:**
1. Repeat STU-03 but upload a .pdf file

**Expected:** Same as STU-03
**Severity if fail:** High

---

### STU-05: Analysis Job Runs (Paste Flow)
**Steps:**
1. Create document via paste (STU-02)
2. Wait 30-60 seconds
3. Refresh document detail page
4. Check status

**Expected:** Status changes to READY after processing
**Severity if fail:** High

---

### STU-06: Analysis Job Runs (Upload Flow)
**Steps:**
1. Create document via upload (STU-03)
2. Wait 30-60 seconds
3. Refresh document detail page
4. Check status

**Expected:** Status changes to READY
**Severity if fail:** High

---

### STU-07: View Receipt
**Steps:**
1. After analysis completes (STU-05 or STU-06)
2. On document detail page, click "View Receipt"
3. Verify receipt page renders

**Expected:** Receipt page shows all 8 sections, confidence badge, summary
**Severity if fail:** High

---

### STU-08: Receipt Content Verification
**Steps:**
1. View receipt (STU-07)
2. Check that caution/disclaimer appears
3. Check that confidence badge is visible
4. Check that all sections render (overview, parsing, text metrics, citations, sources, structural, confidence, processing)

**Expected:** All sections present, caution box visible
**Severity if fail:** Medium

---

### STU-09: Create Share Link
**Steps:**
1. On receipt page, find "Share with Educator" section
2. Click "Create Share Link"
3. Copy the generated URL

**Expected:** Share link created, URL shown, link appears in list
**Severity if fail:** High

---

### STU-10: Open Shared Receipt (New Browser)
**Steps:**
1. Copy share link from STU-09
2. Open incognito/private browser
3. Paste link and navigate
4. Verify receipt renders in read-only mode

**Expected:** Receipt visible, no edit controls visible to anonymous user
**Severity if fail:** High

---

### STU-11: Educator Submit Review
**Steps:**
1. On shared receipt page (STU-10)
2. Fill in reviewer name: "Test Educator"
3. Leave email blank
4. Select status: "Reviewed — Looks good"
5. Enter note: "Receipt looks complete and well-structured."
6. Click "Submit Review"

**Expected:** Review submitted, confirmation shown
**Severity if fail:** High

---

### STU-12: Educator Review Appears on Shared Page
**Steps:**
1. After STU-11, refresh the shared receipt page
2. Verify review appears at top of page

**Expected:** Review visible with name, status badge, note, timestamp
**Severity if fail:** Medium

---

### STU-13: Export PDF
**Steps:**
1. On receipt page (STU-07), click "Export PDF"
2. Wait for generation
3. Verify PDF downloads

**Expected:** PDF file downloads with receipt content
**Severity if fail:** High

---

### STU-14: View Document History
**Steps:**
1. On document detail page
2. Check for versions list
3. Create a second version (paste new text)
4. Verify both versions appear

**Expected:** Version history visible
**Severity if fail:** Medium

---

### STU-15: Dashboard Empty State
**Steps:**
1. Log in as fresh user with 0 documents
2. Navigate to /dashboard
3. Verify welcome banner appears
4. Verify "Create Your First Document" CTA is visible

**Expected:** Welcome banner + CTA visible
**Severity if fail:** Low

---

### STU-16: Documents Empty State
**Steps:**
1. Log in as fresh user
2. Navigate to /documents
3. Verify empty state with icon and CTA

**Expected:** Empty state shown with action button
**Severity if fail:** Low

---

### STU-17: Logout
**Steps:**
1. Click user menu / logout
2. Verify redirect to home/login
3. Verify session cleared

**Expected:** Logged out, redirected, no access to protected pages
**Severity if fail:** Medium

---

## Educator / Public Flows

### EDU-01: Invalid Share Link
**Steps:**
1. Navigate to /share/invalid-token-123
2. Verify clear error message (not a crash)

**Expected:** "Invalid Link" error shown
**Severity if fail:** Medium

---

### EDU-02: Revoked Share Link
**Steps:**
1. Create share link (STU-09)
2. Go back to main browser, revoke the link
3. Try to open shared link in private browser

**Expected:** "Link Revoked" message shown
**Severity if fail:** Medium

---

### EDU-03: Review Without Auth
**Steps:**
1. Navigate to shared receipt (STU-10)
2. Verify NO login prompt before submitting review
3. Submit review successfully

**Expected:** Review form works without authentication
**Severity if fail:** High

---

## Admin Flows

### ADM-01: Admin Login
**Steps:**
1. Navigate to http://localhost:3002 (admin)
2. Should redirect to /login
3. Enter admin secret from env
4. Click "Access Admin"
5. Verify redirect to admin dashboard

**Expected:** Admin dashboard loads
**Severity if fail:** High

---

### ADM-02: Admin Overview Dashboard
**Steps:**
1. Logged into admin (ADM-01)
2. Verify overview cards render (users, documents, receipts, jobs, etc.)
3. Click on a card to verify navigation works

**Expected:** Cards show counts, navigation works
**Severity if fail:** Medium

---

### ADM-03: Admin Users Page
**Steps:**
1. Navigate to /users
2. Verify user table renders
3. Test search by email

**Expected:** Table loads, search works
**Severity if fail:** Medium

---

### ADM-04: Admin Receipts Page
**Steps:**
1. Navigate to /receipts
2. Verify receipt table renders
3. Verify status badges are visible

**Expected:** Receipts listed with status
**Severity if fail:** Medium

---

### ADM-05: Admin Jobs Page
**Steps:**
1. Navigate to /jobs
2. Verify job table renders
3. Filter by FAILED status

**Expected:** Jobs listed, filter works
**Severity if fail:** Medium

---

### ADM-06: Admin Support Dashboard
**Steps:**
1. Navigate to /support
2. Verify support sections render

**Expected:** Support dashboard loads with failed jobs, reviews, exports
**Severity if fail:** Low

---

### ADM-07: Admin Logout
**Steps:**
1. Click "Sign out" in admin sidebar
2. Verify redirect and session cleared

**Expected:** Logged out, cannot access /admin pages
**Severity if fail:** Medium

---

## Edge Cases and Failure Tests

### EDG-01: Large File Rejection
**Steps:**
1. Try to upload a file over 10MB
2. Verify rejection message

**Expected:** Error message about file size
**Severity if fail:** Medium

---

### EDG-02: Invalid File Type Rejection
**Steps:**
1. Try to upload a .exe or .jpg file
2. Verify rejection

**Expected:** Error about disallowed file type
**Severity if fail:** Medium

---

### EDG-03: Rate Limit Trigger
**Steps:**
1. Rapidly submit 15+ document creations in 1 minute
2. Observe 429 response

**Expected:** Rate limit response after threshold
**Severity if fail:** Low (should be invisible to normal users)

---

### EDG-04: Empty Paste Submission
**Steps:**
1. Create document with empty/whitespace-only content
2. Observe how system handles

**Expected:** Either rejected at validation or processed with warning
**Severity if fail:** Low

---

### EDG-05: Very Long Document
**Steps:**
1. Paste 10,000+ words
2. Submit for analysis
3. Observe whether it completes

**Expected:** Processes successfully or times out gracefully
**Severity if fail:** Medium

---

### EDG-06: Concurrent Analysis Jobs
**Steps:**
1. Upload 3 documents simultaneously (rapid succession)
2. Verify all 3 jobs are enqueued and processed

**Expected:** All 3 complete (may be sequential due to worker concurrency)
**Severity if fail:** Medium

---

## Test Summary

| Test ID | Description | Status | Tester | Date | Notes |
|---------|-------------|--------|--------|-------|-------|
| STU-01 | Account Signup | | | | |
| STU-02 | Create Document (Paste) | | | | |
| STU-03 | Create Document (DOCX) | | | | |
| STU-04 | Create Document (PDF) | | | | |
| STU-05 | Analysis Runs (Paste) | | | | |
| STU-06 | Analysis Runs (Upload) | | | | |
| STU-07 | View Receipt | | | | |
| STU-08 | Receipt Content | | | | |
| STU-09 | Create Share Link | | | | |
| STU-10 | Open Shared Receipt | | | | |
| STU-11 | Educator Submit Review | | | | |
| STU-12 | Review on Shared Page | | | | |
| STU-13 | Export PDF | | | | |
| STU-14 | Version History | | | | |
| STU-15 | Dashboard Empty State | | | | |
| STU-16 | Documents Empty State | | | | |
| STU-17 | Logout | | | | |
| EDU-01 | Invalid Share Link | | | | |
| EDU-02 | Revoked Share Link | | | | |
| EDU-03 | Review Without Auth | | | | |
| ADM-01 | Admin Login | | | | |
| ADM-02 | Admin Overview | | | | |
| ADM-03 | Admin Users | | | | |
| ADM-04 | Admin Receipts | | | | |
| ADM-05 | Admin Jobs | | | | |
| ADM-06 | Admin Support | | | | |
| ADM-07 | Admin Logout | | | | |
| EDG-01 | Large File Rejection | | | | |
| EDG-02 | Invalid File Type | | | | |
| EDG-03 | Rate Limit | | | | |
| EDG-04 | Empty Paste | | | | |
| EDG-05 | Very Long Document | | | | |
| EDG-06 | Concurrent Jobs | | | | |

---

## Pass Criteria for Launch

- ✅ All HIGH severity tests passing
- ✅ No crashes or unhandled errors in normal flows
- ✅ PDF export functional
- ✅ Share link + review functional
- ✅ Admin accessible and functional
- ✅ At least 80% of MEDIUM severity tests passing
