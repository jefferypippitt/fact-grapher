"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DashboardLink() {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to dashboard
    // Token sync already happened automatically via AutoSyncPurchases
    router.push("/dashboard");
  };

  return (
    <Button className="w-full" onClick={handleClick}>
      Go to Dashboard
    </Button>
  );
}
