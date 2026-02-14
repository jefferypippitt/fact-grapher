import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoType = {
  src: string;
  srcDark?: string;
  alt: string;
};

type TileData = {
  row: number;
  col: number;
  logo?: LogoType;
};

export function Integrations() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-16 sm:py-20 md:grid-cols-2 md:items-center md:px-10">
      {/* Left Content */}
      <div className="max-w-xl space-y-4">
        <h2
          className="text-foreground"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
          }}
        >
          Powered by Tools You Can Trust
        </h2>
        <p
          className="text-muted-foreground"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: 1.7,
            letterSpacing: "0.06em",
            maxWidth: "30rem",
          }}
        >
          Built on proven tools for fast generation, secure delivery, and
          consistent performance.
        </p>
      </div>

      {/* Right Content - Visual */}
      <div className="place-items-end">
        <div className="mask-[radial-gradient(ellipse_at_center,black,black,transparent)] relative size-90">
          {tiles.map((tile) => (
            <IntegrationCard key={`${tile.row}_${tile.col}`} {...tile} />
          ))}
        </div>
      </div>
    </div>
  );
}

const logoClasses = "pointer-events-none size-8 select-none object-contain p-1";

function IntegrationCard({ row, col, logo }: TileData) {
  const renderLogo = () => {
    if (!logo) {
      return null;
    }

    if (logo.srcDark) {
      return (
        <>
          <Image
            alt={logo.alt}
            className={cn(logoClasses, "dark:hidden")}
            height={40}
            src={logo.src}
            width={40}
          />
          <Image
            alt={logo.alt}
            className={cn(logoClasses, "hidden dark:block")}
            height={40}
            src={logo.srcDark}
            width={40}
          />
        </>
      );
    }

    return (
      <Image
        alt={logo.alt}
        className={logoClasses}
        height={40}
        src={logo.src}
        width={40}
      />
    );
  };

  return (
    <div
      className={cn(
        "absolute flex size-18 items-center justify-center rounded-md border",
        logo
          ? "bg-card shadow-xs dark:bg-card/60"
          : "bg-secondary/30 dark:bg-background"
      )}
      style={{
        left: col * 72,
        top: row * 72,
      }}
    >
      {renderLogo()}
    </div>
  );
}

// Coordinate mapping to approximate the "scattered" look in the image.
// Grid 5x5.
const tiles: TileData[] = [
  // Row 0
  { row: 0, col: 1 },
  {
    row: 0,
    col: 3,
    logo: {
      src: "/logos/Next.js_wordmark_light.svg",
      srcDark: "/logos/Next.js_wordmark_dark.svg",
      alt: "Next.js Logo",
    },
  },

  // Row 1
  { row: 1, col: 0 },
  {
    row: 1,
    col: 2,
    logo: {
      src: "/logos/Better Auth_light.svg",
      srcDark: "/logos/Better Auth_dark.svg",
      alt: "Better Auth Logo",
    },
  },
  {
    row: 1,
    col: 4,
    logo: {
      src: "/logos/Vercel_light.svg",
      srcDark: "/logos/Vercel_dark.svg",
      alt: "Vercel Logo",
    },
  },

  // Row 2
  {
    row: 2,
    col: 1,
    logo: {
      src: "/logos/Drizzle ORM_light.svg",
      srcDark: "/logos/Drizzle ORM_dark.svg",
      alt: "Drizzle ORM Logo",
    },
  },
  {
    row: 2,
    col: 3,
    logo: {
      src: "/logos/google.svg",
      alt: "Google Logo",
    },
  },

  // Row 3
  { row: 3, col: 0 },
  {
    row: 3,
    col: 2,
    logo: {
      src: "/logos/neon.svg",
      alt: "Neon Logo",
    },
  },
  {
    row: 3,
    col: 4,
    logo: {
      src: "/logos/Polar_light.svg",
      srcDark: "/logos/Polar_dark.svg",
      alt: "Polar Logo",
    },
  },

  // Row 4
  {
    row: 4,
    col: 1,
    logo: {
      src: "/logos/ui_light.svg",
      srcDark: "/logos/ui_dark.svg",
      alt: "UI Logo",
    },
  },
  { row: 4, col: 3 },
];
