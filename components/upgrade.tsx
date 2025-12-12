"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { initiateCheckout } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PRODUCTS = [
  { slug: "intro" as const, name: "Intro", tokens: 1 },
  { slug: "bronze" as const, name: "Bronze", tokens: 5 },
  { slug: "silver" as const, name: "Silver", tokens: 10 },
  { slug: "gold" as const, name: "Gold", tokens: 20 },
] as const;

type UpgradeProps = {
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
};

export default function Upgrade({
  children,
  className = "ml-2 cursor-pointer text-orange-400",
  size = "sm",
  variant = "outline",
}: UpgradeProps) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} size={size} variant={variant}>
          {children ?? "Upgrade"}
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {PRODUCTS.map((product) => (
          <DropdownMenuItem
            disabled={isLoading === product.slug}
            key={product.slug}
            onClick={() => handleCheckout(product.slug)}
          >
            <div className="flex flex-col">
              <span className="font-medium">{product.name}</span>
              <span className="text-muted-foreground text-xs">
                {product.tokens} {product.tokens === 1 ? "token" : "tokens"}
                {isLoading === product.slug && " (Loading...)"}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
