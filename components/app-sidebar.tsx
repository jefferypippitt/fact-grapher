import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarSecondary } from "@/components/sidebar-secondary";
import { SidebarTokenCount } from "@/components/sidebar-token-count";
import { SidebarUser } from "@/components/sidebar-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar() {
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
        <SidebarNav />
        <Suspense fallback={null}>
          <SidebarTokenCount />
        </Suspense>
        <SidebarSecondary />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={null}>
          <SidebarUser />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
