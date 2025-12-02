/**
 * Utilities for handling Google Drive image URLs
 *
 * Converts Google Drive sharing URLs to our proxy API for:
 * - PWA offline caching support
 * - CORS avoidance
 * - Consistent loading behavior
 */

/**
 * Extracts the file ID from a Google Drive URL
 *
 * Supported formats:
 * - https://drive.google.com/file/d/{ID}/view?usp=sharing
 * - https://drive.google.com/open?id={ID}
 * - https://drive.google.com/uc?id={ID}
 * - https://lh3.googleusercontent.com/d/{ID}
 * - Just the ID itself
 */
export function extractDriveId(url: string): string | null {
  if (!url) return null;

  // If it's already just an ID (alphanumeric with dashes/underscores)
  if (/^[a-zA-Z0-9_-]+$/.test(url)) {
    return url;
  }

  // Pattern for /d/{ID} format
  const filePattern = /\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch?.[1]) {
    return fileMatch[1];
  }

  // Pattern for id={ID} query parameter
  const idPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
  const idMatch = url.match(idPattern);
  if (idMatch?.[1]) {
    return idMatch[1];
  }

  return null;
}

/**
 * Converts a Google Drive URL to our proxy API URL
 * This enables PWA caching and avoids CORS issues
 *
 * @example
 * // From sharing URL
 * getDriveImageUrl("https://drive.google.com/file/d/1Re3idCeExz1ka7sSdHnNqfEKZXbe4YZR/view?usp=sharing")
 * // Returns: "/api/drive-image/1Re3idCeExz1ka7sSdHnNqfEKZXbe4YZR"
 *
 * @example
 * // From just the ID
 * getDriveImageUrl("1Re3idCeExz1ka7sSdHnNqfEKZXbe4YZR")
 * // Returns: "/api/drive-image/1Re3idCeExz1ka7sSdHnNqfEKZXbe4YZR"
 */
export function getDriveImageUrl(driveUrl: string): string {
  const id = extractDriveId(driveUrl);

  if (!id) {
    // Return original URL if we can't extract an ID
    // This allows non-Drive URLs to pass through unchanged
    return driveUrl;
  }

  return `/api/drive-image/${id}`;
}

/**
 * Converts a Google Drive URL to direct Drive URLs (no proxy)
 * Use this when you don't need PWA caching (e.g., server-side)
 *
 * Returns object with multiple URL options to try
 */
export function getDriveDirectUrls(driveUrl: string): {
  lh3: string;
  thumbnail: string;
  export: string;
} | null {
  const id = extractDriveId(driveUrl);

  if (!id) return null;

  return {
    lh3: `https://lh3.googleusercontent.com/d/${id}`,
    thumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
    export: `https://drive.google.com/uc?export=view&id=${id}`,
  };
}

/**
 * Checks if a URL is a Google Drive URL (any type)
 */
export function isDriveUrl(url: string): boolean {
  if (!url) return false;

  return (
    url.includes('drive.google.com') ||
    url.includes('lh3.googleusercontent.com')
  );
}

/**
 * Checks if a URL is a Google Drive FILE URL that can be rendered as an image
 * Returns false for folder URLs, sharing pages, etc.
 */
export function isDriveFileUrl(url: string): boolean {
  if (!url) return false;

  // Exclude folder URLs - they can't be rendered as images
  if (url.includes('/folders/') || url.includes('/drive/folders')) {
    return false;
  }

  // Check if we can extract a file ID (this validates it's a file URL)
  const id = extractDriveId(url);
  if (!id) return false;

  // Valid file URL patterns
  return (
    url.includes('/file/d/') ||
    url.includes('/d/') ||
    url.includes('id=') ||
    url.includes('lh3.googleusercontent.com')
  );
}
