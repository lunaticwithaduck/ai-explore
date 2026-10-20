import { toolUpdateSchema } from '@ai-explore/schemas';
import { z } from 'zod';
import { localizedFormSchema } from './toolForm';

export const updateFormSchema = toolUpdateSchema
  .pick({ toolId: true, version: true, kind: true })
  .extend({
    title: localizedFormSchema,
    changes: z.array(localizedFormSchema).min(1),
  });

export type UpdateFormValues = z.infer<typeof updateFormSchema>;

export const defaultUpdateFormValues = (): UpdateFormValues => ({
  toolId: '',
  version: '',
  kind: 'feature',
  title: { en: '', bg: '' },
  changes: [{ en: '', bg: '' }],
});
