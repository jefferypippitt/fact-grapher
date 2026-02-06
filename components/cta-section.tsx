"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function CtaSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Headline */}
        <h2 className="text-balance font-semibold text-2xl tracking-tight sm:text-3xl md:text-4xl">
          Ready To Get Started?
        </h2>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground md:mt-6 md:text-lg">
          No design skills needed. Just describe what you want and let our AI
          handle the rest.
        </p>

        {/* Dual buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-10">
          <Button
            className="rounded-full"
            onClick={() => setOpen(true)}
            size="lg"
            variant="outline"
          >
            See How It Works
          </Button>
          <Button asChild className="rounded-full" size="lg" variant="default">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* YouTube Demo Modal */}
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogTitle className="sr-only">Product Demo Video</DialogTitle>
          <div className="aspect-video w-full">
            {!!open && (
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full"
                src="https://www.youtube.com/embed/vL_NvSo7Lgo?autoplay=1"
                title="Product Demo"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
