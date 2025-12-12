"use client";

import { Coins } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserTokens } from "@/lib/hooks/use-user-tokens";

export function SidebarTokenDisplay() {
  const { tokenCount, isLoading, isError } = useUserTokens();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tokens</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Current token count">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="size-4" />
                  <span>Tokens</span>
                </div>
                {(() => {
                  if (isLoading) {
                    return <Skeleton className="h-5 w-12" />;
                  }
                  if (isError) {
                    return (
                      <span className="text-muted-foreground text-xs">
                        Error
                      </span>
                    );
                  }
                  return <span className="font-semibold">{tokenCount}</span>;
                })()}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
