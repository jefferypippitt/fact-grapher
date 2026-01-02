import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Fact Grapher",
  description:
    "Read the Terms of Service for Fact Grapher, the AI-powered infographic generator platform.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Fact Grapher",
    description:
      "Read the Terms of Service for Fact Grapher, the AI-powered infographic generator platform.",
    url: "/terms",
    type: "website",
  },
  twitter: {
    title: "Terms of Service | Fact Grapher",
    description:
      "Read the Terms of Service for Fact Grapher, the AI-powered infographic generator platform.",
  },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-6 px-4 py-8 md:py-12">
      <header className="space-y-2">
        <h1 className="font-bold text-xl tracking-tight sm:text-2xl md:text-3xl">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Last updated: January 2, 2026
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          1. Acceptance of Terms
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          By accessing or using Fact Grapher ("the Service"), you agree to be
          bound by these Terms of Service. If you do not agree to these terms,
          please do not use the Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          2. Description of Service
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Fact Grapher is an AI-powered platform that generates infographics
          based on user input. The Service allows users to create visual content
          by providing topics, data, or descriptions which our AI transforms
          into professional infographics.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          3. User Accounts
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          To access certain features of the Service, you must create an account.
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account. You agree to notify us immediately of any unauthorized use of
          your account.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          4. Acceptable Use
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          You agree not to use the Service to:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm leading-relaxed md:text-base">
          <li>Generate content that is illegal, harmful, or offensive</li>
          <li>Infringe on the intellectual property rights of others</li>
          <li>Spread misinformation or create deceptive content</li>
          <li>Attempt to reverse engineer or exploit the Service</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          5. Intellectual Property
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Content you create using the Service belongs to you, subject to the
          underlying intellectual property rights of any third-party materials.
          Fact Grapher retains all rights to the Service, including its
          technology, branding, and proprietary features.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          6. Payment and Tokens
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Certain features of the Service require payment or the use of tokens.
          All purchases are final and non-refundable unless otherwise required
          by law. Token balances may expire as specified at the time of
          purchase.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          7. Limitation of Liability
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          The Service is provided "as is" without warranties of any kind. Fact
          Grapher shall not be liable for any indirect, incidental, special, or
          consequential damages arising from your use of the Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          8. Changes to Terms
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          We reserve the right to modify these Terms of Service at any time.
          Continued use of the Service after changes constitutes acceptance of
          the updated terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          9. Contact Us
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          If you have questions about these Terms of Service, please reach out
          via DM on{" "}
          <Link
            className="text-primary underline"
            href="https://x.com/jefferypippitt"
            rel="noopener noreferrer"
            target="_blank"
          >
            @jefferypippitt
          </Link>
          .
        </p>
      </section>

      <hr className="border-border" />

      <p className="text-muted-foreground text-sm">
        See also:{" "}
        <Link className="text-primary underline" href="/privacy">
          Privacy Policy
        </Link>
      </p>
    </article>
  );
}
