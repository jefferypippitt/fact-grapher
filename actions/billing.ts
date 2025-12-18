"use server";

import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function initiateCheckout(slug: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const cookieStore = await cookies();
    const headersList = await headers();
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Get origin from request headers (required by Better Auth)
    const origin =
      headersList.get("origin") || headersList.get("referer") || baseURL;

    // Call the Better Auth API checkout endpoint
    const response = await fetch(`${baseURL}/api/auth/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        Referer: origin,
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ slug }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Checkout failed" }));
      throw new Error(error.message || "Checkout failed");
    }

    const data = await response.json();

    // If the response contains a redirect URL, return it
    if (data.url) {
      return { url: data.url };
    }

    return data;
  } catch (e) {
    console.error("Error initiating checkout:", e);
    throw e;
  }
}
