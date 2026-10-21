import { toolUpdateSchema } from '@ai-explore/schemas';
import { describe, expect, it } from 'vitest';
import { routes } from '@/config/routes';
import type { UpdateFormValues } from '../config/updateForm';
import {
  buildUpdateDocument,
  buildUpdatePatch,
  updateDocumentId,
  updateToFormValues,
} from './updateDocument';

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

  it('patches only the editable fields and round-trips', () => {
    const values: UpdateFormValues = {
      toolId: 'midjourney',
      version: '7.1',
      kind: 'bugfix',
      title: { en: 'Fix', bg: '' },
      changes: [{ en: 'Fixed', bg: '' }],
    };
    const patch = buildUpdatePatch(values);
    expect(Object.keys(patch).sort()).toEqual(['changes', 'kind', 'title']);
    const doc = toolUpdateSchema.parse(buildUpdateDocument(values, new Date()));
    expect(updateToFormValues(doc)).toEqual(values);
  });

  it('links to the edit page under the admin route', () => {
    expect(routes.adminUpdate('midjourney', 'v7-1')).toBe('/admin/updates/midjourney/v7-1');
  });
});
