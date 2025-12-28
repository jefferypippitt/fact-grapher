import ip from "@arcjet/ip";
import { detectBot } from "@arcjet/next";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { aj, botOptions, generalRateLimit } from "@/lib/arcjet";

export async function proxy(request: NextRequest) {
  // Extract IP address for rate limiting
  const requestIp = ip(request) || "127.0.0.1";

  // Apply general rate limiting and bot protection using withRule()
  const decision = await aj
    .withRule(detectBot(botOptions))
    .withRule(generalRateLimit)
    .protect(request, {
      userId: requestIp, // Use IP as userId for unauthenticated requests
    });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    if (decision.reason.isBot()) {
      return NextResponse.json(
        { error: "Bot detected. Access denied." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Forward Arcjet headers for client-side integration
  const response = NextResponse.next();
  response.headers.set("X-Arcjet-Id", decision.id);

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    // Skip static assets and Next.js internal routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
