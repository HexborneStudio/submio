# UX Fixes Document — 2026-03-20

## Overview

This document outlines UX improvements needed for the Authorship Receipt MVP. These are non-critical enhancements that improve user experience but are not blockers for deployment.

---

## Empty State Improvements

### 1. Documents List Empty State
**Location:** `apps/web/app/(app)/documents/page.tsx`
**Current:** Likely shows no documents without context
**Improvement:** Add empty state with CTA to create first document
```
┌─────────────────────────────────────────┐
│                                         │
│   📄  No documents yet                  │
│                                         │
│   Upload a document or paste text      │
│   to get started with your first        │
│   authorship receipt.                   │
│                                         │
│   [+ Create your first document]        │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Receipt Page - No Receipt Yet
**Location:** `apps/web/app/(app)/documents/[documentId]/receipt/page.tsx`
**Current:** Likely shows 404 or empty state
**Improvement:** Show processing state if document is PROCESSING
```
┌─────────────────────────────────────────┐
│   🔄 Analyzing your document...         │
│                                         │
│   This usually takes 30-60 seconds.     │
│   The page will automatically update    │
│   when your receipt is ready.           │
│                                         │
│   [View document]                       │
└─────────────────────────────────────────┘
```

### 3. Share Page - No Reviews Yet
**Location:** `apps/web/app/share/[token]/page.tsx`
**Current:** Shows reviews section empty or with no context
**Improvement:** Add friendly empty state for first review
```
┌─────────────────────────────────────────┐
│   📝 Be the first to review            │
│                                         │
│   As an educator, you can provide       │
│   feedback on this authorship receipt.  │
│                                         │
│   [Submit Review]                       │
└─────────────────────────────────────────┘
```

---

## Loading State Gaps

### 1. Document List Loading
**Issue:** No skeleton loader for documents list
**Fix:** Add `LoadingSkeleton` component while fetching documents
```typescript
// In documents/page.tsx
if (isLoading) {
  return (
    <div className="space-y-4">
      <LoadingSkeleton count={5} />
    </div>
  );
}
```

### 2. Receipt Loading
**Issue:** No loading state while fetching receipt
**Fix:** Show skeleton while receipt is loading
```typescript
// In receipt/page.tsx
if (!receipt) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 rounded-lg" />
      <div className="h-64 bg-gray-200 rounded-lg" />
    </div>
  );
}
```

### 3. Share Page Loading
**Issue:** No loading state while validating share token
**Fix:** Add loading spinner overlay
```typescript
// Show while validating
if (isValidating) {
  return <PageLoader text="Validating share link..." />;
}
```

---

## Error Message Improvements

### 1. Generic Error Messages
**Current:** "Something went wrong" is too vague
**Improvement:** Contextual error messages
```
❌ Instead of:
   "Something went wrong"

✅ Use:
   "Unable to create document. Please try again."
   "Unable to process your file. The format may not be supported."
   "Unable to generate receipt. Please ensure your document has content."
```

### 2. Form Validation Errors
**Location:** All form inputs
**Improvement:** Show inline validation errors
```
┌─────────────────────────────────────────┐
│ Document Title                          │
│ ┌─────────────────────────────────────┐ │
│ │ My Document                         │ │
│ └─────────────────────────────────────┘ │
│ ⚠️ Title must be at least 3 characters  │
└─────────────────────────────────────────┘
```

### 3. Share Link Errors
**Current:** Basic error messages in share page
**Improvement:** Friendly, actionable messages
```
❌ Instead of:
   "Invalid Link"

✅ Use:
   "This link isn't working"
   "Links expire after 30 days. Ask the student for a new link."
```

---

## Button/CTA Improvements

### 1. Primary CTA Visibility
**Issue:** CTAs may not stand out enough
**Improvement:** Ensure primary actions are prominent
```
✅ Use:
- Full-width buttons on mobile
- Contrasting colors (primary blue/green)
- Clear iconography
- Descriptive labels: "Create Receipt" not just "Submit"
```

### 2. Secondary Actions
**Issue:** Secondary actions blend in
**Improvement:** Differentiate with style
```
Primary:   [ + Upload Document ]     (solid, primary color)
Secondary: [ Paste Text Instead ]    (outline, gray)
```

### 3. Loading States on Buttons
**Issue:** Buttons don't show loading state
**Improvement:** Disable and show spinner during submission
```typescript
<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Spinner className="w-4 h-4" />
      Creating...
    </>
  ) : (
    <>
      <PlusIcon className="w-4 h-4" />
      Create Document
    </>
  )}
