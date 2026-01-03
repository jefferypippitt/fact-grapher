import { IconCloud } from "@tabler/icons-react";
import type React from "react";
import { Fragment } from "react";
import { getUserImages, getUserImagesCount } from "@/actions/images";
import { Image } from "@/components/ai-elements/image";
import { DateBadge } from "@/components/date-badge";
import { ImageActions } from "@/components/image-actions";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
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

function getPaginationPages(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const showEllipsis = totalPages > 7;

  if (!showEllipsis) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

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
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i);
    }
    pages.push("ellipsis");
    pages.push(totalPages);
  }

  return pages;
}

export async function ImagesContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const [images, totalCount] = await Promise.all([
    getUserImages(currentPage, ITEMS_PER_PAGE),
    getUserImagesCount(),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (images.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconCloud />
          </EmptyMedia>
          <EmptyTitle>No Images Found</EmptyTitle>
          <EmptyDescription>
            Start generating images to see them here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup>
        {images.map((image, index) => (
          <Fragment key={image.id}>
            <Item>
              <ItemMedia variant="image">
                <Image
                  alt={image.prompt}
                  base64={image.base64}
                  className="size-full object-cover"
                  loading="lazy"
                  mediaType={image.mediaType}
                  url={image.url ?? undefined}
                />
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle>{image.prompt}</ItemTitle>
                <ItemDescription>
                  Created: <DateBadge date={image.createdAt} />
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ImageActions
                  base64={image.base64}
                  imageId={image.id}
                  mediaType={image.mediaType}
                  prompt={image.prompt}
                  url={image.url ?? undefined}
                />
              </ItemActions>
            </Item>
            {index !== images.length - 1 && <ItemSeparator />}
          </Fragment>
        ))}
      </ItemGroup>

      <div className="flex flex-col gap-4">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious
                    href={`/images?page=${currentPage - 1}`}
                  />
                ) : (
                  <PaginationPrevious
                    aria-disabled="true"
                    className="pointer-events-none opacity-50"
                    href="#"
                  />
                )}
              </PaginationItem>

              {(() => {
                const pages = getPaginationPages(currentPage, totalPages);
                const elements: React.ReactElement[] = [];
                let ellipsisCount = 0;

                for (const page of pages) {
                  if (page === "ellipsis") {
                    ellipsisCount += 1;
                    elements.push(
                      <PaginationItem key={`ellipsis-${ellipsisCount}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  } else {
                    elements.push(
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={`/images?page=${page}`}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                }

                return elements;
              })()}

              <PaginationItem>
                {currentPage < totalPages ? (
                  <PaginationNext href={`/images?page=${currentPage + 1}`} />
                ) : (
                  <PaginationNext
                    aria-disabled="true"
                    className="pointer-events-none opacity-50"
                    href="#"
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
