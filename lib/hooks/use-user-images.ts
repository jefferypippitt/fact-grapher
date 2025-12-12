import useSWR from "swr";
import { getUserImages } from "@/actions/images";
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
 * Reusable hook for fetching user images
 * Automatically refetches on focus and reconnection
 */
export function useUserImages() {
  const { data, error, isLoading, mutate } = useSWR<ImageData[]>(
    "user-images",
    (key) => fetcher(key, getUserImages),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  return {
    images: data ?? [],
    isLoading,
    isError: error,
    // Expose mutate for manual refetching (e.g., after delete)
    refetch: mutate,
  };
}
