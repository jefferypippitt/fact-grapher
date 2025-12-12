import useSWR from "swr";
import { getUserSession } from "@/actions/users";
import { fetcher } from "@/lib/fetcher";

type Session = Awaited<ReturnType<typeof getUserSession>>;

/**
 * Reusable hook for fetching user session
 * Can be used across client components to access user data
 */
export function useUser() {
  const { data, error, isLoading } = useSWR<Session>(
    "user-session",
    (key) => fetcher(key, getUserSession),
    {
      revalidateOnFocus: false, // Session doesn't change often
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Longer dedupe for session
    }
  );

  return {
    user: data?.user,
    session: data,
    isLoading,
    isError: error,
    isAuthenticated: !!data?.user,
  };
}
