"use client";

import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Crown,
  Flame,
  Gem,
  ImageIcon,
  Star,
  TestTube,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { initiateCheckout } from "@/actions/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Feature = { icon: LucideIcon; text: string };

const PRODUCTS: ReadonlyArray<{
  slug: string;
  name: string;
  tokens: number;
  price: number;
  badge: string | null;
  features: Feature[];
}> = [
  {
    slug: "intro",
    name: "Intro",
    tokens: 1,
    price: 3,
    badge: "Starter",
    features: [
      { icon: TestTube, text: "Try the service risk-free" },
      { icon: ImageIcon, text: "1 high-quality generation" },
      { icon: Clock, text: "No expiration on tokens" },
    ],
  },
  {
    slug: "bronze",
    name: "Bronze",
    tokens: 5,
    price: 15,
    badge: "Value",
    features: [
      { icon: Flame, text: "Great for regular users" },
      { icon: ImageIcon, text: "5 generations included" },
      { icon: Wand2, text: "Full creative control" },
    ],
  },
  {
    slug: "silver",
    name: "Silver",
    tokens: 10,
    price: 30,
    badge: "Popular",
    features: [
      { icon: Star, text: "Our most popular pack" },
      { icon: ImageIcon, text: "10 generations included" },
      { icon: TrendingUp, text: "Best per-token value" },
    ],
  },
  {
    slug: "gold",
    name: "Gold",
    tokens: 20,
    price: 60,
    badge: "Pro",
    features: [
      { icon: Crown, text: "Built for power users" },
      { icon: ImageIcon, text: "20 generations included" },
      { icon: Gem, text: "Maximum creative output" },
    ],
  },
];

export default function PricingCards() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (slug: string) => {
    setIsLoading(slug);
    try {
      const result = await initiateCheckout(slug);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.error("Failed to initiate checkout. Please try again.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to initiate checkout"
      );
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PRODUCTS.map((product) => (
        <Card
          className="relative mx-auto w-full max-w-sm pt-0 transition-all duration-300 hover:shadow-lg"
          key={product.slug}
        >
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-t-xl bg-muted">
            <span className="font-extrabold text-5xl tracking-tighter">
              <span className="mr-0.5 align-top font-semibold text-2xl text-muted-foreground">
                $
              </span>
              {product.price}
            </span>
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
              {product.tokens}{" "}
              {product.tokens === 1 ? "generation" : "generations"}
            </span>
          </div>
          <CardHeader>
            {product.badge ? (
              <CardAction>
                <Badge variant="outline">{product.badge}</Badge>
              </CardAction>
            ) : null}
            <CardTitle className="font-semibold text-lg">
              {product.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {product.features.map((feature) => (
              <div className="flex items-center gap-2.5" key={feature.text}>
                <feature.icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {feature.text}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={isLoading === product.slug}
              onClick={() => handleCheckout(product.slug)}
            >
              {isLoading === product.slug
                ? "Loading..."
                : `Get ${product.name}`}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
