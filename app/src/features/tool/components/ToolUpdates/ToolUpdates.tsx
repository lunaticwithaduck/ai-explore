import type { ToolUpdate, WithId } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { Sparkles } from 'lucide-react';
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
    <ToolSection title={t('title')} icon={Sparkles} data-testid={TEST_IDS.tool.updates}>
      {updates.length === 0 ? (
        <Text tone="muted">{t('empty')}</Text>
      ) : (
        <ol className="flex flex-col gap-4">
          {updates.map((update) => (
            <UpdateItem key={update.id} update={update} />
          ))}
        </ol>
      )}
    </ToolSection>
  );
}
