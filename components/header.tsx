"use client";

import { LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      <Button asChild className="rounded-full" size="sm" variant="outline">
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button asChild className="rounded-full" size="sm" variant="default">
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
        <Button className="relative size-9 rounded-full" variant="ghost">
          <Avatar className="size-9">
            <AvatarImage
              alt={user.name ?? "User"}
              src={user.image ?? undefined}
            />
            <AvatarFallback className="text-sm">{userInitials}</AvatarFallback>
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
            <User className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="size-4" />
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
      <div className="flex flex-col gap-2">
        <Button
          asChild
          className="w-full justify-start rounded-full"
          variant="outline"
        >
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button
          asChild
          className="w-full justify-start rounded-full"
          variant="default"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link
        className="py-2 text-base text-muted-foreground transition-colors hover:text-foreground"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <button
        className="py-2 text-left text-base text-muted-foreground transition-colors hover:text-foreground"
        onClick={onSignOut}
        type="button"
      >
        Log out
      </button>
    </>
  );
}

export default function Header({ session }: { session?: Session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const user = session?.user;
  const isAuthenticated = !!user;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const renderAuthSection = () => {
    if (session === undefined) {
      return null;
    }
    if (isAuthenticated && user) {
      return <UserAvatar onSignOut={handleSignOut} user={user} />;
    }
    return <AuthButtons />;
  };

  return (
    <nav className="sticky top-0 z-50 pt-2">
      <div className="container max-w-4xl rounded-lg border border-transparent bg-background/80 px-3 py-2 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          {/* Left - Logo + About */}
          <div className="flex items-center gap-2">
            <Link
              className="group flex items-center gap-1.5 transition-opacity hover:opacity-80"
              href="/"
            >
              <Image
                alt="Fact Grapher"
                className="size-8"
                height={32}
                src="/FG-logo.png"
                width={32}
              />
              <span className="flex items-center gap-1 text-base tracking-[-0.5px] transition-opacity duration-300 group-hover:opacity-65">
                Fact Grapher
              </span>
            </Link>
          </div>

          {/* Right - Auth Section */}
          <div className="flex items-center gap-1.5">
            <div className="hidden md:block">{renderAuthSection()}</div>

            <div className="flex items-center gap-1.5 md:hidden">
              <Button
                aria-label="Toggle menu"
                className="size-8 rounded-full p-0"
                onClick={toggleMenu}
                size="sm"
                variant="ghost"
              >
                {isMenuOpen ? (
                  <X className="size-4" />
                ) : (
                  <Menu className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="mt-2 border-t pt-3 pb-1 md:hidden">
            <div className="flex flex-col gap-2">
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
