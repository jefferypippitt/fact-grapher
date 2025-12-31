import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

type Logo =
  | {
      lightSrc: string;
      darkSrc: string;
      alt: string;
    }
  | {
      src: string;
      alt: string;
    };

function LogoItem({ logo }: { logo: Logo }) {
  if ("src" in logo) {
    return (
      <Image
        alt={logo.alt}
        className="pointer-events-none h-4 select-none object-contain md:h-5"
        height={20}
        loading="lazy"
        src={logo.src}
        width={80}
      />
    );
  }

  return (
    <>
      <Image
        alt={logo.alt}
        className="pointer-events-none hidden h-4 select-none object-contain md:h-5 dark:block"
        height={20}
        loading="lazy"
        src={logo.darkSrc}
        width={80}
      />
      <Image
        alt={logo.alt}
        className="pointer-events-none block h-4 select-none object-contain md:h-5 dark:hidden"
        height={20}
        loading="lazy"
        src={logo.lightSrc}
        width={80}
      />
    </>
  );
}

export default function BenefitsSection() {
  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-balance font-semibold text-xl md:text-2xl lg:text-3xl">
            Powered By Trusted Technologies
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-sm md:text-base">
            Enterprise grade infrastructure you can trust.
          </p>
        </div>
        <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] overflow-hidden py-4">
          <InfiniteSlider gap={42} reverse speed={80} speedOnHover={25}>
            {logos.map((logo) => (
              <div
                className="relative flex items-center justify-center"
                key={`logo-${logo.alt}`}
              >
                <LogoItem logo={logo} />
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}

const logos: Logo[] = [
  {
    lightSrc: "/logos/Next.js_wordmark_light.svg",
    darkSrc: "/logos/Next.js_wordmark_dark.svg",
    alt: "Next.js Logo",
  },
  {
    lightSrc: "/logos/Vercel_light.svg",
    darkSrc: "/logos/Vercel_dark.svg",
    alt: "Vercel Logo",
  },
  {
    src: "/logos/neon.svg",
    alt: "Neon Database Logo",
  },
  {
    lightSrc: "/logos/Drizzle ORM_light.svg",
    darkSrc: "/logos/Drizzle ORM_dark.svg",
    alt: "Drizzle ORM Logo",
  },
  {
    src: "/logos/google.svg",
    alt: "Google Logo",
  },
  {
    lightSrc: "/logos/Better Auth_light.svg",
    darkSrc: "/logos/Better Auth_dark.svg",
    alt: "Better Auth Logo",
  },
  {
    lightSrc: "/logos/Polar_light.svg",
    darkSrc: "/logos/Polar_dark.svg",
    alt: "Polar Logo",
  },
  {
    lightSrc: "/logos/ui_light.svg",
    darkSrc: "/logos/ui_dark.svg",
    alt: "shadcn/ui Logo",
  },
];
