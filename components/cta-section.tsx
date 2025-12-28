import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-8">
      <div className="max-w-4xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-semibold text-2xl md:text-3xl">
            Start Creating <span className="text-primary">Infographics</span>{" "}
            Now
          </h2>
          <p className="max-w-2xl text-muted-foreground text-sm md:text-base">
            No long setup required.
          </p>
          <Button asChild size="default">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
