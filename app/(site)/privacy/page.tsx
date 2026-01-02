import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Fact Grapher",
  description:
    "Read the Privacy Policy for Fact Grapher. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Fact Grapher",
    description:
      "Read the Privacy Policy for Fact Grapher. Learn how we collect, use, and protect your personal information.",
    url: "/privacy",
    type: "website",
  },
  twitter: {
    title: "Privacy Policy | Fact Grapher",
    description:
      "Read the Privacy Policy for Fact Grapher. Learn how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-6 px-4 py-8 md:py-12">
      <header className="space-y-2">
        <h1 className="font-bold text-xl tracking-tight sm:text-2xl md:text-3xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Last updated: January 2, 2026
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          1. Introduction
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Fact Grapher ("we", "our", or "us") is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our AI-powered infographic
          generation service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          2. Information We Collect
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm leading-relaxed md:text-base">
          <li>
            <strong className="text-foreground">Account Information:</strong>{" "}
            Name, email address, and password when you create an account
          </li>
          <li>
            <strong className="text-foreground">Content Data:</strong> Topics,
            descriptions, and other inputs you provide to generate infographics
          </li>
          <li>
            <strong className="text-foreground">Payment Information:</strong>{" "}
            Billing details processed through our secure payment providers
          </li>
          <li>
            <strong className="text-foreground">Usage Data:</strong> Information
            about how you interact with our Service
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          3. How We Use Your Information
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          We use the information we collect to:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm leading-relaxed md:text-base">
          <li>Provide, maintain, and improve our Service</li>
          <li>Process transactions and manage your account</li>
          <li>Generate infographics based on your inputs</li>
          <li>Send you updates, security alerts, and support messages</li>
          <li>Analyze usage patterns to enhance user experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          4. Data Storage and Security
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. Your data is stored on secure
          servers and transmitted using encryption protocols.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          5. Data Sharing
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          We do not sell your personal information. We may share your
          information with:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm leading-relaxed md:text-base">
          <li>
            <strong className="text-foreground">Service Providers:</strong>{" "}
            Third-party vendors who assist in operating our Service
          </li>
          <li>
            <strong className="text-foreground">Legal Requirements:</strong>{" "}
            When required by law or to protect our rights
          </li>
          <li>
            <strong className="text-foreground">Business Transfers:</strong> In
            connection with a merger, acquisition, or sale of assets
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          6. Cookies and Tracking
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          We use cookies and similar tracking technologies to enhance your
          experience, analyze usage, and assist in our marketing efforts. You
          can control cookie preferences through your browser settings.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          7. Your Rights
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Depending on your location, you may have the right to:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm leading-relaxed md:text-base">
          <li>Access and receive a copy of your personal data</li>
          <li>Rectify inaccurate or incomplete information</li>
          <li>Request deletion of your personal data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          8. Children's Privacy
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Our Service is not intended for children under 13 years of age. We do
          not knowingly collect personal information from children under 13. If
          we learn we have collected such information, we will take steps to
          delete it.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          9. Changes to This Policy
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          10. Contact Us
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          If you have questions about this Privacy Policy or our data practices,
          please reach out via DM on{" "}
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
        <Link className="text-primary underline" href="/terms">
          Terms of Service
        </Link>
      </p>
    </article>
  );
}
