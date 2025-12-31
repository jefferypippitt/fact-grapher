"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { RocketIcon, type RocketIconHandle } from "@/components/ui/rocket";

type YoutubeDemoProps = {
  href?: string;
};

export default function YoutubeDemo({
  href = "https://youtu.be/vL_NvSo7Lgo",
}: YoutubeDemoProps) {
  const rocketRef = useRef<RocketIconHandle>(null);

  return (
    <div>
      <Button asChild variant="outline">
        <Link
          className="group"
          href={href}
          onMouseEnter={() => rocketRef.current?.startAnimation()}
          onMouseLeave={() => rocketRef.current?.stopAnimation()}
          rel="noopener noreferrer"
          target="_blank"
        >
          <RocketIcon ref={rocketRef} size={20} />
          <span>Live Demo</span>
          <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
