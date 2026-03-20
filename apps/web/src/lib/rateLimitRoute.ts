import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitKey, type RateLimitConfig } from "@/middleware/rateLimit";

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
             || req.headers.get("x-real-ip")
             || "unknown";

    const key = getRateLimitKey(ip, req.nextUrl.pathname);
    const result = rateLimit(key, config);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(result.resetIn / 1000)),
          },
        }
      );
    }

    return handler(req);
  };
}
