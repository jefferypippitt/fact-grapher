"use client";

import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { ImageListItem } from "@/components/image-list-item";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemGroup, ItemSeparator } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserImages } from "@/lib/hooks/use-user-images";

/**
 * Client-side images list using SWR
 * Automatically refetches on focus and after mutations
 */
export function ImagesList() {
  const { images, isLoading, isError } = useUserImages();

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-4 p-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton className="h-24 w-full" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto space-y-4 p-6">
        <div>
          <h1 className="text-2xl">My Images</h1>
          <p className="mt-2 text-muted-foreground">
            Failed to load images. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-4 p-6">
      <div>
        <h1 className="text-2xl">My Images</h1>
        <p className="mt-2 text-muted-foreground">
          View, download, and manage your generated infographics
        </p>
      </div>

      {images.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>No Infographics Yet</EmptyTitle>
            <EmptyDescription>
              Start generating infographics to help you understand complex
              topics.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard">Start Now</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ItemGroup>
          {images.map((image, index) => (
            <div key={image.id}>
              <ImageListItem image={image} />
              {index !== images.length - 1 && <ItemSeparator />}
            </div>
          ))}
        </ItemGroup>
      )}
    </div>
  );
}
