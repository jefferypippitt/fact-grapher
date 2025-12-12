"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

/**
 * Get the current user session
 */
export async function getUserSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (e) {
    console.error("Error getting user session:", e);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  try {
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userData) {
      throw new Error("User not found");
    }

    return userData;
  } catch (e) {
    console.error("Error getting user by ID:", e);
    throw e;
  }
}

/**
 * Delete the current user's account
 */
export async function deleteUserAccount() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    // Use Better Auth's server-side API directly
    const result = await auth.api.deleteUser({
      headers: await headers(),
      body: {},
    });

    if (!result) {
      throw new Error("Failed to delete account");
    }

    // Redirect to sign-in page after successful deletion
    redirect("/sign-in");
  } catch (e) {
    console.error("Error deleting user account:", e);
    throw e;
  }
}
