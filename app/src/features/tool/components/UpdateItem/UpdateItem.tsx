import type { Locale, ToolUpdate, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { cn, Heading, Text } from '@ai-explore/ui';
import { Calendar } from 'lucide-react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { formatVersion } from '@/lib/format/version';
import { UPDATE_KIND_ICON } from '../../config/constants';
import { updateItemStyles as styles } from './UpdateItem.styles';

export type UpdateItemProps = {
  update: WithId<ToolUpdate>;
};

export function UpdateItem({ update }: UpdateItemProps) {
  const t = useTranslations('tool.updates');
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const Icon = UPDATE_KIND_ICON[update.kind];
  const tone = styles.tone[update.kind];
  return (
    <li className={styles.root} data-id={update.id}>
      <div className={styles.labels}>
        <Text as="span" tone="inherit" className={cn(styles.kind, tone.badge)}>
          <Icon aria-hidden className={styles.kindIcon} />
          {t(`kind.${update.kind}`)}
        </Text>
        <Text as="span" size="xs" tone="muted" data-testid={TEST_IDS.tool.updateVersion}>
          {t('version', { version: formatVersion(update.version) })}
        </Text>
      </div>
      <Heading level={3} className={styles.title}>
        {pickLocalized(update.title, locale)}
      </Heading>
      <Text as="span" size="xs" tone="muted" className={styles.date}>
        <Calendar aria-hidden className={styles.dateIcon} />
        <time dateTime={update.publishedAt.toISOString()}>
          {format.dateTime(update.publishedAt, { dateStyle: 'medium' })}
        </time>
      </Text>
      <ul className={styles.changes}>
        {update.changes.map((change) => (
          <li key={change.en} className="flex items-start gap-2">
            <span aria-hidden className={cn(styles.bullet, tone.bullet)} />
            <Text as="span" size="sm" tone="muted">
              {pickLocalized(change, locale)}
            </Text>
          </li>
        ))}
      </ul>
    </li>
  );
}
