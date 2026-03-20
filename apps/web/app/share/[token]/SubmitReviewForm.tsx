'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  receiptId: string;
  sharedLinkId: string;
}

export function SubmitReviewForm({ receiptId, sharedLinkId }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("REVIEWED");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !note.trim()) {
      setError("Name and review note are required.");
      return;
    }

    const res = await fetch("/api/share/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewerName: name, reviewerEmail: email, status, note, receiptId, sharedLinkId }),
    });

    if (!res.ok) {
      setError("Failed to submit review. Please try again.");
      return;
    }

    setSubmitted(true);
    router.refresh();

    // Track educator review submission (analytics scaffold)
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] educator_review_submitted", { receiptId });
    }
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Your Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            placeholder="Dr. Smith"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            placeholder="smith@university.edu"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Review Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="REVIEWED">Reviewed — Looks good</option>
          <option value="NEEDS_FOLLOW_UP">Needs Follow-up — Has questions</option>
          <option value="FLAGGED">Flagged — Needs attention</option>
          <option value="PENDING">Pending — Needs deeper review</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Review Note *</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
          rows={4}
          placeholder="Share your observations about this receipt..."
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700"
      >
        Submit Review
      </button>
    </form>
  );
}
