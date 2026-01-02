import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | AI Generated Infographics Platform",
  description:
    "Learn about Fact Grapher, the AI-powered platform that transforms complex ideas into beautiful, professional infographics in seconds. Create AI generated infographics instantly with our automated infographic maker.",
  keywords: [
    "ai generated infographics",
    "ai infographic generator",
    "ai infographic maker",
    "ai infographic creator",
    "generate infographics with ai",
    "artificial intelligence infographics",
    "infographic generator",
    "infographic maker",
    "infographic creator",
    "infographic builder",
    "infographic design tool",
    "automatic infographic generator",
    "automated infographic maker",
    "instant infographic creator",
    "online infographic maker",
    "free infographic generator",
    "create infographics online",
    "make infographics online",
    "ai data visualization",
    "ai chart maker",
    "ai diagram generator",
    "ai timeline generator",
    "ai visual content creator",
    "ai graphics generator",
    "infographics for presentations",
    "infographics for social media",
    "educational infographics",
    "marketing infographics",
    "business infographics",
    "research infographics",
    "create infographics from text",
    "turn text into infographics",
    "text to infographic ai",
    "generate infographics automatically",
    "best ai infographic tool",
    "easy infographic maker",
    "quick infographic generator",
    "professional infographic creator",
    "fact grapher",
    "about fact grapher",
    "fact grapher infographics",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Fact Grapher",
    description:
      "Learn about Fact Grapher, the AI-powered platform that transforms complex ideas into beautiful, professional infographics in seconds.",
    url: "/about",
    type: "website",
  },
  twitter: {
    title: "About Fact Grapher",
    description:
      "Learn about Fact Grapher, the AI-powered platform that transforms complex ideas into beautiful, professional infographics in seconds.",
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-6 px-4 py-8 md:py-12">
      <header className="space-y-2">
        <h1 className="font-bold text-xl tracking-tight sm:text-2xl md:text-3xl">
          About Fact Grapher
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base lg:text-lg">
          Transforming complex information into stunning visual stories with the
          power of AI.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          Our Mission
        </h2>

        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          At Fact Grapher, we believe everyone deserves the ability to
          communicate complex ideas through beautiful visuals. Traditional
          infographic creation typically requires expensive design software,
          specialized skills, and hours of tedious work. We set out to change
          that.
        </p>

        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Our AI-powered platform analyzes your topic, gathers relevant data,
          and generates professional-quality infographics in seconds instead of
          hours. Whether you're a student preparing a presentation, a marketer
          crafting social media content, or a researcher visualizing data, Fact
          Grapher makes infographic creation accessible to everyone.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          How It Works
        </h2>

        <ol className="list-inside list-decimal space-y-3 text-muted-foreground text-sm leading-relaxed md:text-base">
          <li>
            <strong className="text-foreground">Share Your Idea:</strong>{" "}
            Describe your topic and choose your preferred visual style. Our AI
            understands context and nuance.
          </li>
          <li>
            <strong className="text-foreground">AI Creates Your Visual:</strong>{" "}
            Our intelligent system researches your topic, structures the
            information, and designs the perfect layout.
          </li>
          <li>
            <strong className="text-foreground">Download and Share:</strong>{" "}
            Review your finished infographic and download it instantly for
            presentations, reports, or social media.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          Who Uses Fact Grapher?
        </h2>

        <ul className="list-inside list-disc space-y-3 text-muted-foreground text-sm leading-relaxed md:text-base">
          <li>
            <strong className="text-foreground">Educators and Students</strong>{" "}
            who want engaging visual aids for lectures, research papers, and
            classroom presentations.
          </li>
          <li>
            <strong className="text-foreground">Content Creators</strong> who
            need shareable infographics for blogs, social media, and YouTube
            thumbnails.
          </li>
          <li>
            <strong className="text-foreground">
              Marketers and Businesses
            </strong>{" "}
            looking for professional visuals for reports, campaigns, and client
            presentations.
          </li>
          <li>
            <strong className="text-foreground">
              Researchers and Analysts
            </strong>{" "}
            who want to transform complex data into understandable visual
            narratives and timelines.
          </li>
        </ul>
      </section>

      <hr className="border-border" />

      <section className="space-y-4">
        <h2 className="font-semibold text-lg tracking-tight md:text-xl">
          Ready to Create Your First Infographic?
        </h2>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">See Examples</Link>
          </Button>
        </div>
      </section>
    </article>
  );
}
