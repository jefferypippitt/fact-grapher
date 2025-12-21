"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cacheLife, cacheTag, revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { image } from "@/db/schema";
import { auth } from "@/lib/auth";
import { uploadBase64ToBlob } from "@/lib/blob-upload";

const getUserImagesCountCacheTag = (userId: string) =>
  `user-images-count-${userId}`;
const getUserImagesCacheTag = (userId: string, page: number, limit: number) =>
  `user-images-${userId}-${page}-${limit}`;

const getUserImagesGeneralTag = (userId: string) => `user-images-${userId}`;

async function getCachedUserImages(
  userId: string,
  page: number,
  limit: number
) {
  "use cache";
  cacheLife({
    stale: 120,
    revalidate: 300,
    expire: 600,
  });
  cacheTag(getUserImagesCacheTag(userId, page, limit));
  cacheTag(getUserImagesGeneralTag(userId));

  const offset = (page - 1) * limit;

  return await db
    .select()
    .from(image)
    .where(eq(image.userId, userId))
    .orderBy(desc(image.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUserImages(page = 1, limit = 7) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return await getCachedUserImages(session.user.id, page, limit);
}

async function getCachedUserImagesCount(userId: string) {
  "use cache";
  cacheLife({
    stale: 30,
    revalidate: 60,
    expire: 120,
  });
  cacheTag(getUserImagesCountCacheTag(userId));
  cacheTag(getUserImagesGeneralTag(userId));

  const [result] = await db
    .select({ count: count() })
    .from(image)
    .where(eq(image.userId, userId));

  const countValue = result?.count;
  const finalCount =
    typeof countValue === "bigint" ? Number(countValue) : (countValue ?? 0);

  return finalCount;
}

export async function getUserImagesCount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return await getCachedUserImagesCount(session.user.id);
}

function invalidateUserImageCountCache(userId: string) {
  revalidateTag(getUserImagesCountCacheTag(userId), "max");
}

function invalidateUserImagesCache(userId: string) {
  revalidateTag(getUserImagesGeneralTag(userId), "max");
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

  const imageId = nanoid();

  let imageUrl: string | undefined;
  try {
    imageUrl = await uploadBase64ToBlob(base64, mediaType, imageId);
  } catch {
    // Continue without URL - base64 will be stored in database
    // Blob upload failure is non-critical as we have base64 fallback
  }

  try {
    const [savedImage] = await db
      .insert(image)
      .values({
        id: imageId,
        userId: session.user.id,
        prompt,
        base64,
        url: imageUrl,
        mediaType,
        tokensUsed: tokensCost,
      })
      .returning();

    // Invalidate caches and revalidate paths
    invalidateUserImageCountCache(session.user.id);
    invalidateUserImagesCache(session.user.id);
    revalidatePath("/images", "page");
    revalidatePath("/images", "layout");

    return { id: savedImage.id };
  } catch (error) {
    throw new Error(
      `Failed to save image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function deleteImage(imageId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const [deletedImage] = await db
    .delete(image)
    .where(and(eq(image.id, imageId), eq(image.userId, session.user.id)))
    .returning();

  if (!deletedImage) {
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

  invalidateUserImageCountCache(session.user.id);
  invalidateUserImagesCache(session.user.id);
  revalidatePath("/images");

  return { success: true };
}
