import type { ToolUpdate } from '@ai-explore/schemas';
import { routes } from '@/config/routes';
import type { UpdateFormValues } from '../config/updateForm';
import { fromLocalized, toLocalized } from './toolDocument';

export const updateDocumentId = (version: string) => `v${version.replaceAll('.', '-')}`;

export const buildUpdateDocument = <Stamp>(values: UpdateFormValues, stamp: Stamp) => ({
  toolId: values.toolId,
  version: values.version.trim(),
  kind: values.kind,
  title: toLocalized(values.title),
  changes: values.changes.map(toLocalized),
  publishedAt: stamp,
});

export const buildUpdatePatch = (values: UpdateFormValues) => ({
  kind: values.kind,
  title: toLocalized(values.title),
  changes: values.changes.map(toLocalized),
});

export const updateToFormValues = (update: ToolUpdate): UpdateFormValues => ({
  toolId: update.toolId,
  version: update.version,
  kind: update.kind,
  title: fromLocalized(update.title),
  changes: update.changes.map(fromLocalized),
});

export const adminUpdateHref = (toolId: string, updateId: string) =>
  `${routes.admin}/updates/${encodeURIComponent(toolId)}/${encodeURIComponent(updateId)}`;
