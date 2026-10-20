import { z } from 'zod';
import { localizedSchema } from './localized';

export const categorySchema = z.object({
  name: localizedSchema,
  icon: z.string().min(1),
  order: z.number().int().nonnegative(),
});

export type Category = z.infer<typeof categorySchema>;
