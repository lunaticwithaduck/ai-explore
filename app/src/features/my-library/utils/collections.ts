import { COLLECTION_LIMITS } from '@ai-explore/schemas';
import { COLLECTION_COLOR_CYCLE, COLLECTION_ICON_CYCLE } from '../config/constants';

export const canAddTool = (toolIds: readonly string[], toolId: string): boolean =>
  toolIds.includes(toolId) || toolIds.length < COLLECTION_LIMITS.toolIdsMax;

export const nextCollectionStyle = (order: number) => ({
  icon: COLLECTION_ICON_CYCLE[order % COLLECTION_ICON_CYCLE.length] ?? 'folder',
  color: COLLECTION_COLOR_CYCLE[order % COLLECTION_COLOR_CYCLE.length] ?? 'blue',
});

export const collectionToolIds = (
  toolIds: readonly string[],
  available: ReadonlySet<string>,
): string[] => toolIds.filter((id) => available.has(id));
