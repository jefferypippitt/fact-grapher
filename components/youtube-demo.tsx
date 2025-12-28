"use client";

import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type YoutubeDemoProps = {
  href?: string;
};

export default function YoutubeDemo({
  href = "https://youtu.be/vL_NvSo7Lgo",
}: YoutubeDemoProps) {
  return (
    <div>
      <Button asChild variant="default">
        <Link
          className="group"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Rocket />
          <span>Live Demo</span>
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </div>
  );
}
