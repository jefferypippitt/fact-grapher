"use client";

import { motion } from "motion/react";
import { useState } from "react";

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

// Deterministic pseudo-random function using index as seed
const seededRandom = (seed: number) => {
  // Simple seeded random using sine function for deterministic values
  const x = Math.sin(seed * 12.9898) * 43_758.5453;
  return x - Math.floor(x);
};

// Initial scattered positions (deterministic positions across the screen)
const getInitialPosition = (index: number, imageSize: number) => {
  const angle = (index / gallery.length) * Math.PI * 2;
  const seed1 = index * 0.1;
  const seed2 = index * 0.2;
  const seed3 = index * 0.3;
  const radius = 300 + seededRandom(seed1) * 150; // Reduced radius for more compact scatter
  const x = Math.cos(angle) * radius + (seededRandom(seed2) - 0.5) * 200;
  const y = Math.sin(angle) * radius + (seededRandom(seed3) - 0.5) * 200;
  return {
    x: x - imageSize / 2, // Account for left-1/2 positioning
    y: y - imageSize / 2, // Account for top-1/2 positioning
    rotation: (seededRandom(seed1 + seed2) - 0.5) * 45,
  };
};

// Final arranged positions (overlapping, fanned arrangement with arch)
const getFinalPosition = (index: number, imageSize: number) => {
  const centerIndex = 2; // Center of the gallery
  const offsetFromCenter = index - centerIndex;
  const baseX = offsetFromCenter * 80; // Horizontal spacing with overlap

  // Create an arch shape using a parabolic curve
  // More pronounced arch: y increases quadratically from center
  const archHeight = 60; // Maximum arch height
  const baseY = (offsetFromCenter * offsetFromCenter * archHeight) / 4;

  // More pronounced fan rotation
  const rotation = offsetFromCenter * 8; // Increased from 4 to 8 for more fan

  return {
    x: baseX - imageSize / 2, // Account for left-1/2 positioning
    y: baseY - imageSize / 2, // Account for top-1/2 positioning
    rotation,
    zIndex: 10 - Math.abs(offsetFromCenter), // Center image on top
  };
};

export function HeroSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="flex items-center justify-center py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4">
        {/* Image Gallery */}
        <div className="relative h-[400px] w-full max-w-4xl overflow-visible sm:h-[420px]">
          {gallery.map((item, index) => {
            const imageSize = 200; // Reduced from 280
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
                onHoverStart={() => setHoveredIndex(index)}
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

        {/* Tagline */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="font-medium text-foreground text-lg sm:text-xl">
            AI-powered infographics in seconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
