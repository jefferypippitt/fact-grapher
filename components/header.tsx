import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/50 py-6 backdrop-blur-sm">
      <div className="container max-w-7xl">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
