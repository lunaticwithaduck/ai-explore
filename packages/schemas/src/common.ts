import { z } from 'zod';

export const LOCALES = ['en', 'bg'] as const;
export const localeSchema = z.enum(LOCALES);
export type Locale = z.infer<typeof localeSchema>;

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
export const centsSchema = z.number().int().nonnegative();

type TimestampLike = { toDate: () => Date };

const isTimestampLike = (value: unknown): value is TimestampLike =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Partial<TimestampLike>).toDate === 'function';

export const timestampSchema = z.union([
  z.date(),
  z.custom<TimestampLike>(isTimestampLike).transform((value) => value.toDate()),
]);

export const ACCENTS = [
  'blue',
  'violet',
  'pink',
  'amber',
  'emerald',
  'cyan',
  'rose',
  'slate',
] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export type WithId<T> = T & { id: string };
