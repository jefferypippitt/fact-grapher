"use client";

import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import type { getUserSession } from "@/actions/users";
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

type Session = Awaited<ReturnType<typeof getUserSession>>;

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

export default function Header({
  sessionPromise,
}: {
  sessionPromise?: Promise<Session>;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Only use session if sessionPromise is provided
  const session = sessionPromise ? use(sessionPromise) : null;
  const user = session?.user;
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const renderAuthSection = () => {
    if (isAuthenticated && user) {
      return <UserAvatar onSignOut={handleSignOut} user={user} />;
    }
    return <AuthButtons />;
  };

  // Simple fallback version when no sessionPromise is provided
  if (!sessionPromise) {
    return (
      <nav className="sticky top-0 z-50 pt-4">
        <div className="container max-w-4xl rounded-xl border border-transparent bg-background/80 px-4 py-3 backdrop-blur-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <Link
              className="font-medium text-sm transition-colors hover:text-foreground/80"
              href="/"
            >
              Fact Grapher
            </Link>

            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <div className="flex items-center gap-2 md:hidden">
                <Button
                  aria-label="Toggle menu"
                  className="p-2"
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
          </div>
        </div>
      </nav>
    );
  }

  // Full version with auth when sessionPromise is provided
  return (
    <nav className="sticky top-0 z-50 pt-4">
      <div
        className={`container max-w-4xl rounded-xl bg-background/80 px-4 py-3 backdrop-blur-xl transition-all duration-200 ${
          isScrolled
            ? "border bg-background/95 shadow-sm"
            : "border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            className="font-medium text-sm transition-colors hover:text-foreground/80"
            href="/"
          >
            Fact Grapher
          </Link>

          <div className="flex items-center gap-2">
            {/* Desktop Auth */}
            <div className="hidden items-center gap-2 md:flex">
              {renderAuthSection()}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                aria-label="Toggle menu"
                className="p-2"
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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen ? (
          <div className="mt-3 border-t pt-4 pb-2 md:hidden">
            <div className="flex flex-col gap-3">
              <MobileAuthLinks
                isAuthenticated={isAuthenticated}
                onSignOut={handleSignOut}
                user={user}
              />
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
