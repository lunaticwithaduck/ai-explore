import { COLLECTION_LIMITS } from '@ai-explore/schemas';
import { z } from 'zod';

export const collectionNameSchema = z
  .string()
  .trim()
  .min(COLLECTION_LIMITS.nameMin, { error: 'validation.nameRequired' })
  .max(COLLECTION_LIMITS.nameMax, { error: 'validation.nameTooLong' });

export const collectionNameFormSchema = z.object({ name: collectionNameSchema });

export type CollectionNameValues = z.infer<typeof collectionNameFormSchema>;
