"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

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
