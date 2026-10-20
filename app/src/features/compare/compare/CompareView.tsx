import type { Tool, WithId } from '@ai-explore/schemas';

export type CompareViewProps = {
  tools: WithId<Tool>[];
  firstId: string | undefined;
  secondId: string | undefined;
};

export function CompareView(_props: CompareViewProps) {
  return null;
}
