/**
 * Image upload security and validation utilities
 */

// Security constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 2048; // pixels
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  base64?: string;
}

/**
 * Validates file type by checking MIME type and file extension
 */
function validateFileType(file: File): boolean {
  const mimeTypeValid = ALLOWED_MIME_TYPES.includes(
    file.type.toLowerCase() as (typeof ALLOWED_MIME_TYPES)[number],
  );
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  const extensionValid = ALLOWED_EXTENSIONS.includes(
    extension as (typeof ALLOWED_EXTENSIONS)[number],
  );

  return mimeTypeValid && extensionValid;
}

/**
 * Validates file size
 */
function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * Validates image dimensions and compresses if needed
 */
async function validateAndCompressImage(
  file: File,
): Promise<{ base64: string; valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      img.onload = () => {
        const { width, height } = img;

        // Check dimensions
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          // Compress/resize the image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve({
              base64: "",
              valid: false,
              error: "Failed to process image",
            });
            return;
          }

          // Calculate new dimensions maintaining aspect ratio
          let newWidth = width;
          let newHeight = height;

          if (width > height) {
            if (width > MAX_IMAGE_DIMENSION) {
              newWidth = MAX_IMAGE_DIMENSION;
              newHeight = Math.round((height * MAX_IMAGE_DIMENSION) / width);
            }
          } else {
            if (height > MAX_IMAGE_DIMENSION) {
              newHeight = MAX_IMAGE_DIMENSION;
              newWidth = Math.round((width * MAX_IMAGE_DIMENSION) / height);
            }
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          // Draw and compress
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);

          resolve({
            base64: compressedBase64,
            valid: true,
          });
        } else {
          // Image is within size limits, use as-is but compress quality
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve({
              base64,
              valid: true,
            });
            return;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);

          // Compress even if dimensions are fine (reduce file size)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);

          resolve({
            base64: compressedBase64,
            valid: true,
          });
        }
      };

      img.onerror = () => {
        resolve({
          base64: "",
          valid: false,
          error: "Invalid image file",
        });
      };

      img.src = base64;
    };

    reader.onerror = () => {
      resolve({
        base64: "",
        valid: false,
        error: "Failed to read file",
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates and processes an image file for upload
 * Returns base64 string if valid, error message if invalid
 */
export async function validateImageFile(
  file: File,
): Promise<ImageValidationResult> {
  // Validate file type
  if (!validateFileType(file)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // Validate file size
  if (!validateFileSize(file)) {
    return {
      valid: false,
      error: `File size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Validate dimensions and compress
  const result = await validateAndCompressImage(file);

  if (!result.valid) {
    return {
      valid: false,
      error: result.error || "Failed to process image",
    };
  }

  return {
    valid: true,
    base64: result.base64,
  };
}

/**
 * Server-side validation of base64 image data
 * Validates the image format and size without requiring DOM APIs
 */
export function validateBase64Image(base64: string): {
  valid: boolean;
  error?: string;
} {
  if (!base64 || base64.length === 0) {
    return { valid: true }; // Empty is allowed (optional field)
  }

  // Check if it's a valid data URL
  if (!base64.startsWith("data:image/")) {
    return {
      valid: false,
      error: "Invalid image format",
    };
  }

  // Extract MIME type
  const mimeMatch = base64.match(/^data:image\/([^;]+);base64,/);
  if (!mimeMatch) {
    return {
      valid: false,
      error: "Invalid image data format",
    };
  }

  const mimeType = mimeMatch[1].toLowerCase();
  if (!["jpeg", "jpg", "png", "webp"].includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid image type: ${mimeType}`,
    };
  }

  // Check base64 data size (approximate - base64 is ~33% larger than binary)
  const base64Data = base64.split(",")[1];
  if (!base64Data) {
    return {
      valid: false,
      error: "Invalid base64 data",
    };
  }

  // Approximate binary size: base64 length * 3/4
  const approximateSize = (base64Data.length * 3) / 4;
  if (approximateSize > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Image size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
}
