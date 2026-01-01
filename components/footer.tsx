import Link from "next/link";
import { Suspense } from "react";
import { CopyrightYear } from "./copyright-year";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="py-4">
      <div className="container flex max-w-4xl flex-col items-center justify-between gap-x-3 gap-y-1 text-center text-muted-foreground text-sm sm:flex-row">
        <p>
          &copy;
          <Suspense fallback={<span>----</span>}>
            <CopyrightYear />
          </Suspense>{" "}
          Fact Grapher
        </p>
        <div className="flex items-center gap-4">
          <Link
            className="transition-colors hover:text-foreground"
            href="/about"
          >
            About
          </Link>
          <span className="text-muted-foreground/50">·</span>
          <span>
            A project by{" "}
            <Button asChild className="p-0" variant="link">
              <Link
                href="https://github.com/jefferypippitt"
                rel="noopener noreferrer"
                target="_blank"
              >
                @jefferypippitt
              </Link>
            </Button>
          </span>
        </div>
      </div>
    </footer>
  );
}
