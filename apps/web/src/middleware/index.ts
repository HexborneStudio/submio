import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitKey, RATE_LIMITS } from "./rateLimit";

type MiddlewareHandler = (req: NextRequest) => NextResponse | Response | Promise<NextResponse | Response>;

function createRateLimitHandler(handler: MiddlewareHandler, limitKey: keyof typeof RATE_LIMITS) {
  return async (req: NextRequest): Promise<NextResponse | Response> => {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
             || req.headers.get("x-real-ip")
             || "unknown";

    const key = getRateLimitKey(ip, limitKey);
    const result = rateLimit(key, RATE_LIMITS[limitKey]);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(result.resetIn / 1000)),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(result.resetIn / 1000)),
          },
        }
      );
    }

    const response = await handler(req);

    if (response instanceof NextResponse) {
      response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    }

    return response;
  };
}

export { createRateLimitHandler };
