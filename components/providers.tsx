"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { Toaster } from "@/components/ui/sonner";
import { fetcher } from "@/lib/fetcher";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        // Global fetcher - can be overridden per hook
        fetcher,
        // Global revalidation settings (can be overridden per hook)
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        // Error retry configuration
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </SWRConfig>
  );
}
