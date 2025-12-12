import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-8">
      <div className="max-w-4xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-semibold text-2xl">
            Start creating infographics in seconds
          </h2>
          <p className="max-w-2xl text-muted-foreground text-sm">
            Try Fact Grapher now—see your first visual before your next meeting.
            No design tools or long setup required.
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">Start Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
