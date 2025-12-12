"use client";

import CustomerPortalButton from "@/components/customer-portal-button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function SidebarSecondary() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarGroupContent>
        <CustomerPortalButton />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
