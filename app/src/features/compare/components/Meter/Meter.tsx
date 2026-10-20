import { Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { meterStyles } from './Meter.styles';

export type MeterProps = {
  value: number;
};

const SEGMENTS = [1, 2, 3, 4, 5] as const;

export function Meter({ value }: MeterProps) {
  const t = useTranslations('compare');
  return (
    <div className={meterStyles.root}>
      <div role="img" aria-label={t('values.meter', { value })} className={meterStyles.bar}>
        {SEGMENTS.map((segment) => (
          <span
            key={segment}
            className={`${meterStyles.segment} ${segment <= value ? meterStyles.on : meterStyles.off}`}
          />
        ))}
      </div>
      <Text size="xs" tone="muted" numeric aria-hidden>
        {t('values.fraction', { value })}
      </Text>
    </div>
  );
}
