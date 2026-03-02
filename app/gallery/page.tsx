import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { FullscreenView } from "./fullscreen-view";

const IMAGES = [
  { alt: "Phone", src: "/infographic-phone.png" },
  { alt: "Tesla vs Nio", src: "/infographic-tesla-vs-nio.png" },
  { alt: "Animal Kingdom", src: "/infographic-animal-kingdom.png" },
  { alt: "Bitcoin", src: "/infographic-bitcoin.png" },
  {
    alt: "Coffee Bean Lifecycle",
    src: "/infographic-coffee-bean-lifecycle.png",
  },
  {
    alt: "End of World War 2",
    src: "/infographic-end-of-world-war-2.png",
  },
  {
    alt: "Global Renewable Energy",
    src: "/infographic-global-renewable-energy.png",
  },
  {
    alt: "History of the Roman Empire",
    src: "/infographic-history-of-the-roman-empire.png",
  },
  { alt: "Human Population", src: "/infographic-human-population.png" },
  {
    alt: "Cooking French Toast",
    src: "/infographic-cooking-frenchtoast.png",
  },
  { alt: "Cooking Omelet", src: "/infographic-cooking-omelet.png" },
  { alt: "Linux vs Windows", src: "/infographic-linux-vs-windows.png" },
  { alt: "Nvidia vs AMD", src: "/infographic-nvidia-amd.png" },
  { alt: "The Tech Titans", src: "/infographic-the-tech-titans.png" },
  { alt: "X402", src: "/infographic-x402.png" },
  { alt: "Nvidia vs Intel", src: "/infographic-nvidia-vs-intel.png" },
  {
    alt: "The Fall of the Mongol Empire",
    src: "/infographic-the-fall-of-the-mongol-empire.png",
  },
  { alt: "World War 3", src: "/infographic-ww3.png" },
];

type SearchParams = {
  image?: string;
};

export const metadata: Metadata = {
  title: "Gallery | Fact Grapher",
  description:
    "Explore a gallery of AI-generated infographic examples from Fact Grapher.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Gallery | Fact Grapher",
    description:
      "Explore a gallery of AI-generated infographic examples from Fact Grapher.",
    url: "/gallery",
    type: "website",
  },
  twitter: {
    title: "Gallery | Fact Grapher",
    description:
      "Explore a gallery of AI-generated infographic examples from Fact Grapher.",
  },
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <main className="gallery-page">
      <Link className="gallery-back" href="/">
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <title>Back arrow</title>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Back
      </Link>

      <div className="gallery-shell">
        <h1 className="gallery-title">Gallery</h1>

        <div className="gallery-grid">
          {IMAGES.map((image, index) => (
            <article className="gallery-card" key={image.src}>
              <Link
                aria-label={`Open full-screen view for ${image.alt}`}
                className="gallery-media gallery-open-button"
                href={`?image=${index}`}
              >
                <Image
                  alt={image.alt}
                  className="gallery-image"
                  height={800}
                  loading={index < 6 ? "eager" : "lazy"}
                  priority={index < 6}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={image.src}
                  width={1200}
                />
              </Link>
              <span className="gallery-label">{image.alt}</span>
            </article>
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <GalleryFullscreen searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

const GalleryFullscreen = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;
  const selectedImageIndex = params?.image;
  const selectedImage = selectedImageIndex
    ? IMAGES[Number(selectedImageIndex)]
    : null;

  return <FullscreenView closeUrl="/gallery" image={selectedImage} />;
};
