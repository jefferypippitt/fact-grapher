"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { FeatureCard } from "@/components/feature-card";
import YoutubeDemo from "@/components/youtube-demo";

const gallery = [
  {
    alt: "Timeline infographic of the end of World War II",
    src: "/infographic-end-of-world-war-2.png",
  },
  {
    alt: "Timeline infographic of the history of the Roman Empire",
    src: "/infographic-history-of-the-roman-empire.png",
  },
  {
    alt: "Timeline infographic of the fall of the Mongol Empire",
    src: "/infographic-the-fall-of-the-mongol-empire.png",
  },
  {
    alt: "Statistical infographic of global renewable energy",
    src: "/infographic-global-renewable-energy.png",
  },
  {
    alt: "Infographic of the coffee bean lifecycle",
    src: "/infographic-coffee-bean-lifecycle.png",
  },
  {
    alt: "Infographic of the animal kingdom",
    src: "/infographic-animal-kingdom.png",
  },
  {
    alt: "Infographic about Bitcoin",
    src: "/infographic-bitcoin.png",
  },
  {
    alt: "Infographic of human population",
    src: "/infographic-human-population.png",
  },
  {
    alt: "Infographic comparing Nvidia vs Intel",
    src: "/infographic-nvidia-vs-intel.png",
  },
  {
    alt: "Infographic about World War 3",
    src: "/infographic-ww3.png",
  },
];

const CARDS_PER_PAGE = 5;

const getInitialPosition = (
  index: number,
  imageSize: number,
  direction: "left-to-right" | "right-to-left"
) => {
  if (direction === "left-to-right") {
    // Cards start from the left side and move right
    const startX = -400; // Start off-screen to the left
    const offsetX = index * 20; // Slight stagger
    return {
      x: startX + offsetX - imageSize / 2,
      y: -imageSize / 2,
      rotation: -15 + index * 3, // Slight rotation variation
    };
  }
  // Cards start from the right side and move left
  const startX = 400; // Start off-screen to the right
  const offsetX = index * 20; // Slight stagger
  return {
    x: startX - offsetX - imageSize / 2,
    y: -imageSize / 2,
    rotation: 15 - index * 3, // Slight rotation variation
  };
};

const getFinalPosition = (
  index: number,
  imageSize: number,
  totalCards: number
) => {
  const centerIndex = Math.floor(totalCards / 2);
  const offsetFromCenter = index - centerIndex;

  // Ribbon spread: cards fan out in an arc with generous spacing to prevent overlap
  const spreadDistance = offsetFromCenter * 140; // Increased spacing to prevent overlap
  const archHeight = 35; // Reduced arch height for flatter, more accessible spread
  const baseY = (offsetFromCenter * offsetFromCenter * archHeight) / 4;

  // Rotation increases as cards spread outward
  const rotation = offsetFromCenter * 7; // Reduced rotation for cleaner look

  // Higher index values are on top (1 over 0, 2 over 1, 3 over 2, etc.)
  // This ensures cards on the right are above cards on the left for easy sequential hovering
  return {
    x: spreadDistance - imageSize / 2,
    y: baseY - imageSize / 2,
    rotation,
    zIndex: 10 + index, // Higher index = higher z-index, so cards stack left to right
  };
};

