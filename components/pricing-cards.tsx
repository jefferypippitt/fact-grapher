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
  { slug: "intro" as const, name: "Intro", tokens: 1 },
  { slug: "bronze" as const, name: "Bronze", tokens: 5 },
  { slug: "silver" as const, name: "Silver", tokens: 10 },
  { slug: "gold" as const, name: "Gold", tokens: 20 },
] as const;

export default function PricingCards() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (slug: string) => {
    setIsLoading(slug);
    try {
      const result = await initiateCheckout(slug);

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to initiate checkout"
      );
    } finally {
      setIsLoading(null);
    }
  };

  const getPackDescription = (tokens: number) => {
    if (tokens === 1) {
      return "Perfect for trying out our service! Get started with 1 token to explore what we offer.";
    }
    if (tokens === 5) {
      return "A great value pack for regular users! Get 5 tokens to power multiple interactions.";
    }
    if (tokens === 10) {
      return "Our popular choice! Get 10 tokens for extended use and more flexibility.";
    }
    if (tokens === 20) {
      return "The best value! Get 20 tokens for maximum flexibility and extended usage.";
    }
    return `Get ${tokens} tokens to power your experience.`;
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
            <CardDescription>
              {product.tokens} {product.tokens === 1 ? "token" : "tokens"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <span className="font-semibold text-lg">
                {product.tokens} {product.tokens === 1 ? "Token" : "Tokens"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {getPackDescription(product.tokens)}
            </p>
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
