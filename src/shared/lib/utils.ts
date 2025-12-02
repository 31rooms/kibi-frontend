import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export Drive image utilities
export {
  getDriveImageUrl,
  getDriveDirectUrls,
  extractDriveId,
  isDriveUrl,
  isDriveFileUrl,
} from './utils/driveImage';
