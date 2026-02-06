"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { FeatureCard } from "@/components/feature-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Background } from "./background";

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
    const startX = -300; // Start off-screen to the left
    const offsetX = index * 15; // Slight stagger
    return {
      x: startX + offsetX - imageSize / 2,
      y: -imageSize / 2,
      rotation: -15 + index * 3, // Slight rotation variation
    };
  }
  // Cards start from the right side and move left
  const startX = 300; // Start off-screen to the right
  const offsetX = index * 15; // Slight stagger
  return {
    x: startX - offsetX - imageSize / 2,
    y: -imageSize / 2,
    rotation: 15 - index * 3, // Slight rotation variation
  };
};

type LayoutConfig = {
  spreadFactor: number; // How much cards spread apart (percentage of card size)
  archHeight: number; // Height of the arc
  rotationFactor: number; // How much cards rotate
};

const getFinalPosition = (
  index: number,
  imageSize: number,
  totalCards: number,
  layout: LayoutConfig
) => {
  const centerIndex = Math.floor(totalCards / 2);
  const offsetFromCenter = index - centerIndex;

  // Ribbon spread: cards fan out in an arc
  // Use layout config for responsive spacing
  const spreadDistance = offsetFromCenter * (imageSize * layout.spreadFactor);
  const baseY = (offsetFromCenter * offsetFromCenter * layout.archHeight) / 4;

  // Rotation increases as cards spread outward
  const rotation = offsetFromCenter * layout.rotationFactor;

  // Higher index values are on top (1 over 0, 2 over 1, 3 over 2, etc.)
  // This ensures cards on the right are above cards on the left for easy sequential hovering
  return {
    x: spreadDistance - imageSize / 2,
    y: baseY - imageSize / 2,
    rotation,
    zIndex: 10 + index, // Higher index = higher z-index, so cards stack left to right
  };
};

type GalleryCardProps = {
  item: { alt: string; src: string };
  index: number;
  animationDirection: "left-to-right" | "right-to-left";
  hasAnimated: boolean;
  isHovered: boolean;
  isSelected: boolean;
  isTransitioning: boolean;
  selectedIndex: number | null;
  layout: LayoutConfig;
  cardSize: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
};

function GalleryCard({
  item,
  index,
  animationDirection,
  hasAnimated,
  isHovered,
  isSelected,
  isTransitioning,
  selectedIndex,
  layout,
  cardSize,
  onHoverStart,
  onHoverEnd,
  onClick,
}: GalleryCardProps) {
  const initial = getInitialPosition(index, cardSize, animationDirection);
  const final = getFinalPosition(index, cardSize, CARDS_PER_PAGE, layout);

  let scale = 1;
  if (isSelected) {
    scale = 1.8;
  } else if (isHovered) {
    scale = 1.05;
  }

  let delay = index * 0.05;
  if (selectedIndex !== null) {
    delay = 0;
  } else if (animationDirection === "right-to-left") {
    delay = (CARDS_PER_PAGE - 1 - index) * 0.05;
  }

  const initialState = hasAnimated
    ? {
        x: initial.x,
        y: initial.y,
        rotate: initial.rotation,
        scale: 0.8,
        opacity: 0,
      }
    : { x: final.x, y: final.y, rotate: final.rotation, scale: 1, opacity: 1 };

  // When selected, use fixed positioning to center on viewport
  const positionClass = isSelected
    ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    : "absolute top-1/2 left-1/2";

  // Idle state: no hover, no selection - show wave animation
  const isIdle = !isHovered && selectedIndex === null && !isTransitioning;

  // Wave animation: subtle up-down motion with staggered timing
  const waveAmplitude = 8; // pixels to move up/down
  const getWaveY = () => {
    if (isSelected) {
      return 0;
    }
    if (isIdle) {
      return [final.y, final.y - waveAmplitude, final.y];
    }
    return final.y;
  };
  const waveY = getWaveY();

  return (
    <motion.div
      animate={{
        x: isSelected ? 0 : final.x,
        y: waveY,
        rotate: isSelected ? 0 : final.rotation,
        scale,
        opacity: 1,
      }}
      className={`${positionClass} h-[180px] w-[180px] cursor-pointer overflow-hidden rounded-xl shadow-lg transition-shadow sm:h-[220px] sm:w-[220px] md:h-[260px] md:w-[260px]`}
      initial={initialState}
      onClick={onClick}
      onHoverEnd={onHoverEnd}
      onHoverStart={onHoverStart}
      style={{
        zIndex: isSelected ? 100 : final.zIndex,
        transformOrigin: "center center",
        pointerEvents: isTransitioning ? "none" : "auto",
      }}
      transition={{
        duration: isSelected || selectedIndex === null ? 0.5 : 0.7,
        delay,
        ease: [0.33, 1, 0.68, 1],
        scale: {
          duration: isSelected ? 0.5 : 0.2,
          ease: [0.33, 1, 0.68, 1],
        },
        // Wave animation config - only applies when idle
        y: isIdle
          ? {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
              delay: index * 0.15, // Stagger: each card starts 150ms after the previous
            }
          : {
              duration: 0.5,
              ease: [0.33, 1, 0.68, 1],
            },
      }}
    >
      <div className="relative h-full w-full">
        <FeatureCard imageAlt={item.alt} imageSrc={item.src} />
      </div>
    </motion.div>
  );
}

