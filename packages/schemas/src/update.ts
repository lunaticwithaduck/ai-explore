import { z } from 'zod';
import { slugSchema, timestampSchema } from './common';
import { localizedSchema } from './localized';

export const UPDATE_KINDS = ['feature', 'improvement', 'bugfix'] as const;

export const toolUpdateSchema = z.object({
  toolId: slugSchema,
  version: z.string().regex(/^\d+(?:\.\d+){0,3}$/),
  kind: z.enum(UPDATE_KINDS),
  title: localizedSchema,
  changes: z.array(localizedSchema).min(1),
  publishedAt: timestampSchema,
});

export type ToolUpdate = z.infer<typeof toolUpdateSchema>;