</Button>
```

---

## Receipt Readability Issues

### 1. Dense Information Display
**Issue:** Receipt sections may be too information-dense
**Improvement:** Progressive disclosure
```
Before: Show all sections expanded
After:  Accordion-style sections, overview visible by default
```

### 2. Confidence Badge Clarity
**Current:** Simple badge with color
**Improvement:** Add explanation tooltip
```
┌─────────────────────────────────────────┐
│ 🟢 HIGH CONFIDENCE                    ⓘ │
│                                         │
│ Your document shows strong indicators   │
│ of original authorship.                 │
└─────────────────────────────────────────┘
        ↓ (hover/tap for explanation)
   Confidence is calculated based on...
```

### 3. Disclaimer Prominence
**Issue:** Legal disclaimer buried at bottom
**Improvement:** Make it visible but not alarming
```
⚠️ This receipt provides evidence-based indicators only.
   It does not constitute a definitive judgment.
   [Learn more about how this works]
```

---

## Share Page Issues

### 1. Missing Context on Arrival
**Issue:** Users may not know what they're looking at
**Improvement:** Add header explaining the receipt
```
┌─────────────────────────────────────────┐
│ 🎓 Educator Review                       │
│                                         │
│ [Student Name] has shared their          │
│ authorship receipt for your review.      │
│                                         │
│ This receipt analyzes writing patterns   │
│ and citation behavior.                   │
└─────────────────────────────────────────┘
```

### 2. Review Form Complexity
**Issue:** Form may be intimidating for educators
**Improvement:** Simplify and guide
```
Step 1: Review the receipt above
Step 2: Select a status:
  ○ Looks good
  ○ Needs follow-up
  ○ Has concerns
Step 3: Add optional notes
Step 4: Submit
```

### 3. Status Labels Clarity
**Current:** PENDING, REVIEWED, NEEDS_FOLLOW_UP, FLAGGED
**Improvement:** More descriptive labels
```
PENDING          → "Awaiting Review"
REVIEWED         → "Looks Good"
NEEDS_FOLLOW_UP  → "Needs Discussion"
FLAGGED          → "Has Concerns"
```

---

## Mobile Responsiveness

### 1. Document Upload on Mobile
**Issue:** File picker may not work well on mobile
**Improvement:** Provide clear mobile instructions
```
On mobile:
1. Tap the upload button
2. Select from Files app or Photos
3. Wait for upload to complete

Supported: PDF, DOCX (max 10MB)
```

### 2. Receipt Display on Mobile
**Issue:** Tables/grids may break on mobile
**Improvement:** Stack content vertically
```
Desktop:    | Label 1     | Label 2     |
Mobile:     | Label 1     |
            | Value       |
            | Label 2     |
            | Value       |
```

---

## Loading/Progress Feedback

### 1. Document Upload Progress
**Issue:** No progress indicator during file upload
**Improvement:** Show upload progress
```
Uploading document.pdf...
████████████░░░░░░░░ 60%
```

### 2. Analysis Progress
**Current:** May show 0% → 100% without intermediate steps
**Improvement:** Show specific stages
```
Analyzing document...
├── Parsing content... ████████░░ 40%
├── Extracting citations... ██████░░░░ 60%
├── Building signals... ████████░░ 80%
└── Generating receipt... ██████████ 100%
```

---

## Internationalization (Future)

These items are noted for future i18n work:
- All user-facing strings should be externalized
- Date/time formatting should use locale
- Error messages should be translated
- Currency formatting for file sizes

---

## Priority Recommendations

### High Priority (MVP launch blockers)
1. ✅ Empty state for documents list
2. ✅ Loading states for main pages
3. ✅ Button loading states
4. ✅ Error message improvements

### Medium Priority (Post-MVP)
1. Receipt accordion/progressive disclosure
2. Mobile upload instructions
3. Share page educator context

### Low Priority (Polish)
1. Confidence badge explanations
2. Review form simplification
3. i18n preparation
