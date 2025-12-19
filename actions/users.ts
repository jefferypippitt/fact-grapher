"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

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

export async function deleteUserAccount() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const result = await auth.api.deleteUser({
      headers: await headers(),
      body: {},
    });

    if (!result) {
      throw new Error("Failed to delete account");
    }

    redirect("/sign-in");
  } catch (e) {
    console.error("Error deleting user account:", e);
    throw e;
  }
}
