import arcjet, {
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  shield,
  slidingWindow,
} from "@arcjet/next";


// Base Arcjet client with shield protection
export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"],
  rules: [
    // Protect against common attacks with Arcjet Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
});

// Email validation options
export const emailOptions = {
  mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
  // Block emails that are disposable, invalid, or have no MX records
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

// Bot detection options
export const botOptions = {
  mode: "LIVE",
  // configured with a list of bots to allow from
  // https://arcjet.com/bot-list
  allow: [], // prevents bots from submitting the form
} satisfies BotOptions;

// Bot detection options that allow SEO crawlers
export const seoFriendlyBotOptions = {
  mode: "LIVE",
  // Allow search engine crawlers for SEO discovery
  // See: https://arcjet.com/bot-list for full list
  allow: [
    "CATEGORY:SEARCH_ENGINE", // Google, Bing, DuckDuckGo, Yandex, Baidu, etc.
  ],
} satisfies BotOptions;

// Rate limit options for signup
export const signupRateLimitOptions = {
  mode: "LIVE",
  interval: "2m", // counts requests over a 2 minute sliding window
  max: 5, // allows 5 submissions within the window
} satisfies SlidingWindowRateLimitOptions<[]>;

// Signup protection options
export const signupOptions = {
  email: emailOptions,
  bots: botOptions,
  // It would be unusual for a form to be submitted more than 5 times in 2
  // minutes from the same IP address
  rateLimit: signupRateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

// Rate limit options for signin (prevent brute force)
export const signinRateLimitOptions = {
  mode: "LIVE",
  interval: "15m", // counts requests over a 15 minute sliding window
  max: 10, // allows 10 attempts within the window
} satisfies SlidingWindowRateLimitOptions<[]>;

// Arcjet client for chat API
export const chatAj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip", "userId"],
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: 10, // 10 requests per minute per user
    }),
  ],
});

// General API rate limiting (for proxy level)
export const generalRateLimit = slidingWindow({
  mode: "LIVE",
  interval: "1m",
  max: 100, // 100 requests per minute per IP
});
