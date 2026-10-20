import { z } from 'zod';
import { localizedSchema } from './localized';

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;

export const tutorialSchema = z.object({
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  title: localizedSchema,
  durationMin: z.number().int().positive(),
  difficulty: z.enum(DIFFICULTIES),
});

export type Tutorial = z.infer<typeof tutorialSchema>;
