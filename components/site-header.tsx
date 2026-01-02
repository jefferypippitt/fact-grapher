import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <div className="flex w-full items-center gap-2 px-5 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
