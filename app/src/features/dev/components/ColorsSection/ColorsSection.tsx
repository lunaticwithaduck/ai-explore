import { ACCENT_NAMES, accentSolidClass, accentSubtleClass, cn, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { ACCENT_SWATCHES, SURFACE_SWATCHES, TEXT_SWATCHES } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';
import { Swatch } from '../Swatch/Swatch';

const GRID = 'grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8';

export function ColorsSection() {
  const t = useTranslations('dev');
  return (
    <DemoSection id="colors" title={t('colors.title')} description={t('colors.description')} wide>
      <DemoRow label={t('colors.surfaces')} className={GRID}>
        {SURFACE_SWATCHES.map((swatch) => (
          <Swatch key={swatch.token} {...swatch} />
        ))}
      </DemoRow>
      <DemoRow label={t('colors.accentStatus')} className={GRID}>
        {ACCENT_SWATCHES.map((swatch) => (
          <Swatch key={swatch.token} {...swatch} />
        ))}
      </DemoRow>
      <DemoRow label={t('colors.text')} className={GRID}>
        {TEXT_SWATCHES.map(({ token, className }) => (
          <div
            key={token}
            className="flex min-w-0 flex-col gap-1.5 rounded-md border border-border bg-surface p-3"
          >
            <Text as="span" size="lg" weight="semibold" className={className}>
              {t('colors.sample')}
            </Text>
            <Text as="span" size="xs" tone="muted" className="truncate font-mono">
              {token}
            </Text>
          </div>
        ))}
      </DemoRow>
      <DemoRow label={t('colors.palette')} className={GRID}>
        {ACCENT_NAMES.map((name) => (
          <div key={name} className="flex min-w-0 flex-col gap-1.5">
            <div className={cn('flex h-12 items-end rounded-md p-1.5', accentSolidClass[name])}>
              <div className={cn('size-4 rounded-xs', accentSubtleClass[name])} />
            </div>
            <Text as="span" size="xs" tone="muted" className="truncate font-mono">
              {name}
            </Text>
          </div>
        ))}
      </DemoRow>
    </DemoSection>
  );
}
