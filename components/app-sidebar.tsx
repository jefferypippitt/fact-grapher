import Image from "next/image";
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
            <Image
              alt="Fact Grapher"
              className="size-8 rounded-lg object-contain"
              height={32}
              src="/icon0.svg"
              width={32}
            />
            <div className="flex flex-col gap-1 leading-none">
              <span className="font-medium">Fact Grapher</span>
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
