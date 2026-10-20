import { toolUpdateSchema } from '@ai-explore/schemas';
import { describe, expect, it } from 'vitest';
import type { UpdateFormValues } from '../config/updateForm';
import { buildUpdateDocument, updateDocumentId } from './updateDocument';

describe('update document', () => {
  it('builds a document that passes toolUpdateSchema', () => {
    const values: UpdateFormValues = {
      toolId: 'midjourney',
      version: '7.1',
      kind: 'improvement',
      title: { en: 'Faster', bg: '' },
      changes: [{ en: 'Quicker renders', bg: 'По-бързи' }],
    };
    const doc = buildUpdateDocument(values, new Date('2026-10-21T00:00:00.000Z'));
    expect(toolUpdateSchema.safeParse(doc).success).toBe(true);
    expect(updateDocumentId('7.1')).toBe('v7-1');
  });
});
