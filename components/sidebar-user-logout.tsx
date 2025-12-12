"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function SidebarUserLogout() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <LogOut className="mr-2 size-4" />
      Log out
    </DropdownMenuItem>
  );
}
