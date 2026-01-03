"use client";

import { Badge } from "@/components/ui/badge";

type DateBadgeProps = {
  date: Date | string;
};

export function DateBadge({ date }: DateBadgeProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);

  return <Badge>{formattedDate}</Badge>;
}
