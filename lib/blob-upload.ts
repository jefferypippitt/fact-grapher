"use server";

import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

/**
 * Uploads a base64-encoded image to Vercel Blob Storage
 * @param base64 - Base64-encoded image data (without data URI prefix)
 * @param mediaType - MIME type of the image (e.g., "image/png")
 * @param filename - Optional filename for the blob (defaults to generated ID)
 * @returns The URL of the uploaded blob
 */
export async function uploadBase64ToBlob(
  base64: string,
  mediaType: string,
  filename?: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not configured. Please add it to your environment variables."
    );
  }

  // Convert base64 to Buffer
  const buffer = Buffer.from(base64, "base64");

  // Generate filename if not provided
  const fileId = filename || nanoid();
  const extension = mediaType.split("/")[1] || "png";
  const blobFilename = `images/${fileId}.${extension}`;

  // Upload to Vercel Blob
  const blob = await put(blobFilename, buffer, {
    access: "public",
    contentType: mediaType,
    token,
  });

  return blob.url;
}

