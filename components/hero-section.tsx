"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { FeatureCard } from "@/components/feature-card";

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
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43_758.5453;
  return x - Math.floor(x);
};

const getInitialPosition = (index: number, imageSize: number) => {
  const angle = (index / gallery.length) * Math.PI * 2;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      // Silently handle playback errors (browsers may block autoplay)
      audioRef.current.play().catch(() => {
        // Audio playback failed - likely due to browser autoplay policy
      });
    }
  };

  return (
    <section className="flex items-center justify-center py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4">
        <div className="relative h-[400px] w-full max-w-4xl overflow-visible sm:h-[420px]">
          {gallery.map((item, index) => {
            const imageSize = 200;
            const initial = getInitialPosition(index, imageSize);
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
                initial={{
                  x: initial.x,
                  y: initial.y,
                  rotate: initial.rotation,
                  scale: 0.8,
                  opacity: 0,
                }}
                key={`${item.src}-${index}`}
                onHoverEnd={() => setHoveredIndex(null)}
                onHoverStart={() => {
                  setHoveredIndex(index);
                  playHoverSound();
                }}
                style={{
                  transformOrigin: "center center",
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

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="font-medium text-foreground text-lg sm:text-xl">
            <span className="text-primary">AI-powered</span> infographics in
            seconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
