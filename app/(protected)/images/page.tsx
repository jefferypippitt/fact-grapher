import { format } from "date-fns";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { getUserImages, getUserImagesCount } from "@/actions/images";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 7;

function getPaginationPages(currentPage: number, totalPages: number) {
  const pages: (number | "ellipsis")[] = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    pages.push(1);

    if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push("ellipsis");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push("ellipsis");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("ellipsis");
      pages.push(totalPages);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return pages;
}

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const [images, totalCount] = await Promise.all([
    getUserImages(currentPage, ITEMS_PER_PAGE),
    getUserImagesCount(),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto space-y-3 p-4">
      <div>
        <h1 className="font-semibold text-2xl">My Images</h1>
        <p className="mt-1 text-muted-foreground text-sm">
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
        <>
          <ItemGroup>
            {images.map((image, index) => (
              <div key={image.id}>
                <ImageListItem
                  image={{
                    ...image,
                    createdAt: format(new Date(image.createdAt), "PPp"),
                  }}
                />
                {index !== images.length - 1 && <ItemSeparator />}
              </div>
            ))}
          </ItemGroup>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/images?page=${currentPage - 1}`}
                    />
                  </PaginationItem>
                )}
                {getPaginationPages(currentPage, totalPages).map((page) => {
                  if (page === "ellipsis") {
                    return (
                      <PaginationItem key="ellipsis">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/images?page=${page}`}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/images?page=${currentPage + 1}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
