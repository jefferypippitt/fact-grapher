/**
 * Fetcher function for SWR
 * Handles server actions and API routes
 * 
 * Standard SWR pattern: fetcher receives the key as first parameter
 * For server actions, we pass a function that ignores the key and calls the action
 * For API routes, we use the key as the URL
 */
export async function fetcher<T>(
  key: string | string[],
  action?: () => Promise<T>
): Promise<T> {
  // If an action function is provided (server action pattern), call it directly
  // This allows us to use: useSWR(key, () => fetcher(key, action))
  if (action) {
    return action();
  }

  // Normalize key to string (handles array keys)
  const url = Array.isArray(key) ? key[0] : key;

  // Otherwise, treat it as a URL and fetch
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
}
