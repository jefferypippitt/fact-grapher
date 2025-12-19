"use client";

import { useEffect } from "react";
import { syncAndRevalidatePurchases } from "@/actions/tokens";

export function AutoSyncPurchases() {
  useEffect(() => {
    syncAndRevalidatePurchases().catch((error) => {
      console.error("Error syncing purchases:", error);
    });
  }, []);

  return null;
}
