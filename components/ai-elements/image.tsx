import type { Experimental_GeneratedImage } from "ai";
import { cn } from "@/lib/utils";

export type ImageProps = Omit<Experimental_GeneratedImage, "uint8Array"> & {
  className?: string;
  alt?: string;
  uint8Array?: Uint8Array;
};

export const Image = ({
  base64,
  uint8Array,
  mediaType,
  ...props
}: ImageProps) => (
  <img
    {...props}
    alt={props.alt}
    className={cn(
      "h-auto max-w-full overflow-hidden rounded-md",
      props.className
    )}
    src={`data:${mediaType};base64,${base64}`}
  />
);
