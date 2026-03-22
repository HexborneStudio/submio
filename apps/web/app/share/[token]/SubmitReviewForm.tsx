'use client';
import { useState } from "react";

interface Props {
  receiptId: string;
  sharedLinkId?: string;
}

export function SubmitReviewForm({ receiptId, sharedLinkId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Read status directly from the form element — avoids React state race conditions
    const form = e.currentTarget as HTMLFormElement;
    const status = (form.elements.namedItem("status") as HTMLSelectElement)?.value;
    const finalName = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim();
    const finalEmail = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    const finalNote = (form.elements.namedItem("note") as HTMLTextAreaElement)?.value?.trim();

    if (!finalName || !finalNote) {
      setError("Name and review note are required.");
      return;
    }

    if (!status || !["PENDING", "REVIEWED", "NEEDS_FOLLOW_UP", "FLAGGED"].includes(status)) {
      setError("Please select a valid review status.");
      return;
    }

    const payload: Record<string, string> = {
      reviewerName: finalName,
      reviewerEmail: finalEmail || "",
      status,
      note: finalNote,
      receiptId,
    };

    // Only include sharedLinkId if it's defined (it may not be for direct receipt access)
    if (sharedLinkId) {
      payload.sharedLinkId = sharedLinkId;
    }

    const res = await fetch("/api/share/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = "Failed to submit review. Please try again.";
      try {
        const data = await res.json();
        if (data?.error) msg = data.error;
      } catch {}
      setError(msg);
      return;
    }

    setSubmitted(true);
    // Use full reload to re-fetch server data from scratch
    window.location.reload();
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
        <p className="text-green-800 font-medium">Review submitted!</p>
        <p className="text-green-600 text-sm mt-1">Thank you for your feedback.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="reviewer-name" className="block text-xs font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="reviewer-name"
            type="text"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Dr. Smith"
            required
          />
        </div>
        <div>
          <label htmlFor="reviewer-email" className="block text-xs font-medium text-gray-700 mb-1">
            Email <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="reviewer-email"
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="smith@university.edu"
          />
        </div>
      </div>

      <div>
        <label htmlFor="review-status" className="block text-xs font-medium text-gray-700 mb-1">
          Review Status <span className="text-red-500">*</span>
        </label>
        <select
          id="review-status"
          name="status"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          defaultValue="REVIEWED"
        >
          <option value="REVIEWED">Reviewed — Looks good</option>
          <option value="NEEDS_FOLLOW_UP">Needs Follow-up — Has questions</option>
          <option value="FLAGGED">Flagged — Needs attention</option>
          <option value="PENDING">Pending — Needs deeper review</option>
        </select>
      </div>

      <div>
        <label htmlFor="review-note" className="block text-xs font-medium text-gray-700 mb-1">
          Review Note <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-note"
          name="note"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={4}
          placeholder="Share your observations about this receipt..."
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Submit Review
      </button>
    </form>
  );
}
