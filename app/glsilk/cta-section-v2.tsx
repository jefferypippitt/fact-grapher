"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./cta-section-v2.css";
import { NeuroNoise } from "@paper-design/shaders-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* ─── Read shader colours from CSS variables ─── */

function getShaderColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    colorFront: s.getPropertyValue("--cta2-shader-front").trim(),
    colorMid: s.getPropertyValue("--cta2-shader-mid").trim(),
    colorBack: s.getPropertyValue("--cta2-shader-back").trim(),
  };
}

export function CtaSectionV2({
  className,
  ...props
}: React.ComponentProps<"section">) {
  const [mounted, setMounted] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [palette, setPalette] = useState({
    colorFront: "#a3d4c7",
    colorMid: "#5ea896",
    colorBack: "#e0f0eb",
  });

  useEffect(() => {
    setMounted(true);
    setPalette(getShaderColors());

    const observer = new MutationObserver(() => setPalette(getShaderColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className={cn("cta2-section", className)} {...props}>
      <div className="cta2-container">
        <div className="cta2-card">
          {/* Shader Background */}
          <div className="cta2-shader-container">
            {mounted ? (
              <NeuroNoise
                brightness={0.15}
                className="cta2-shader"
                colorBack={palette.colorBack}
                colorFront={palette.colorFront}
                colorMid={palette.colorMid}
                contrast={0.35}
                scale={1.2}
                speed={0.18}
              />
            ) : null}
          </div>

          {/* Content */}
          <div className="cta2-content">
            <div className="cta2-text-group">
              <h2 className="cta2-headline">
                Ready to create your <span>next infographic?</span>
              </h2>
            </div>

            <div className="cta2-actions">
              <Button
                asChild
                className="cta2-btn rounded-full"
                size="lg"
                variant="default"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button
                className="cta2-btn rounded-full"
                onClick={() => setIsDemoOpen(true)}
                size="lg"
                variant="outline"
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog onOpenChange={setIsDemoOpen} open={isDemoOpen}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogTitle className="sr-only">Product Demo Video</DialogTitle>
          <div className="aspect-video w-full">
            {!!isDemoOpen && (
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
