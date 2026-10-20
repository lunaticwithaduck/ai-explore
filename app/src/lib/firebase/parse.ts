import type { WithId } from '@ai-explore/schemas';
import type { z } from 'zod';

export function parseDoc<S extends z.ZodType>(
  schema: S,
  id: string,
  data: unknown,
): WithId<z.output<S>> | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(`Dropped invalid document ${id}`, result.error.issues);
    return null;
  }
  return { ...(result.data as object), id } as WithId<z.output<S>>;
}

export function parseDocs<S extends z.ZodType>(
  schema: S,
  docs: readonly { id: string; data: () => unknown }[],
): WithId<z.output<S>>[] {
  return docs
    .map((doc) => parseDoc(schema, doc.id, doc.data()))
    .filter((doc): doc is WithId<z.output<S>> => doc !== null);
}
