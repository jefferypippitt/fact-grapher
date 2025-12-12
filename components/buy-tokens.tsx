"use client";

import { CheckCircle2 } from "lucide-react";
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
import type { TokenPackDisplay } from "@/lib/token-packs-types";

type TokenPackWithPrice = TokenPackDisplay & {
  price?: number;
};

type BuyTokensProps = {
  tokenPacks: TokenPackWithPrice[];
};

export default function BuyTokens({ tokenPacks }: BuyTokensProps) {
  const buyTokens = async (slug: string) => {
    try {
      const result = await initiateCheckout(slug);
      // If we get a redirect URL, navigate to it
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (e) {
      console.error("Error during checkout:", e);
    }
  };

  const getPackTitle = (tokens: number) => {
    if (tokens === 1) {
      return "Intro";
    }
    if (tokens === 5) {
      return "Bronze";
    }
    if (tokens === 10) {
      return "Silver";
    }
    if (tokens === 20) {
      return "Gold";
    }
    return "Pack";
  };

  const getPackDescription = (tokens: number) => {
    if (tokens === 1) {
      return {
        primary:
          "Perfect for trying out our service! Get started with 1 token to explore what we offer.",
        secondary:
          "This is the ideal entry point for new users who want to test the waters before committing to a larger pack.",
      };
    }
    if (tokens === 5) {
      return {
        primary:
          "A great value pack for regular users! Get 5 tokens to power multiple interactions.",
        secondary:
          "This option is perfect for those who want a cost-effective way to use our service regularly.",
      };
    }
    if (tokens === 10) {
      return {
        primary:
          "Our popular choice! Get 10 tokens for extended use and more flexibility.",
        secondary:
          "Ideal for users who want to maximize their experience without breaking the bank.",
      };
    }
    if (tokens === 20) {
      return {
        primary:
          "The best value! Get 20 tokens for maximum flexibility and extended usage.",
        secondary:
          "Perfect for power users who want the freedom to use our service extensively.",
      };
    }
    return {
      primary: `Get ${tokens} tokens to power your experience.`,
      secondary: "Choose this pack to get started with our service.",
    };
  };

  return (
    <div className="mt-5 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-4">
      {tokenPacks.map((pack) => {
        const description = getPackDescription(pack.tokens);
        return (
          <Card
            className="hover:-translate-y-2 flex cursor-pointer flex-col justify-between from-primary/40 to-transparent transition duration-300 ease-in-out hover:bg-linear-to-br hover:bg-primary/10"
            key={pack.slug}
            onClick={() => buyTokens(pack.slug)}
          >
            <CardHeader>
              <CardTitle>{getPackTitle(pack.tokens)}</CardTitle>
              <CardDescription>
                {pack.price ? `$${pack.price}` : pack.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="md:min-h-96">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-1 text-xl">
                  <CheckCircle2 className="size-5 text-primary" /> {pack.tokens}{" "}
                  {pack.tokens === 1 ? "token" : "tokens"}
                </div>
                <p>{description.primary}</p>
                <p>{description.secondary}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => buyTokens(pack.slug)}>
                Get {pack.tokens} {pack.tokens === 1 ? "Token" : "Tokens"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
