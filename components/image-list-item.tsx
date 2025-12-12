"use client";

import { format } from "date-fns";

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
import { useUserImages } from "@/lib/hooks/use-user-images";

type ImageData = {
  id: string;
  prompt: string;
  base64: string;
  mediaType: string;
  createdAt: Date;
};

export function ImageListItem({ image }: { image: ImageData }) {
  const { refetch } = useUserImages();
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
        await deleteImage(image.id);
        toast.success("Image deleted successfully");
        setIsDeleteDialogOpen(false);
        // Refetch images using SWR's mutate
        await refetch();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete image"
        );
      }
    });
  };

  return (
    <Item>
      <ItemMedia>
        <div className="relative size-24 overflow-hidden rounded-lg border bg-muted">
          <AIImage
            alt={image.prompt}
            base64={image.base64}
            className="h-full w-full object-contain"
            mediaType={image.mediaType}
          />
        </div>
      </ItemMedia>
      <ItemContent className="gap-2">
        <div>
          <ItemTitle>{image.prompt}</ItemTitle>
          <ItemDescription>
            {format(new Date(image.createdAt), "PPp")}
          </ItemDescription>
        </div>
      </ItemContent>
      <ItemActions className="flex-row gap-2">
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
            className="max-h-[85vh] max-w-full object-contain"
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
