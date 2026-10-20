import type { Tool, WithId } from '@ai-explore/schemas';

export type MyLibraryViewProps = {
  tools: WithId<Tool>[];
};

export function MyLibraryView(_props: MyLibraryViewProps) {
  return null;
}
