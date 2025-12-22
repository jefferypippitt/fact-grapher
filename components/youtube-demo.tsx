"use client";

import { ArrowRight, Rocket } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

type WatchHowItWorksButtonProps = {
  href?: string;
  delay?: number;
};

export function WatchHowItWorksButton({
  href = "https://youtube.com",
  delay = 0.4,
}: WatchHowItWorksButtonProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -10 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        className="group inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 font-medium text-foreground text-sm shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:shadow-md"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Rocket className="h-4 w-4 text-primary" />
        <span className="text-primary">Live Demo</span>
        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
