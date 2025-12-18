import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-8">
      <div className="max-w-4xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-semibold text-2xl">
            Start Creating Infographics Now
          </h2>
          <p className="max-w-2xl text-muted-foreground text-sm">
            No long setup required.
          </p>
          <Button asChild size="default">
            <Link href="/sign-up">Get Started Now!</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
