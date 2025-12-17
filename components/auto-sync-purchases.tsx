"use client";

import { useEffect } from "react";
import { syncAndRevalidatePurchases } from "@/actions/tokens";

/**
 * Automatically syncs purchases and revalidates paths on mount
 * This ensures the token count updates immediately after payment
 * without requiring user interaction.
 *
 * According to Next.js docs, calling revalidatePath from a Server Action
 * automatically clears the client cache, so no router.refresh() is needed.
 */
export function AutoSyncPurchases() {
  useEffect(() => {
    // Sync purchases and revalidate paths
    // revalidatePath automatically clears the client cache per Next.js docs
    syncAndRevalidatePurchases().catch((error) => {
      // Log but don't block - webhook might have already handled it
      console.error("Error syncing purchases:", error);
    });
  }, []);

  return null;
}
