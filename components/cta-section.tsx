import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-4 rounded-4xl border bg-card px-4 py-8 shadow-sm md:py-10 dark:bg-card/50">
      <div className="space-y-1">
        <h2 className="text-center font-semibold text-lg tracking-tight md:text-2xl">
          Start Creating Your Infographic Today.
        </h2>
        <p className="text-balance text-center text-muted-foreground text-sm md:text-base">
          No long setup required
        </p>
      </div>
      <div className="flex items-center justify-center">
        <Button asChild className="shadow">
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
