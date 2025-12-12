import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import CustomerPortalButton from "@/components/customer-portal-button";
import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarTokenDisplay } from "@/components/sidebar-token-display";
import { SidebarUser } from "@/components/sidebar-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

// biome-ignore lint/suspicious/useAwait: Next.js async server component pattern - renders async child components
export async function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton asChild size="lg">
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">Fact Grapher</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarTokenDisplay />
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2">
          <div className="w-full">
            <CustomerPortalButton />
          </div>
        </div>
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
