"use client";

import { Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

type BlockReason = "rate-limit" | "bot" | "forbidden";

type BlockConfig = {
  title: string;
  description: string;
  code: string;
};

const blockConfigs: Record<BlockReason, BlockConfig> = {
  "rate-limit": {
    title: "Slow Down There!",
    description:
      "You've made too many requests. Please wait a moment before trying again.",
    code: "429",
  },
  bot: {
    title: "Bot Detected",
    description:
      "Our security systems detected automated behavior from your request.",
    code: "403",
  },
  forbidden: {
    title: "Access Denied",
    description: "You don't have permission to access this resource.",
    code: "403",
  },
};

const validReasons: BlockReason[] = ["rate-limit", "bot", "forbidden"];

function BlockedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(60);
  const [canRetry, setCanRetry] = useState(false);

  const reasonParam = searchParams.get("reason") as BlockReason | null;
  const isValidReason = reasonParam && validReasons.includes(reasonParam);
  const returnTo = searchParams.get("return") || "/";

  // Redirect to home if accessed directly without a valid reason
  useEffect(() => {
    if (!isValidReason) {
      router.replace("/");
    }
  }, [isValidReason, router]);

  useEffect(() => {
    if (!isValidReason || reasonParam !== "rate-limit") {
      setCanRetry(true);
      return;
    }

    setCanRetry(false);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanRetry(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isValidReason, reasonParam]);

  // Show nothing while redirecting
  if (!isValidReason) {
    return null;
  }

  const config = blockConfigs[reasonParam];

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Empty className="max-w-md border border-border bg-card">
        <EmptyHeader>
          <EmptyTitle>{config.title}</EmptyTitle>
          <EmptyDescription>{config.description}</EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          {reasonParam === "rate-limit" && !canRetry ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <RefreshCw className="size-4 animate-spin" />
              <span>Retry available in {countdown}s</span>
            </div>
          ) : null}

          <div className="flex gap-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/">
                <Home className="size-4" />
                Go Home
              </Link>
            </Button>

            {canRetry ? (
              <Button asChild size="sm">
                <Link href={returnTo}>
                  <RefreshCw className="size-4" />
                  Try Again
                </Link>
              </Button>
            ) : null}
          </div>

          <EmptyDescription>Error {config.code}</EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export default function BlockedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <BlockedContent />
    </Suspense>
  );
}
