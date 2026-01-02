import ip from "@arcjet/ip";
import { detectBot } from "@arcjet/next";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { aj, generalRateLimit, seoFriendlyBotOptions } from "@/lib/arcjet";

// Regex for static assets - defined at top level for performance
const STATIC_ASSET_REGEX = /\.(svg|png|jpg|jpeg|gif|webp|ico|mp3|json)$/;

// Determine if the request is from a browser expecting HTML
function isBrowserRequest(request: NextRequest): boolean {
  const accept = request.headers.get("accept") || "";
  const contentType = request.headers.get("content-type") || "";

  // API requests typically have JSON content type or accept headers
  if (contentType.includes("application/json")) {
    return false;
  }
  if (accept.includes("application/json") && !accept.includes("text/html")) {
    return false;
  }

  // Browser requests typically accept HTML
  return accept.includes("text/html") || accept.includes("*/*");
}

type BlockReason = "rate-limit" | "bot" | "forbidden";

// Create redirect URL for blocked page
function createBlockedRedirect(
  request: NextRequest,
  reason: BlockReason
): NextResponse {
  const blockedUrl = new URL("/blocked", request.url);
  blockedUrl.searchParams.set("reason", reason);
  blockedUrl.searchParams.set("return", request.nextUrl.pathname);
  return NextResponse.redirect(blockedUrl);
}

// Handle denied requests - returns appropriate response based on request type
function handleDeniedRequest(
  request: NextRequest,
  reason: BlockReason,
  errorMessage: string,
  statusCode: number
): NextResponse {
  if (isBrowserRequest(request)) {
    return createBlockedRedirect(request, reason);
  }
  return NextResponse.json({ error: errorMessage }, { status: statusCode });
}

export async function proxy(request: NextRequest) {
  // Skip the blocked page itself to prevent redirect loops
  if (request.nextUrl.pathname === "/blocked") {
    return NextResponse.next();
  }

  // Skip static assets and internal Next.js routes
  const pathname = request.nextUrl.pathname;
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    STATIC_ASSET_REGEX.test(pathname);

  if (isStaticAsset) {
    return NextResponse.next();
  }

  // Extract IP address for rate limiting
  const requestIp = ip(request) || "127.0.0.1";

  // Apply general rate limiting and bot protection
  const decision = await aj
    .withRule(detectBot(seoFriendlyBotOptions))
    .withRule(generalRateLimit)
    .protect(request, {
      userId: requestIp,
    });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return handleDeniedRequest(
        request,
        "rate-limit",
        "Too many requests. Please try again later.",
        429
      );
    }

    if (decision.reason.isBot()) {
      return handleDeniedRequest(
        request,
        "bot",
        "Bot detected. Access denied.",
        403
      );
    }

    return handleDeniedRequest(request, "forbidden", "Forbidden", 403);
  }

  // Forward Arcjet headers for client-side integration
  const response = NextResponse.next();
  response.headers.set("X-Arcjet-Id", decision.id);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|json)).*)",
  ],
};
