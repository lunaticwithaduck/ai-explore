import { DISPLAY_NAME_MAX } from '@ai-explore/schemas';
import { z } from 'zod';
import { PHOTO_URL_MAX } from '../config/constants';
import type { ReviewAuthor } from './reviewBatch';

export type ReviewAuthorSource = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
};

export type ReviewAuthorProfile = {
  displayName: string;
  photoUrl: string | null;
};

const photoUrlSchema = z.url().max(PHOTO_URL_MAX);

const HIGH_SURROGATE = /[\uD800-\uDBFF]$/;

const clip = (value: string) => value.slice(0, DISPLAY_NAME_MAX).replace(HIGH_SURROGATE, '').trim();

export function reviewAuthor(
  user: ReviewAuthorSource,
  profile: ReviewAuthorProfile | null | undefined,
  fallbackName: string,
): ReviewAuthor {
  const name = [profile?.displayName, user.displayName, user.email?.split('@')[0]]
    .map((candidate) => clip(candidate ?? ''))
    .find((candidate) => candidate.length > 0);
  const photo = [profile?.photoUrl, user.photoUrl].find(
    (candidate) => photoUrlSchema.safeParse(candidate).success,
  );
  return { uid: user.uid, displayName: name ?? clip(fallbackName), photoUrl: photo ?? null };
}
