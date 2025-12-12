"use client";

import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";

export function DashboardLink() {
  const router = useRouter();

  const handleClick = () => {
    // Invalidate SWR cache for user tokens to force refetch
    mutate("user-tokens");
    mutate((key) => Array.isArray(key) && key[0] === "user-tokens");
    // Refresh the router to ensure fresh data is fetched
    router.refresh();
    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <Button className="w-full" onClick={handleClick}>
      Go to Dashboard
    </Button>
  );
}
