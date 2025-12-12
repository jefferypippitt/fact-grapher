import useSWR from "swr";
import { getAllProducts } from "@/actions/products";
import { fetcher } from "@/lib/fetcher";

type Product = {
  id: number;
  polarProductId: string;
  name: string;
  slug: string;
  price: number;
  tokenAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Reusable hook for fetching products
 * Products rarely change, so longer cache time
 */
export function useProducts() {
  const { data, error, isLoading } = useSWR<Product[]>(
    "products",
    (key) => fetcher(key, getAllProducts),
    {
      revalidateOnFocus: false, // Products don't change often
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    products: data ?? [],
    isLoading,
    isError: error,
  };
}
