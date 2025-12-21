"use server";

import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function initiateCheckout(slug: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        error:
          "You must be signed in to purchase tokens. Please sign in and try again.",
      };
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
      const errorText = await response.text();
      let errorMessage = "Checkout failed. Please try again.";

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        // If error is not JSON, use the text or default message
        if (errorText) {
          errorMessage = errorText;
        }
      }

      // Log the full error for debugging
      console.error("Checkout API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return { error: errorMessage };
    }

    const data = await response.json();

    if (data.url) {
      return { url: data.url };
    }

    if (data.error) {
      return { error: data.error };
    }

    return {
      error: "Invalid response from checkout. Please try again.",
    };
  } catch (e) {
    console.error("Error initiating checkout:", e);
    const errorMessage =
      e instanceof Error
        ? e.message
        : "An unexpected error occurred. Please try again.";
    return { error: errorMessage };
  }
}
