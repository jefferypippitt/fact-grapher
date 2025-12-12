import Image from "next/image";

type FeatureCardProps = {
  imageSrc: string;
  imageAlt: string;
};

export function FeatureCard({ imageSrc, imageAlt }: FeatureCardProps) {
  return (
    <Image
      alt={imageAlt}
      className="object-contain"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      src={imageSrc}
    />
  );
}
