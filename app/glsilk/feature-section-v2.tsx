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
        "Enter a topic and get a complete infographic in moments. Structure, layout, and styling are handled for you so you can focus on the message. Key points are distilled into clear takeaways for your audience, so the final visual feels ready to present.",
      visual: "bolt",
      span: true,
    },
    {
      title: "Verified Sources",
      description:
        "Each output includes cited references. Check the supporting data with clear attribution before you share.",
      visual: "verified",
      span: false,
    },
    {
      title: "Clear Visual Structure",
      description:
        "Charts, hierarchy, and spacing are selected automatically so complex information is easy to scan.",
      visual: "structure",
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
                  index < 2 ? "fsv2-card-top-row" : "",
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
                  <div className="fsv2-visual-inner">
                    {/* 1. BOLT — Blazing Fast */}
                    {feature.visual === "bolt" && (
                      <svg
                        aria-hidden="true"
                        className="fsv2-svg-icon fsv2-svg-bolt"
                        focusable="false"
                        viewBox="0 0 100 100"
                      >
                        <defs>
                          <linearGradient
                            id="bolt-grad"
                            x1="0%"
                            x2="100%"
                            y1="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="currentColor"
                              stopOpacity="0.2"
                            />
                            <stop
                              offset="100%"
                              stopColor="currentColor"
                              stopOpacity="0.8"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          className="fsv2-bolt-path-bg"
                          d="M55 5L15 55H45L35 95L75 45H45L55 5Z"
                          fill="url(#bolt-grad)"
                        />
                        <path
                          className="fsv2-bolt-path"
                          d="M55 5L15 55H45L35 95L75 45H45L55 5Z"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    )}

                    {/* 2. VERIFIED — Source Trust */}
                    {feature.visual === "verified" && (
                      <svg
                        aria-hidden="true"
                        className="fsv2-svg-icon fsv2-svg-verified"
                        focusable="false"
                        viewBox="0 0 100 100"
                      >
                        <defs>
                          <linearGradient
                            id="verified-grad"
                            x1="0%"
                            x2="100%"
                            y1="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="currentColor"
                              stopOpacity="0.14"
                            />
                            <stop
                              offset="100%"
                              stopColor="currentColor"
                              stopOpacity="0.34"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          className="fsv2-verified-path-bg"
                          d="M80 52C80 72 66 82 49.36 87.8A4 4 0 0 1 46.68 87.76C30 82 16 72 16 52V24A4 4 0 0 1 20 20C28 20 38 15.2 44.96 9.12A4.68 4.68 0 0 1 51.04 9.12C58.04 15.24 68 20 76 20A4 4 0 0 1 80 24Z"
                          fill="url(#verified-grad)"
                        />
                        <path
                          className="fsv2-border-trace fsv2-verified-path"
                          d="M80 52C80 72 66 82 49.36 87.8A4 4 0 0 1 46.68 87.76C30 82 16 72 16 52V24A4 4 0 0 1 20 20C28 20 38 15.2 44.96 9.12A4.68 4.68 0 0 1 51.04 9.12C58.04 15.24 68 20 76 20A4 4 0 0 1 80 24Z"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.2"
                        />
                        <path
                          className="fsv2-detail-path fsv2-verified-check"
                          d="M36 48L44 56L60 40"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                        />
                      </svg>
                    )}

                    {/* 3. STRUCTURE — Visual Hierarchy */}
                    {feature.visual === "structure" && (
                      <svg
                        aria-hidden="true"
                        className="fsv2-svg-icon fsv2-svg-structure"
                        focusable="false"
                        viewBox="0 0 100 100"
                      >
                        <defs>
                          <linearGradient
                            id="structure-grad"
                            x1="0%"
                            x2="100%"
                            y1="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="currentColor"
                              stopOpacity="0.12"
                            />
                            <stop
                              offset="100%"
                              stopColor="currentColor"
                              stopOpacity="0.3"
                            />
                          </linearGradient>
                        </defs>
                        <rect
                          className="fsv2-structure-path-bg"
                          fill="url(#structure-grad)"
                          height="54.17"
                          rx="8.33"
                          width="75"
                          x="12.5"
                          y="12.5"
                        />
                        <path
                          className="fsv2-detail-path fsv2-structure-line-lg"
                          d="M8.33 12.5H91.67"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.2"
                        />
                        <path
                          className="fsv2-border-trace fsv2-structure-frame"
                          d="M87.5 12.5V58.33A8.33 8.33 0 0 1 79.17 66.67H20.83A8.33 8.33 0 0 1 12.5 58.33V12.5"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.2"
                        />
                        <path
                          className="fsv2-detail-path fsv2-structure-line-md"
                          d="M29.17 87.5L50 66.67L70.83 87.5"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.4"
                        />
                      </svg>
                    )}

                    {/* 4. ANYWHERE — Global Reach */}
                    {feature.visual === "globe" && (
                      <svg
                        aria-hidden="true"
                        className="fsv2-svg-icon fsv2-svg-anywhere"
                        focusable="false"
                        viewBox="0 0 100 100"
                      >
                        <defs>
                          <linearGradient
                            id="globe-grad"
                            x1="0%"
                            x2="100%"
                            y1="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="currentColor"
                              stopOpacity="0.12"
                            />
                            <stop
                              offset="100%"
                              stopColor="currentColor"
                              stopOpacity="0.3"
                            />
                          </linearGradient>
                        </defs>
                        <circle
                          className="fsv2-anywhere-path-bg"
                          cx="50"
                          cy="50"
                          fill="url(#globe-grad)"
                          r="41.67"
                        />
                        <circle
                          className="fsv2-border-trace fsv2-anywhere-ring"
                          cx="50"
                          cy="50"
                          fill="none"
                          r="41.67"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        />
                        <path
                          className="fsv2-detail-path fsv2-anywhere-meridian"
                          d="M50 8.33a60.42 60.42 0 0 0 0 83.34 60.42 60.42 0 0 0 0-83.34"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                        <path
                          className="fsv2-detail-path fsv2-anywhere-lat"
                          d="M8.33 50H91.67"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2"
                        />
                      </svg>
                    )}

                    {/* 5. PROMPT — Workflow First */}
                    {feature.visual === "noconfig" && (
                      <svg
                        aria-hidden="true"
                        className="fsv2-svg-icon fsv2-svg-prompt"
                        focusable="false"
                        viewBox="0 0 100 100"
                      >
                        <defs>
                          <linearGradient
                            id="prompt-grad"
                            x1="0%"
                            x2="100%"
                            y1="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="currentColor"
                              stopOpacity="0.12"
                            />
                            <stop
                              offset="100%"
                              stopColor="currentColor"
                              stopOpacity="0.32"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          className="fsv2-prompt-path-bg"
                          d="M50.1 52.8C50.8 52.1 51.9 51.8 53 52.3L83 63.9C84.8 64.6 84.7 67.2 82.8 67.8L71.3 71.4C70.2 71.7 69.4 72.5 69.1 73.6L65.5 85.1C64.9 87 62.3 87.1 61.6 85.3L50 55.3C49.6 54.2 49.8 53.4 50.1 52.8Z"
                          fill="url(#prompt-grad)"
                        />
                        <path
                          className="fsv2-border-trace fsv2-prompt-frame"
                          d="M50.1 52.8C50.8 52.1 51.9 51.8 53 52.3L83 63.9C84.8 64.6 84.7 67.2 82.8 67.8L71.3 71.4C70.2 71.7 69.4 72.5 69.1 73.6L65.5 85.1C64.9 87 62.3 87.1 61.6 85.3L50 55.3C49.6 54.2 49.8 53.4 50.1 52.8Z"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.2"
                        />
                        <path
                          className="fsv2-detail-path fsv2-prompt-line-lg"
                          d="M22 72A36 36 0 0 1 58 36"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.4"
                        />
                        <circle
                          className="fsv2-detail-path fsv2-prompt-line-sm"
                          cx="62"
                          cy="34"
                          fill="currentColor"
                          fillOpacity="0.22"
                          r="6"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        />
                        <circle
                          className="fsv2-detail-path fsv2-prompt-line-sm"
                          cx="22"
                          cy="78"
                          fill="currentColor"
                          fillOpacity="0.22"
                          r="6"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        />
                      </svg>
                    )}
                    <div className="fsv2-icon-glow" />
                  </div>
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
