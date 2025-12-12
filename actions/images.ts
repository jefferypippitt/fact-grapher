"use server";

import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db/drizzle";
import { image } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getUserImages = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return await db
    .select()
    .from(image)
    .where(eq(image.userId, session.user.id))
    .orderBy(desc(image.createdAt));
});

export async function saveImage(
  prompt: string,
  base64: string,
  mediaType: string,
  tokensCost = 0
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Note: Tokens are already deducted in the chat API route before calling this function
  // This tokensCost parameter is only for tracking purposes in the database
  // We don't deduct tokens here since the chat request already handles it

  const imageId = nanoid();

  const [savedImage] = await db
    .insert(image)
    .values({
      id: imageId,
      userId: session.user.id,
      prompt,
      base64,
      mediaType,
      tokensUsed: tokensCost,
    })
    .returning();

  revalidatePath("/images");

  return { id: savedImage.id };
}

export async function deleteImage(imageId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Delete the image and verify ownership in a single query
  const [deletedImage] = await db
    .delete(image)
    .where(and(eq(image.id, imageId), eq(image.userId, session.user.id)))
    .returning();

  if (!deletedImage) {
    // Check if image exists but doesn't belong to user
    const [existingImage] = await db
      .select()
      .from(image)
      .where(eq(image.id, imageId))
      .limit(1);

    if (!existingImage) {
      throw new Error("Image not found");
    }

    throw new Error("Forbidden");
  }

  revalidatePath("/images");

  return { success: true };
}
