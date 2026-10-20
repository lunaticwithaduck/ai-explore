import type { ToolUpdate, WithId } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { ToolSection } from '../ToolSection/ToolSection';
import { UpdateItem } from '../UpdateItem/UpdateItem';

export type ToolUpdatesProps = {
  updates: WithId<ToolUpdate>[];
};

export function ToolUpdates({ updates }: ToolUpdatesProps) {
  const t = useTranslations('tool.updates');
  return (
    <ToolSection title={t('title')} data-testid={TEST_IDS.tool.updates}>
      {updates.length === 0 ? (
        <Text tone="muted">{t('empty')}</Text>
      ) : (
        <ol className="ml-1 border-l border-border">
          {updates.map((update) => (
            <UpdateItem key={update.id} update={update} />
          ))}
        </ol>
      )}
    </ToolSection>
  );
}
