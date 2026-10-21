import { Text } from '@ai-explore/ui';
import { Clock, User } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

export type ToolHeaderMetaProps = {
  developer: string;
  updatedAt: Date;
};

export function ToolHeaderMeta({ developer, updatedAt }: ToolHeaderMetaProps) {
  const t = useTranslations('tool.header');
  const format = useFormatter();
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <Text tone="muted" className="flex items-center gap-2">
        <User aria-hidden className="size-4 shrink-0" />
        <span className="sr-only">{t('developerLabel')} </span>
        {developer}
      </Text>
      <Text tone="muted" className="flex items-center gap-2">
        <Clock aria-hidden className="size-4 shrink-0" />
        <time dateTime={updatedAt.toISOString()}>
          {t('updated', { date: format.dateTime(updatedAt, { dateStyle: 'medium' }) })}
        </time>
      </Text>
    </div>
  );
}
