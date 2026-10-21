import type { Tool, WithId } from '@ai-explore/schemas';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { ComplementaryCard } from '../ComplementaryCard/ComplementaryCard';
import { ToolSection } from '../ToolSection/ToolSection';
import { ToolWorkflow } from '../ToolWorkflow/ToolWorkflow';

export type ToolComplementaryProps = {
  tool: WithId<Tool>;
  complementary: WithId<Tool>[];
};

export function ToolComplementary({ tool, complementary }: ToolComplementaryProps) {
  const t = useTranslations('tool.complementary');
  if (complementary.length === 0) return null;
  return (
    <ToolSection
      title={t('title')}
      description={t('description', { name: tool.name })}
      data-testid={TEST_IDS.tool.complementary}
    >
      <ToolWorkflow tool={tool} complementary={complementary} />
      <ul className="grid gap-4 md:grid-cols-3">
        {complementary.map((other) => (
          <li key={other.id} data-id={other.id}>
            <ComplementaryCard tool={other} />
          </li>
        ))}
      </ul>
    </ToolSection>
  );
}
