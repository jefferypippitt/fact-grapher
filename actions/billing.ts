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

    const origin =
      headersList.get("origin") || headersList.get("referer") || baseURL;

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

    if (data.url) {
      return { url: data.url };
    }

    return data;
  } catch (e) {
    console.error("Error initiating checkout:", e);
    throw e;
  }
}
