import type { Locale, ToolUpdate, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Badge, Heading, Text } from '@ai-explore/ui';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { formatVersion } from '@/lib/format/version';
import { UPDATE_KIND_STYLE } from '../../config/constants';

export type UpdateItemProps = {
  update: WithId<ToolUpdate>;
};

export function UpdateItem({ update }: UpdateItemProps) {
  const t = useTranslations('tool.updates');
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const kind = UPDATE_KIND_STYLE[update.kind];
  return (
    <li className="relative pb-6 pl-6 last:pb-0" data-id={update.id}>
      <span
        aria-hidden
        className="absolute top-1.5 left-0 size-2.5 -translate-x-1/2 rounded-full bg-accent"
      />
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge tone={kind.tone} icon={kind.icon}>
          {t(`kind.${update.kind}`)}
        </Badge>
        <Badge tone="outline" data-testid={TEST_IDS.tool.updateVersion}>
          {formatVersion(update.version)}
        </Badge>
        <Text as="span" size="xs" tone="subtle">
          {format.dateTime(update.publishedAt, { dateStyle: 'medium' })}
        </Text>
      </div>
      <Heading level={3} size="md" className="mb-2">
        {pickLocalized(update.title, locale)}
      </Heading>
      <ul className="flex flex-col gap-1.5">
        {update.changes.map((change) => (
          <li key={change.en} className="flex items-start gap-2">
            <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-text-subtle" />
            <Text as="span" size="sm" tone="muted">
              {pickLocalized(change, locale)}
            </Text>
          </li>
        ))}
      </ul>
    </li>
  );
}
