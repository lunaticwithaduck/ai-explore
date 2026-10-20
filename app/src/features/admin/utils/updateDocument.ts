import type { UpdateFormValues } from '../config/updateForm';
import { toLocalized } from './toolDocument';

export const updateDocumentId = (version: string) => `v${version.replaceAll('.', '-')}`;

export const buildUpdateDocument = <Stamp>(values: UpdateFormValues, stamp: Stamp) => ({
  toolId: values.toolId,
  version: values.version.trim(),
  kind: values.kind,
  title: toLocalized(values.title),
  changes: values.changes.map(toLocalized),
  publishedAt: stamp,
});
