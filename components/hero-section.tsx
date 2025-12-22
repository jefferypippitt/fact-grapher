"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { FeatureCard } from "@/components/feature-card";
import { WatchHowItWorksButton } from "@/components/youtube-demo";

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

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43_758.5453;
  return x - Math.floor(x);
};

const getInitialPosition = (
  index: number,
  imageSize: number,
  totalCards: number
) => {
  const angle = (index / totalCards) * Math.PI * 2;
  const seed1 = index * 0.1;
  const seed2 = index * 0.2;
  const seed3 = index * 0.3;
  const radius = 300 + seededRandom(seed1) * 150;
  const x = Math.cos(angle) * radius + (seededRandom(seed2) - 0.5) * 200;
  const y = Math.sin(angle) * radius + (seededRandom(seed3) - 0.5) * 200;
  return {
    x: x - imageSize / 2,
    y: y - imageSize / 2,
    rotation: (seededRandom(seed1 + seed2) - 0.5) * 45,
  };
};

const getFinalPosition = (index: number, imageSize: number) => {
  const centerIndex = 2;
  const offsetFromCenter = index - centerIndex;
  const baseX = offsetFromCenter * 80;

  const archHeight = 60;
  const baseY = (offsetFromCenter * offsetFromCenter * archHeight) / 4;

  const rotation = offsetFromCenter * 8;

  return {
    x: baseX - imageSize / 2,
    y: baseY - imageSize / 2,
    rotation,
    zIndex: 10 - Math.abs(offsetFromCenter),
  };
};

export function HeroSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalPages = Math.ceil(gallery.length / CARDS_PER_PAGE);
  const startIndex = currentPage * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentGallery = gallery.slice(startIndex, endIndex);

  useEffect(() => {
    if (typeof window !== "undefined" && audioRef.current === null) {
      audioRef.current = new Audio("/paper-slide.mp3");
      audioRef.current.volume = 0.3;
      audioRef.current.preload = "auto";
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
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

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-semibold text-2xl text-foreground md:text-3xl">
          <span className="text-primary">AI-Powered</span> Infographics In
          Seconds
        </h1>
      </motion.div>

      <div className="-mt-4 relative h-[400px] w-full max-w-4xl overflow-visible px-4 sm:h-[400px]">
        {currentGallery.map((item, index) => {
          const imageSize = 200;
          const initial = getInitialPosition(index, imageSize, CARDS_PER_PAGE);
          const final = getFinalPosition(index, imageSize);
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
                duration: 1.2,
                delay: index * 0.1,
                ease: [0.33, 1, 0.68, 1],
                scale: {
                  duration: 0.3,
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
                className={`h-2 rounded-full transition-all ${
                  currentPage === pageNumber
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted hover:bg-muted-foreground/50"
                }`}
                key={`pagination-dot-page-${pageNumber}`}
                onClick={() => {
                  setHoveredIndex(null);
                  setHasAnimated(true);
                  setIsTransitioning(true);
                  setCurrentPage(pageNumber);
                  // Re-enable hover sounds after animation completes
                  // Account for max delay (last card: 0.4s) + duration (1.2s) = 1.6s
                  setTimeout(() => {
                    setIsTransitioning(false);
                  }, 1600);
                }}
                type="button"
              />
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <WatchHowItWorksButton delay={0.4} />
      </div>
    </div>
  );
}
