'use client';

import {
  BackButton,
  SegmentedControl,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  TextLink,
} from '@ai-explore/ui';
import { ExternalLink, ListChecks, PlayCircle, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { PERIODS } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';

const TABS = [
  { value: 'plans', icon: ListChecks },
  { value: 'tutorials', icon: PlayCircle },
  { value: 'reviews', icon: Star },
] as const;

const PILLS = ['all', 'saved', 'recent'] as const;

export function NavigationSection() {
  const t = useTranslations('dev');
  const [period, setPeriod] = useState<string>('quarterly');

  return (
    <DemoSection
      id="navigation"
      title={t('navigation.title')}
      description={t('navigation.description')}
    >
      <DemoRow label={t('navigation.tabs')} className="block">
        <Tabs defaultValue="plans">
          <TabsList>
            {TABS.map(({ value, icon }) => (
              <TabsTrigger key={value} value={value} icon={icon}>
                {t(`navigation.tab.${value}`)}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map(({ value }) => (
            <TabsContent key={value} value={value}>
              <Text size="sm" tone="muted">
                {t('navigation.tabBody', { tab: t(`navigation.tab.${value}`) })}
              </Text>
            </TabsContent>
          ))}
        </Tabs>
      </DemoRow>
      <DemoRow label={t('navigation.pills')} className="block">
        <Tabs defaultValue="all" variant="pill">
          <TabsList>
            {PILLS.map((value) => (
              <TabsTrigger key={value} value={value}>
                {t(`navigation.pill.${value}`)}
              </TabsTrigger>
            ))}
          </TabsList>
          {PILLS.map((value) => (
            <TabsContent key={value} value={value}>
              <Text size="sm" tone="muted">
                {t('navigation.tabBody', { tab: t(`navigation.pill.${value}`) })}
              </Text>
            </TabsContent>
          ))}
        </Tabs>
      </DemoRow>
      <DemoRow label={t('navigation.segmented')}>
        <SegmentedControl
          label={t('navigation.period')}
          value={period}
          onValueChange={setPeriod}
          options={PERIODS.map((value) => ({ value, label: t(`navigation.periods.${value}`) }))}
        />
      </DemoRow>
      <DemoRow label={t('navigation.links')} className="gap-5">
        <TextLink asChild>
          <Link href={routes.bundles}>{t('navigation.linkAccent')}</Link>
        </TextLink>
        <TextLink asChild tone="muted">
          <Link href={routes.library}>{t('navigation.linkMuted')}</Link>
        </TextLink>
        <TextLink
          href={routes.compare()}
          tone="default"
          underline="always"
          iconRight={ExternalLink}
        >
          {t('navigation.linkIcon')}
        </TextLink>
      </DemoRow>
      <DemoRow label={t('navigation.back')}>
        <BackButton asChild label={t('navigation.backLabel')}>
          <Link href={routes.library} />
        </BackButton>
        <BackButton label={t('navigation.backLabel')} size="md" />
      </DemoRow>
    </DemoSection>
  );
}
