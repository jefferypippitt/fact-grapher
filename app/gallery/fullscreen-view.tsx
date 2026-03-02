"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export type FullscreenImage = {
  alt: string;
  src: string;
};

type FullscreenViewProps = {
  image: FullscreenImage | null;
  closeUrl: string;
};

export const FullscreenView = ({ image, closeUrl }: FullscreenViewProps) => {
  useEffect(() => {
    if (!image) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.location.href = closeUrl;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [image, closeUrl]);

  if (!image) {
    return null;
  }

  return (
    <div aria-modal="true" className="gallery-lightbox" role="dialog">
      <Link
        aria-label="Close full-screen view"
        className="gallery-lightbox-close"
        href={closeUrl}
      >
        Close
      </Link>
      <div className="gallery-lightbox-stage">
        <Image
          alt={image.alt}
          className="gallery-lightbox-image"
          fill
          loading="eager"
          priority
          sizes="100vw"
          src={image.src}
        />
      </div>
    </div>
  );
};
