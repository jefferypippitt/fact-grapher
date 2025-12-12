"use client";

import { CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type CustomerPortalButtonProps = {
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

export default function CustomerPortalButton({
  className = "w-full",
  size = "sm",
  variant = "outline",
}: CustomerPortalButtonProps) {
  return (
    <Button asChild className={className} size={size} variant={variant}>
      <Link href="/customer-portal">
        <CreditCard className="size-4" />
        Customer Portal
      </Link>
    </Button>
  );
}
