import ip from "@arcjet/ip";
import {
  type ArcjetDecision,
  detectBot,
  protectSignup,
  slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { type NextRequest, NextResponse } from "next/server";
import {
  aj,
  botOptions,
  signinRateLimitOptions,
  signupOptions,
} from "@/lib/arcjet";
import { auth } from "@/lib/auth";

async function protect(req: NextRequest): Promise<ArcjetDecision> {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  // If the user is logged in we'll use their ID as the identifier. This
  // allows limits to be applied across all devices and sessions (you could
  // also use the session ID). Otherwise, fall back to the IP address.
  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || "127.0.0.1"; // Fall back to local IP if none
  }

  // If this is a signup then use the special protectSignup rule
  // See https://docs.arcjet.com/signup-protection/quick-start
  if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
    // Better-Auth reads the body, so we need to clone the request preemptively
    const body = await req
      .clone()
      .json()
      .catch(() => ({}));

    // If the email is in the body of the request then we can run
    // the email validation checks as well. See
    // https://www.better-auth.com/docs/concepts/hooks#example-enforce-email-domain-restriction
    if (typeof body.email === "string") {
      return aj
        .withRule(protectSignup(signupOptions))
        .protect(req, { email: body.email, userId });
    }
    // Otherwise use rate limit and detect bot
    return aj
      .withRule(detectBot(botOptions))
      .withRule(slidingWindow(signupOptions.rateLimit))
      .protect(req, { userId });
  }
  if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
    // For signin, apply rate limiting and bot detection
    return aj
      .withRule(detectBot(botOptions))
      .withRule(slidingWindow(signinRateLimitOptions))
      .protect(req, { userId });
  }
  // For all other auth requests
  return aj.withRule(detectBot(botOptions)).protect(req, { userId });
}

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

// Wrap the POST handler with Arcjet protections
export const POST = async (req: NextRequest) => {
  const decision = await protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          code: "RATE_LIMIT",
        },
        { status: 429 }
      );
    }
    if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid. Is there a typo?";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "We do not allow disposable email addresses.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message =
          "Your email domain does not have an MX record. Is there a typo?";
      } else {
        // This is a catch all, but the above should be exhaustive based on the
        // configured rules.
        message = "Invalid email.";
      }

      return NextResponse.json(
        { error: message, code: "INVALID_EMAIL" },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        error: "Access denied.",
        code: "FORBIDDEN",
      },
      { status: 403 }
    );
  }

  return authHandlers.POST(req);
};
