import { NextRequest, NextResponse } from "next/server";
import { submitReview } from "@/lib/reviewService";

export async function POST(req: NextRequest) {
  const { reviewerName, reviewerEmail, status, note, receiptId, sharedLinkId, educatorId } = await req.json();

  if (!reviewerName || !status || !note || !receiptId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["PENDING", "REVIEWED", "NEEDS_FOLLOW_UP", "FLAGGED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const review = await submitReview({
    reviewerName,
    reviewerEmail,
    status,
    note,
    receiptId,
    educatorId,
    sharedLinkId,
  });

  return NextResponse.json({ review });
}
