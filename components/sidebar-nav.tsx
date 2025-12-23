"use client";

import { Home, Image, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Images",
    url: "/images",
    icon: Image,
  },
  {
    title: "Buy Tokens",
    url: "/pricing",
    icon: ShoppingCart,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Listen for custom events from chatbot when tokens are updated
    const handleTokensUpdated = () => {
      router.refresh();
    };

    window.addEventListener("tokens-updated", handleTokensUpdated);

    return () => {
      window.removeEventListener("tokens-updated", handleTokensUpdated);
    };
  }, [router]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
