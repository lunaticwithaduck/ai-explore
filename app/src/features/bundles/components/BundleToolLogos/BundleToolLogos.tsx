import type { Tool, WithId } from '@ai-explore/schemas';
import { ToolLogo } from '@ai-explore/ui';
import { MAX_STACKED_LOGOS } from '../../config/constants';

type BundleToolLogosProps = {
  tools: WithId<Tool>[];
};

export function BundleToolLogos({ tools }: BundleToolLogosProps) {
  return (
    <div className="flex -space-x-2">
      {tools.slice(0, MAX_STACKED_LOGOS).map((tool) => (
        <ToolLogo
          key={tool.id}
          src={tool.logo.path}
          alt={tool.name}
          background={tool.logo.background}
          size="sm"
          shape="circle"
          className="ring-2 ring-surface-raised"
        />
      ))}
    </div>
  );
}
