import "./hero-section-v1.css";
import { Rocket } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSectionV1({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative w-full", className)} {...props}>
      {/* Content */}
      <div className="flex w-full flex-col items-center justify-center px-6 pt-24 pb-16 md:px-10 md:pt-32 md:pb-20">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center space-y-8 text-center">
          {/* Badge */}
          <Badge className="rounded-full" variant="secondary">
            <Rocket className="size-4" />
            <span>Now Generating Smarter Visuals</span>
          </Badge>

          {/* Main Heading */}
          <h1 className="hero-heading text-foreground">
            Turn Events Into Shareable Visual Stories
          </h1>

          {/* Description */}
          <p className="hero-description text-muted-foreground">
            Go from one idea to a finished visual people understand at a glance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-8 sm:flex-row">
            <Button
              asChild
              className="hero-cta-button rounded-full"
              size="lg"
              variant="default"
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <Button
              asChild
              className="hero-cta-button rounded-full"
              size="lg"
              variant="outline"
            >
              <Link href="/gallery">Explore Gallery</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
