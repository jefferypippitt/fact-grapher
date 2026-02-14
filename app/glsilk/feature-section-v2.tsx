"use client";

import "./feature-section-v2.css";
import { cn } from "@/lib/utils";

export function FeatureSectionV2({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const features = [
    {
      title: "Instant Creation",
      description:
        "Enter a topic and get a complete infographic in moments. Structure, layout, and styling are handled for you so you can focus on the message.",
      visual: "bolt",
      span: true,
    },
    {
      title: "Verified Sources",
      description:
        "Each output includes cited references. Check the supporting data with clear attribution before you share.",
      visual: "lock",
      span: false,
    },
    {
      title: "Clear Visual Structure",
      description:
        "Charts, hierarchy, and spacing are selected automatically so complex information is easy to scan.",
      visual: "radial",
      span: false,
    },
    {
      title: "Any Topic, Anywhere",
      description:
        "From history timelines to market trends, create visuals for almost any subject and export for decks, reports, or social posts.",
      visual: "globe",
      span: false,
    },
    {
      title: "Prompt First Workflow",
      description:
        "Skip the design learning curve. Type what you need and get a finished result with no templates or manual layout.",
      visual: "noconfig",
      span: false,
    },
  ];

  return (
    <div
      className={cn(
        "fsv2-container relative w-full overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="flex w-full flex-col items-center px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="w-full max-w-5xl">
          <header
            className="fsv2-header fsv2-animate mb-14 sm:mb-16"
            style={{ animationDelay: "0s" }}
          >
            <h2 className="fsv2-heading text-foreground">
              Everything You Need to Make Facts Stick
            </h2>
            <p className="fsv2-description text-muted-foreground">
              Build visuals that are clear, credible, and shareable with
              automatic searching.
            </p>
          </header>

          <div className="fsv2-bento">
            {features.map((feature, index) => (
              <article
                className={cn(
                  "fsv2-card fsv2-animate",
                  feature.span ? "fsv2-card-wide" : ""
                )}
                key={feature.title}
                style={{
                  animationDelay: `${0.1 + index * 0.07}s`,
                }}
              >
                <div
                  aria-hidden="true"
                  className={cn("fsv2-visual", `fsv2-visual-${feature.visual}`)}
                >
                  {/* Blazing Fast — Lightning Bolt */}
                  {feature.visual === "bolt" && (
                    <>
                      <span className="fsv2-bolt-glow" />
                      <span className="fsv2-bolt" />
                    </>
                  )}
                  {/* Vault Security — Lock Rings */}
                  {feature.visual === "lock" && (
                    <>
                      <span className="fsv2-lock fsv2-lock-1" />
                      <span className="fsv2-lock fsv2-lock-2" />
                      <span className="fsv2-lock fsv2-lock-3" />
                      <span className="fsv2-lock-center" />
                    </>
                  )}
                  {/* Live Analytics — Radial Chart */}
                  {feature.visual === "radial" && (
                    <>
                      <span className="fsv2-radial" />
                      <span className="fsv2-radial-hole" />
                      <span className="fsv2-radial-dot" />
                    </>
                  )}
                  {/* Global Edge — Wireframe Globe */}
                  {feature.visual === "globe" && (
                    <>
                      <span className="fsv2-globe fsv2-globe-outer" />
                      <span className="fsv2-globe fsv2-globe-m1" />
                      <span className="fsv2-globe fsv2-globe-m2" />
                      <span className="fsv2-globe-eq" />
                      <span className="fsv2-globe-dot" />
                    </>
                  )}
                  {/* Zero Config — Circle with Slash */}
                  {feature.visual === "noconfig" && (
                    <>
                      <span className="fsv2-noconfig-circle" />
                      <span className="fsv2-noconfig-slash" />
                    </>
                  )}
                </div>
                <div className="fsv2-card-text">
                  <h3 className="fsv2-card-title text-foreground">
                    {feature.title}
                  </h3>
                  <p className="fsv2-card-desc text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
