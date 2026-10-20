'use client';

import type { Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Heading, Text, TextLink, ToolLogo } from '@ai-explore/ui';
import { Check, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { formatCents } from '@/lib/format/money';
import { Meter } from '../Meter/Meter';
import { tableStyles } from './CompareTable.styles';

export type CompareTableProps = {
  first: WithId<Tool>;
  second: WithId<Tool>;
  locale: Locale;
};

type RowKey =
  | 'price'
  | 'freePlan'
  | 'trial'
  | 'features'
  | 'api'
  | 'integrations'
  | 'speed'
  | 'quality'
  | 'bestUse';

const ROW_KEYS: RowKey[] = [
  'price',
  'freePlan',
  'trial',
  'features',
  'api',
  'integrations',
  'speed',
  'quality',
  'bestUse',
];

export function CompareTable({ first, second, locale }: CompareTableProps) {
  const t = useTranslations('compare');
  const tools = [first, second];

  const yesNo = (value: boolean) => (
    <span className={tableStyles.yesNo}>
      {value ? (
        <Check aria-hidden className={tableStyles.yes} />
      ) : (
        <Minus aria-hidden className={tableStyles.no} />
      )}
      {value ? t('values.yes') : t('values.no')}
    </span>
  );

  const renderCell = (key: RowKey, tool: WithId<Tool>): ReactNode => {
    switch (key) {
      case 'price':
        return tool.pricing.fromPriceCents === undefined
          ? t('values.unknown')
          : t('values.perMonth', { price: formatCents(tool.pricing.fromPriceCents, locale) });
      case 'freePlan':
        return yesNo(tool.pricing.hasFreePlan);
      case 'trial':
        return tool.pricing.trialDays === undefined
          ? yesNo(false)
          : t('values.trialDays', { days: tool.pricing.trialDays });
      case 'features':
        return tool.features.length === 0 ? (
          t('values.noFeatures')
        ) : (
          <ul className={tableStyles.features}>
            {tool.features.map((feature) => (
              <li key={feature.en}>{pickLocalized(feature, locale)}</li>
            ))}
          </ul>
        );
      case 'api':
        return t(`values.api.${tool.comparison.apiAccess}`);
      case 'integrations':
        return t('values.integrations', { count: tool.comparison.integrations });
      case 'speed':
        return <Meter value={tool.comparison.speed} />;
      case 'quality':
        return <Meter value={tool.comparison.outputQuality} />;
      case 'bestUse':
        return pickLocalized(tool.comparison.bestUseCase, locale);
    }
  };

  return (
    <div className={tableStyles.scroller}>
      <table
        aria-label={t('tableLabel', { first: first.name, second: second.name })}
        className={tableStyles.table}
        data-testid={TEST_IDS.compare.table}
      >
        <thead>
          <tr>
            <th scope="col" className={tableStyles.corner}>
              <Text size="xs" tone="subtle" className="uppercase tracking-wide">
                {t('featureColumn')}
              </Text>
            </th>
            {tools.map((tool) => (
              <th
                key={tool.id}
                scope="col"
                className={tableStyles.column}
                data-testid={TEST_IDS.compare.column}
                data-id={tool.slug}
              >
                <div className={tableStyles.columnHead}>
                  <ToolLogo
                    src={tool.logo.path}
                    alt={tool.name}
                    background={tool.logo.background}
                    size="md"
                  />
                  <Heading level={2} size="sm">
                    <TextLink asChild tone="default" underline="hover">
                      <Link href={routes.tool(tool.slug)}>{tool.name}</Link>
                    </TextLink>
                  </Heading>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROW_KEYS.map((key) => (
            <tr key={key} data-id={key}>
              <th scope="row" className={tableStyles.rowLabel}>
                {t(`rows.${key}`)}
              </th>
              {tools.map((tool) => (
                <td key={tool.id} className={tableStyles.cell} data-id={tool.slug}>
                  {renderCell(key, tool)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
