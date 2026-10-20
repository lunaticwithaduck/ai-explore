import { DISPLAY_NAME_MAX } from '@ai-explore/schemas';
import { z } from 'zod';

export const displayNameSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, { error: 'validation.displayNameRequired' })
    .max(DISPLAY_NAME_MAX, { error: 'validation.displayNameTooLong' }),
});

export type DisplayNameValues = z.infer<typeof displayNameSchema>;
