"use client";

import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/lib/hooks/use-user";
import { ThemeToggle } from "./theme-toggle";

function getUserInitials(user: {
  name?: string | null;
  email?: string | null;
}) {
  if (user.name) {
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    if (initials) {
      return initials;
    }
  }
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  return "U";
}

function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="ghost">
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
}

function UserAvatar({
  user,
  onSignOut,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
  onSignOut: () => void;
}) {
  const userInitials = getUserInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative size-8 rounded-full" variant="ghost">
          <Avatar className="size-8">
            <AvatarImage
              alt={user.name ?? "User"}
              src={user.image ?? undefined}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">
              {user.name ?? "User"}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <User className="mr-2 size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileAuthLinks({
  isAuthenticated,
  user,
  onSignOut,
}: {
  isAuthenticated: boolean;
  user: { name?: string | null; email?: string | null } | null | undefined;
  onSignOut: () => void;
}) {
  if (!(isAuthenticated && user)) {
    return (
      <>
        <Link
          className="py-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/sign-in"
        >
          Sign In
        </Link>
        <Link
          className="py-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/sign-up"
        >
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        className="py-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <button
        className="py-2 text-left text-muted-foreground text-sm transition-colors hover:text-foreground"
        onClick={onSignOut}
        type="button"
      >
        Log out
      </button>
    </>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const renderAuthSection = () => {
    if (isLoading) {
      return null;
    }
    if (isAuthenticated && user) {
      return <UserAvatar onSignOut={handleSignOut} user={user} />;
    }
    return <AuthButtons />;
  };

  return (
    <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="container max-w-4xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            className="font-medium text-sm transition-colors hover:text-foreground/80"
            href="/"
          >
            Home
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/projects"
            >
              Projects
            </Link>
            <Link
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/posts"
            >
              Posts
            </Link>
            <Link
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/contact"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {renderAuthSection()}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              aria-label="Toggle menu"
              className="p-2 md:hidden"
              onClick={toggleMenu}
              size="sm"
              variant="ghost"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen ? (
          <div className="mt-3 border-t pt-4 pb-2 md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                className="py-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/projects"
              >
                Projects
              </Link>
              <Link
                className="py-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/posts"
              >
                Posts
              </Link>
              <Link
                className="py-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/contact"
              >
                Contact
              </Link>
              {!isLoading && (
                <MobileAuthLinks
                  isAuthenticated={isAuthenticated}
                  onSignOut={handleSignOut}
                  user={user}
                />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
