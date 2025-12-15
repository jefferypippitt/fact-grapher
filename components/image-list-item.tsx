"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteImage } from "@/actions/images";
import { Image as AIImage } from "@/components/ai-elements/image";
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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

type ImageData = {
  id: string;
  prompt: string;
  base64: string;
  mediaType: string;
  createdAt: string | Date;
};

export function ImageListItem({ image }: { image: ImageData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `data:${image.mediaType};base64,${image.base64}`;
    link.download = `infographic-${image.id}.${image.mediaType.split("/")[1]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded");
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        // Optimistically hide the item immediately
        setIsDeleted(true);
        setIsDeleteDialogOpen(false);

        // Perform the actual deletion
        await deleteImage(image.id);
        toast.success("Image deleted successfully");

        // Refresh the page to sync with server cache
        router.refresh();
      } catch (error) {
        // Revert optimistic update on error
        setIsDeleted(false);
        toast.error(
          error instanceof Error ? error.message : "Failed to delete image"
        );
      }
    });
  };

  // Hide the item if it's been deleted (optimistic UI)
  if (isDeleted) {
    return null;
  }

  return (
    <Item className="py-2">
      <ItemMedia>
        <div className="relative size-16 overflow-hidden rounded-lg border bg-muted">
          <AIImage
            alt={image.prompt}
            base64={image.base64}
            className="h-full w-full object-contain"
            mediaType={image.mediaType}
          />
        </div>
      </ItemMedia>
      <ItemContent className="gap-1">
        <div>
          <ItemTitle className="text-sm">{image.prompt}</ItemTitle>
          <ItemDescription className="text-xs">
            {typeof image.createdAt === "string"
              ? image.createdAt
              : image.createdAt.toString()}
          </ItemDescription>
        </div>
      </ItemContent>
      <ItemActions className="flex-row gap-1">
        <OpenInFullscreen
          trigger={
            <Button disabled={isPending} size="sm" variant="outline">
              View
            </Button>
          }
        >
          <AIImage
            alt={image.prompt}
            base64={image.base64}
            className="max-h-full max-w-full object-contain"
            mediaType={image.mediaType}
          />
        </OpenInFullscreen>
        <Button
          disabled={isPending}
          onClick={handleDownload}
          size="sm"
          variant="outline"
        >
          Download
        </Button>
        <AlertDialog
          onOpenChange={setIsDeleteDialogOpen}
          open={isDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button disabled={isPending} size="sm" variant="destructive">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this image? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                asChild
                disabled={isPending}
                onClick={handleDelete}
              >
                <Button disabled={isPending} size="sm" variant="destructive">
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ItemActions>
    </Item>
  );
}
