import { usePathname } from "next/navigation";
import useSWR from "swr";
import { getUserTokens } from "@/actions/tokens";
import { fetcher } from "@/lib/fetcher";

/**
 * Reusable hook for fetching user tokens
 * Follows SWR documentation patterns for reusable data hooks
 */
export function useUserTokens() {
  const pathname = usePathname();
  // Using pathname in the key ensures refetch when route changes
  const { data, error, isLoading, mutate } = useSWR(
    ["user-tokens", pathname],
    (key) => fetcher(key, getUserTokens),
    {
      revalidateOnFocus: true, // Refetch when window regains focus
      revalidateOnReconnect: true, // Refetch when network reconnects
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
    }
  );

  return {
    tokenCount: data ?? 0,
    isLoading,
    isError: error,
    // Expose mutate for manual refetching (e.g., after token deduction)
    refetch: mutate,
  };
}
