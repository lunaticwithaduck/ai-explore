import type { ReviewAuthor } from './reviewBatch';

export type ReviewAuthorSource = {
  uid: string;
};

export type ReviewAuthorProfile = {
  displayName: string;
  photoUrl: string | null;
};

export function reviewAuthor(
  user: ReviewAuthorSource,
  profile: ReviewAuthorProfile | null | undefined,
  _fallbackName?: string,
): ReviewAuthor | null {
  if (!profile) return null;
  return { uid: user.uid, displayName: profile.displayName, photoUrl: profile.photoUrl };
}
