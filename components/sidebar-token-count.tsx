import { Coins } from "lucide-react";
import { getUserTokens } from "@/actions/tokens";
import { Badge } from "@/components/ui/badge";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export async function SidebarTokenCount() {
  const tokens = await getUserTokens();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tokens</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Coins className="size-4" />
              <div className="flex flex-1 items-center justify-between">
                <span className="font-medium text-sm">Available</span>
                <Badge variant="default">{tokens}</Badge>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
