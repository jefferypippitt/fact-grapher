import type { Experimental_GeneratedImage } from "ai";
import { cn } from "@/lib/utils";

export type ImageProps = Omit<
  Experimental_GeneratedImage,
  "uint8Array" | "base64"
> & {
  className?: string;
  alt?: string;
  uint8Array?: Uint8Array;
  loading?: "lazy" | "eager";
  url?: string;
  base64?: string;
};

export const Image = ({
  base64,
  uint8Array,
  mediaType,
  loading = "eager",
  url,
  ...props
}: ImageProps) => {
  // Use URL if provided, otherwise fallback to base64 data URI
  const imageSrc = url || (base64 ? `data:${mediaType};base64,${base64}` : "");

  return (
    // biome-ignore lint/correctness/useImageSize: base64 images have dynamic dimensions
    // biome-ignore lint/performance/noImgElement: base64 data URIs require native img element
    <img
      {...props}
      alt={props.alt}
      className={cn(
        "h-auto max-w-full overflow-hidden rounded-md",
        props.className
      )}
      loading={loading}
      src={imageSrc}
    />
  );
};