export default function HeroSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "left-to-right" | "right-to-left"
  >("left-to-right");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const swooshAudioRef = useRef<HTMLAudioElement | null>(null);

  const totalPages = Math.ceil(gallery.length / CARDS_PER_PAGE);
  const startIndex = currentPage * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentGallery = gallery.slice(startIndex, endIndex);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (audioRef.current === null) {
        audioRef.current = new Audio("/paper-slide.mp3");
        audioRef.current.volume = 0.3;
        audioRef.current.preload = "auto";
      }
      if (swooshAudioRef.current === null) {
        swooshAudioRef.current = new Audio("/swoosh.mp3");
        swooshAudioRef.current.volume = 0.2;
        swooshAudioRef.current.preload = "auto";
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (swooshAudioRef.current) {
        swooshAudioRef.current.pause();
        swooshAudioRef.current = null;
      }
    };
  }, []);

  const playHoverSound = () => {
    // Don't play sound during page transitions
    if (isTransitioning) {
      return;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Silently handle playback errors (browsers may block autoplay)
      });
    }
  };

  const playSwooshSound = () => {
    if (swooshAudioRef.current) {
      swooshAudioRef.current.currentTime = 0;
      swooshAudioRef.current.play().catch(() => {
        // Silently handle playback errors (browsers may block autoplay)
      });
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4">
      <div className="text-center">
        <h1 className="font-semibold text-2xl text-foreground md:text-3xl lg:text-4xl">
          <span>AI-Powered Infographics In Seconds</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground text-sm md:text-base">
          Turn complex ideas into beautiful visuals instantly.
        </p>
      </div>

      <div className="-mt-4 relative h-[400px] w-full max-w-4xl overflow-visible px-4 sm:h-[400px]">
        {currentGallery.map((item, index) => {
          const imageSize = 200;
          const initial = getInitialPosition(
            index,
            imageSize,
            animationDirection
          );
          const final = getFinalPosition(index, imageSize, CARDS_PER_PAGE);
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              animate={{
                x: final.x,
                y: final.y,
                rotate: final.rotation,
                scale: isHovered ? 1.05 : 1,
                opacity: 1,
                zIndex: isHovered ? 20 : final.zIndex,
              }}
              className="absolute top-1/2 left-1/2 h-[200px] w-[200px] cursor-pointer overflow-hidden rounded-xl shadow-lg transition-shadow sm:h-[240px] sm:w-[240px]"
              initial={
                hasAnimated
                  ? {
                      x: initial.x,
                      y: initial.y,
                      rotate: initial.rotation,
                      scale: 0.8,
                      opacity: 0,
                    }
                  : {
                      x: final.x,
                      y: final.y,
                      rotate: final.rotation,
                      scale: 1,
                      opacity: 1,
                    }
              }
              key={`${item.src}-page-${currentPage}-idx-${index}`}
              onHoverEnd={() => setHoveredIndex(null)}
              onHoverStart={() => {
                setHoveredIndex(index);
                playHoverSound();
              }}
              style={{
                transformOrigin: "center center",
                pointerEvents: isTransitioning ? "none" : "auto",
              }}
              transition={{
                duration: 0.7,
                delay:
                  animationDirection === "right-to-left"
                    ? (CARDS_PER_PAGE - 1 - index) * 0.05
                    : index * 0.05,
                ease: [0.33, 1, 0.68, 1],
                scale: {
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
            >
              <div className="relative h-full w-full">
                <FeatureCard imageAlt={item.alt} imageSrc={item.src} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, pageIndex) => {
            const pageNumber = pageIndex;
            return (
              <button
                aria-label={`Go to page ${pageNumber + 1}`}
                className={`h-3 rounded-full transition-all ${
                  currentPage === pageNumber
                    ? "w-10 bg-primary"
                    : "w-3 bg-muted hover:bg-muted-foreground/50"
                }`}
                key={`pagination-dot-page-${pageNumber}`}
                onClick={() => {
                  // Only play sound and transition if navigating to a different page
                  if (pageNumber !== currentPage) {
                    playSwooshSound();
                    setHoveredIndex(null);
                    setHasAnimated(true);
                    setIsTransitioning(true);

                    // Determine direction: forward (higher page) = right-to-left, backward = left-to-right
                    const direction =
                      pageNumber > currentPage
                        ? "right-to-left"
                        : "left-to-right";
                    setAnimationDirection(direction);

                    setCurrentPage(pageNumber);
                    // Re-enable hover sounds after animation completes
                    // Account for max delay (last card: 0.2s) + duration (0.7s) = 0.9s
                    setTimeout(() => {
                      setIsTransitioning(false);
                    }, 900);
                  }
                }}
                type="button"
              />
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <YoutubeDemo />
      </div>
    </div>
  );
}
