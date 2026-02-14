import Image from "next/image";
import Link from "next/link";

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
  { alt: "Nvidia vs Intel", src: "/infographic-nvidia-vs-intel.png" },
  {
    alt: "The Fall of the Mongol Empire",
    src: "/infographic-the-fall-of-the-mongol-empire.png",
  },
  { alt: "World War 3", src: "/infographic-ww3.png" },
];

export default function GalleryPage() {
  return (
    <main className="gallery-page">
      {/* Back button — top left */}
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

      {/* Centered gallery container */}
      <div className="gallery-shell">
        <h1 className="gallery-title">Gallery</h1>

        <div className="gallery-grid">
          {IMAGES.map((image, index) => (
            <article className="gallery-card" key={image.src}>
              <div className="gallery-media">
                <Image
                  alt={image.alt}
                  className="gallery-image"
                  height={800}
                  loading={index < 6 ? "eager" : "lazy"}
                  src={image.src}
                  width={1200}
                />
              </div>
              <span className="gallery-label">{image.alt}</span>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
