"use client";

import Link from "next/link";
import { useState } from "react";
import "./cta-section-v1.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function CallToAction() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section className="cta1-section px-6 py-16 sm:py-20 md:px-10">
      <div className="cta1-card">
        <header className="cta1-header">
          <h2 className="cta1-headline">
            Ready to create your next infographic?
          </h2>
          <p className="cta1-subtext">
            Start generating in seconds. No subscription required.
          </p>
        </header>

        <div className="cta1-actions">
          <Button asChild className="rounded-full" size="lg" variant="default">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button
            className="rounded-full"
            onClick={() => setIsDemoOpen(true)}
            size="lg"
            variant="outline"
          >
            See How It Works
          </Button>
        </div>
      </div>

      <Dialog onOpenChange={setIsDemoOpen} open={isDemoOpen}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogTitle className="sr-only">Product Demo Video</DialogTitle>
          <div className="aspect-video w-full">
            {isDemoOpen ? (
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full"
                src="https://www.youtube.com/embed/r1O29kQTx-0?autoplay=1"
                title="Product Demo"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
