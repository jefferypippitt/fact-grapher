"use client";

import { Download, Maximize2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteImage } from "@/actions/images";
import { Image } from "@/components/ai-elements/image";
import { OpenInFullscreen } from "@/components/open-in-fullscreen";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ImageActionsProps = {
  imageId: string;
  base64?: string;
  url?: string;
  mediaType: string;
  prompt: string;
};

function base64ToBlob(base64: string, mediaType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mediaType });
}

async function fetchBlobFromUrl(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }
  return await response.blob();
}

export function ImageActions({
  imageId,
  base64,
  url,
  mediaType,
  prompt,
}: ImageActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDownload = async () => {
    // Extract file extension from media type (e.g., "image/png" -> "png")
    const mediaTypePart = mediaType.split(";")[0]?.trim();
    const extension = mediaTypePart?.split("/")[1] || "png";

    let blob: Blob;

    if (url) {
      // Fetch from URL
      try {
        blob = await fetchBlobFromUrl(url);
      } catch (error) {
        console.error("Failed to download image from URL:", error);
        // Fallback to base64 if URL fetch fails
        if (!base64) {
          throw error;
        }
        blob = base64ToBlob(base64, mediaType);
      }
    } else if (base64) {
      // Convert base64 to blob (fallback for backward compatibility)
      blob = base64ToBlob(base64, mediaType);
    } else {
      throw new Error("No image data available");
    }

    // Create download link
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `image-${imageId}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteImage(imageId);
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <OpenInFullscreen
        tooltipLabel="View In Fullscreen"
        trigger={
          <Button disabled={isDeleting} size="icon" variant="ghost">
            <Maximize2 className="size-4" />
            <span className="sr-only">View In Fullscreen</span>
          </Button>
        }
      >
        <Image
          alt={prompt}
          {...(base64 ? { base64 } : {})}
          className="max-h-full max-w-full"
          mediaType={mediaType}
          url={url}
        />
      </OpenInFullscreen>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={isDeleting}
            onClick={handleDownload}
            size="icon"
            variant="ghost"
          >
            <Download className="size-4" />
            <span className="sr-only">Download Image</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download Image</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialog
        onOpenChange={setIsDeleteDialogOpen}
        open={isDeleteDialogOpen}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button disabled={isDeleting} size="icon" variant="ghost">
                <Trash2 className="size-4" />
                <span className="sr-only">Delete Image</span>
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Image</p>
          </TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
