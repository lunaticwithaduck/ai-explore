import { DISPLAY_NAME_MAX_LENGTH, PHOTO_URL_MAX_LENGTH } from '../config/constants';
import type { AuthUser } from '../state/authSlice';

export function deriveDisplayName(user: AuthUser): string {
  const candidates = [user.displayName, user.email?.split('@')[0], user.uid];
  const name = candidates.map((value) => value?.trim() ?? '').find((value) => value.length > 0);
  return (name ?? user.uid).slice(0, DISPLAY_NAME_MAX_LENGTH);
}

const HTTPS_URL = /^https:\/\/\S+$/;

export function safePhotoUrl(photoUrl: string | null): string | null {
  if (!photoUrl || photoUrl.length > PHOTO_URL_MAX_LENGTH || !HTTPS_URL.test(photoUrl)) return null;
  try {
    return new URL(photoUrl).protocol === 'https:' ? photoUrl : null;
  } catch {
    return null;
  }
}
