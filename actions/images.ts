"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidateTag, unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { image } from "@/db/schema";
import { auth } from "@/lib/auth";

// Cache tag for count invalidation (images list is not cached due to size)
const getUserImagesCountCacheTag = (userId: string) =>
  `user-images-count-${userId}`;

// Fetch user images without caching - base64 data is too large for Next.js cache (2MB limit)
export async function getUserImages(page = 1, limit = 7) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const offset = (page - 1) * limit;

  return await db
    .select()
    .from(image)
    .where(eq(image.userId, session.user.id))
    .orderBy(desc(image.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUserImagesCount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const cachedFn = unstable_cache(
    async () => {
      const [result] = await db
        .select({ count: count() })
        .from(image)
        .where(eq(image.userId, session.user.id));

      return result?.count ?? 0;
    },
    [`user-images-count-${session.user.id}`],
    {
      revalidate: 60,
      tags: [getUserImagesCountCacheTag(session.user.id)],
    }
  );

  return cachedFn();
}

// Helper to invalidate user's image count cache immediately
// Using { expire: 0 } for immediate invalidation (critical for delete/create operations)
function invalidateUserImageCountCache(userId: string) {
  revalidateTag(getUserImagesCountCacheTag(userId), { expire: 0 });
}

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

  // Invalidate the user's image cache (both list and count)
  invalidateUserImageCountCache(session.user.id);

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

  // Invalidate the user's image cache (both list and count)
  invalidateUserImageCountCache(session.user.id);

  return { success: true };
}