const AUTOPLAY_INTERVAL = 5000; // 5 seconds between page changes

export default function HeroSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "left-to-right" | "right-to-left"
  >("left-to-right");
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const swooshAudioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Responsive layout configuration
  // Mobile: tighter spread, flatter arc, less rotation so all 5 cards fit
  // Desktop: more spread, higher arc, more rotation for dramatic effect
  const layout: LayoutConfig = isMobile
    ? { spreadFactor: 0.25, archHeight: 12, rotationFactor: 4 }
    : { spreadFactor: 0.6, archHeight: 25, rotationFactor: 6 };

  // Card size matches the responsive CSS classes
  const cardSize = isMobile ? 180 : 260;

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

  // Close selected card on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedIndex !== null) {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const totalPages = Math.ceil(gallery.length / CARDS_PER_PAGE);

  // Autoplay: cycle through pages automatically
  useEffect(() => {
    // Don't autoplay if paused, transitioning, card selected, or hovering
    if (
      isPaused ||
      isTransitioning ||
      selectedIndex !== null ||
      hoveredIndex !== null
    ) {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    autoplayTimerRef.current = setTimeout(() => {
      // Go to next page, or wrap to first page
      const nextPage = (currentPage + 1) % totalPages;
      const direction =
        nextPage > currentPage ? "right-to-left" : "left-to-right";

      setHasAnimated(true);
      setIsTransitioning(true);
      setAnimationDirection(direction);
      setCurrentPage(nextPage);
      setTimeout(() => setIsTransitioning(false), 900);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [
    currentPage,
    isPaused,
    isTransitioning,
    selectedIndex,
    hoveredIndex,
    totalPages,
  ]);

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
    <div className="relative mx-auto flex h-[calc(100svh-8rem)] max-w-4xl flex-col items-center justify-center gap-6 px-4 md:gap-8">
      <Background />
      <div className="text-center">
        <h1 className="font-semibold text-3xl text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          <span>AI-Powered Infographics In Seconds</span>
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground sm:text-lg md:text-xl">
          Turn complex ideas into beautiful visuals instantly.
        </p>
      </div>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: Mouse handlers pause gallery animation (UX enhancement, not interactive) */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Same as above */}
      <div
        className="-mt-4 sm:-mt-6 md:-mt-8 relative h-[340px] w-full max-w-4xl overflow-visible px-4 sm:h-[380px] md:h-[440px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {currentGallery.map((item, index) => (
          <GalleryCard
            animationDirection={animationDirection}
            cardSize={cardSize}
            hasAnimated={hasAnimated}
            index={index}
            isHovered={hoveredIndex === index}
            isSelected={selectedIndex === index}
            isTransitioning={isTransitioning}
            item={item}
            key={`${item.src}-page-${currentPage}-idx-${index}`}
            layout={layout}
            onClick={() => {
              if (selectedIndex === index) {
                setSelectedIndex(null);
              } else {
                playSwooshSound();
                setSelectedIndex(index);
                setHoveredIndex(null);
              }
            }}
            onHoverEnd={() => {
              if (selectedIndex === null) {
                setHoveredIndex(null);
              }
            }}
            onHoverStart={() => {
              if (selectedIndex === null) {
                setHoveredIndex(index);
                playHoverSound();
              }
            }}
            selectedIndex={selectedIndex}
          />
        ))}

        {/* Backdrop for selected card */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 cursor-pointer bg-black/60 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              aria-label={`Go to page ${index + 1}`}
              className="group relative p-1"
              disabled={isTransitioning || selectedIndex !== null}
              key={`page-dot-${gallery[index * CARDS_PER_PAGE]?.src ?? index}`}
              onClick={() => {
                if (
                  index !== currentPage &&
                  selectedIndex === null &&
                  !isTransitioning
                ) {
                  playSwooshSound();
                  setHoveredIndex(null);
                  setHasAnimated(true);
                  setIsTransitioning(true);
                  setAnimationDirection(
                    index > currentPage ? "right-to-left" : "left-to-right"
                  );
                  setCurrentPage(index);
                  setTimeout(() => setIsTransitioning(false), 900);
                }
              }}
              type="button"
            >
              <span
                className={`block size-2 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? "scale-125 bg-primary"
                    : "bg-primary/30 group-hover:bg-primary/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
