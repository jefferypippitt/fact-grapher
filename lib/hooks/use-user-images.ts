import { useRouter } from "next/navigation";
import { useCallback } from "react";
import useSWR from "swr";
import { getUserImages, getUserImagesCount } from "@/actions/images";
import { fetcher } from "@/lib/fetcher";

type ImageData = {
  id: string;
  prompt: string;
  base64: string;
  mediaType: string;
  createdAt: Date;
  tokensUsed: number | null;
  userId: string;
};

/**
 * Reusable hook for fetching user images with pagination support
 * Uses SWR for client-side caching + Next.js router.refresh for server cache sync
 */
export function useUserImages(page = 1, limit = 7) {
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR<ImageData[]>(
    ["user-images", page, limit],
    () => fetcher("user-images", () => getUserImages(page, limit)),
    {
      revalidateOnFocus: false, // Server cache handles freshness
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Dedupe requests within 5s
      keepPreviousData: true, // Keep showing previous page while loading
    }
  );

  const { data: totalCount } = useSWR<number>(
    "user-images-count",
    () => fetcher("user-images-count", getUserImagesCount),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  // Optimistic update for deletion - immediately removes from UI
  const optimisticDelete = useCallback(
    async (imageId: string) => {
      // Optimistically update the local cache
      await mutate(
        (currentData) =>
          currentData?.filter((img) => img.id !== imageId) ?? [],
        { revalidate: false } // Don't revalidate yet
      );
    },
    [mutate]
  );

  // Full refetch - syncs with server after mutation
  const refetch = useCallback(async () => {
    // Refresh the router to get fresh server data (revalidated cache)
    router.refresh();
    // Also revalidate SWR cache
    await mutate();
  }, [router, mutate]);

  return {
    images: data ?? [],
    totalCount: totalCount ?? 0,
    totalPages: Math.ceil((totalCount ?? 0) / limit),
    isLoading,
    isError: error,
    // For optimistic UI updates
    optimisticDelete,
    // Full refetch after server mutation
    refetch,
  };
}
