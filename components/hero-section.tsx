"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

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
];

const ROTATION_MS = 2800;

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % gallery.length);
    }, ROTATION_MS);

    return () => clearInterval(id);
  }, []);

  const active = gallery[index];

  return (
    <section className="py-12 sm:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <div className="space-y-4 text-left">
          <h1 className="font-semibold text-3xl leading-tight sm:text-4xl">
            AI infographics in seconds
          </h1>
          <p className="text-base text-muted-foreground">
            Ask a question and get a clean visual that&apos;s ready to drop into
            decks, documents, or posts without opening a design tool.
          </p>
        </div>
        <div className="relative">
          <div className="relative h-[300px] overflow-hidden rounded-xl sm:h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute inset-0"
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                key={active.src}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <FeatureCard imageAlt={active.alt} imageSrc={active.src} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative z-10 mt-4 flex w-full justify-center gap-2">
            {gallery.map((item, i) => (
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${
                  i === index ? "bg-primary" : "bg-muted-foreground/40"
                }`}
                key={item.src}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
