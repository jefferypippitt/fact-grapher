"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { initiateCheckout } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PRODUCTS = [
  { slug: "intro" as const, name: "Intro", tokens: 1, price: 3 },
  { slug: "bronze" as const, name: "Bronze", tokens: 5, price: 15 },
  { slug: "silver" as const, name: "Silver", tokens: 10, price: 30 },
  { slug: "gold" as const, name: "Gold", tokens: 20, price: 60 },
] as const;

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

  const getPackFeatures = (tokens: number): string[] => {
    if (tokens === 1) {
      return ["Perfect for trying out our service!", "1 generation"];
    }
    if (tokens === 5) {
      return ["A great value pack for regular users!", "5 generations"];
    }
    if (tokens === 10) {
      return ["Our popular choice!", "10 generations"];
    }
    if (tokens === 20) {
      return ["The best value!", "20 generations"];
    }
    return [`Get ${tokens} tokens to power your experience.`];
  };

  return (
    <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PRODUCTS.map((product) => (
        <Card
          className="flex flex-col transition-all duration-300 hover:shadow-lg"
          key={product.slug}
        >
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl">${product.price}</span>
              <span className="text-muted-foreground">USD</span>
            </div>
            <CardDescription>
              {product.tokens} {product.tokens === 1 ? "token" : "tokens"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <ul className="flex flex-col gap-3">
              {getPackFeatures(product.tokens).map((feature) => (
                <li
                  className="flex items-center gap-2"
                  key={`${product.slug}-${feature}`}
                >
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  <span className="text-base text-muted-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
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
