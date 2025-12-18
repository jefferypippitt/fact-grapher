import { Suspense } from "react";
import { ImagesContent } from "./images-content";
import { ImagesSkeleton } from "./images-skeleton";

export default function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <div className="px-6 py-6">
      <div className="mb-8">
        <h1 className="mb-2 font-semibold text-2xl">My Images</h1>
      </div>
      <Suspense fallback={<ImagesSkeleton />}>
        <ImagesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
