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

type ImageActionsProps = {
  imageId: string;
  base64: string;
  mediaType: string;
  prompt: string;
};

export function ImageActions({
  imageId,
  base64,
  mediaType,
  prompt,
}: ImageActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDownload = () => {
    // Convert base64 to blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mediaType });

    // Extract file extension from media type (e.g., "image/png" -> "png")
    const mediaTypePart = mediaType.split(";")[0]?.trim();
    const extension = mediaTypePart?.split("/")[1] || "png";

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `image-${imageId}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        trigger={
          <Button disabled={isDeleting} size="icon" variant="ghost">
            <Maximize2 className="size-4" />
            <span className="sr-only">View in fullscreen</span>
          </Button>
        }
      >
        <Image
          alt={prompt}
          base64={base64}
          className="max-h-full max-w-full"
          mediaType={mediaType}
        />
      </OpenInFullscreen>

      <Button
        disabled={isDeleting}
        onClick={handleDownload}
        size="icon"
        variant="ghost"
      >
        <Download className="size-4" />
        <span className="sr-only">Download image</span>
      </Button>

      <AlertDialog
        onOpenChange={setIsDeleteDialogOpen}
        open={isDeleteDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <Button disabled={isDeleting} size="icon" variant="ghost">
            <Trash2 className="size-4" />
            <span className="sr-only">Delete image</span>
          </Button>
        </AlertDialogTrigger>
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
