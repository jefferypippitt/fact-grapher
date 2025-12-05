import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="py-4">
      <div className="container flex max-w-7xl flex-col items-center justify-between gap-x-3 gap-y-1 text-center text-muted-foreground text-sm sm:flex-row">
        <p>&copy;{new Date().getFullYear()} Fact Grapher</p>
        <p>
          Made by{" "}
          <Button asChild className="p-0" variant="link">
            <Link
              href="https://www.jpippitt.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Jeffery Pippitt
            </Link>
          </Button>
        </p>
      </div>
    </footer>
  );
}
