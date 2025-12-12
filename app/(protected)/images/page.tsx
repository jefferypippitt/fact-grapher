import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { getUserImages } from "@/actions/images";
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

export default async function ImagesPage() {
  const images = await getUserImages();

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
