import { Avatar, Separator, Skeleton, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { SAMPLE_LOGOS } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';

const AVATAR_SIZES = ['sm', 'md', 'lg', 'xl'] as const;

export function FeedbackSection() {
  const t = useTranslations('dev');
  return (
    <DemoSection id="feedback" title={t('feedback.title')} description={t('feedback.description')}>
      <DemoRow label={t('feedback.avatars')}>
        {AVATAR_SIZES.map((size) => (
          <Avatar
            key={size}
            size={size}
            alt={t('feedback.avatarName')}
            fallback={t('feedback.initials')}
          />
        ))}
        <Avatar
          size="lg"
          src={SAMPLE_LOGOS[0].src}
          alt={t('feedback.avatarName')}
          fallback={t('feedback.initials')}
        />
      </DemoRow>
      <DemoRow label={t('feedback.skeletons')} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-card border border-border p-3">
          <Skeleton shape="circle" className="size-10 shrink-0" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton shape="text" className="w-2/3" />
            <Skeleton shape="text" className="h-3 w-1/2" />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-card border border-border p-3">
          <Skeleton shape="rect" className="h-16 w-full" />
          <Skeleton shape="text" className="w-3/4" />
        </div>
      </DemoRow>
      <DemoRow label={t('feedback.separators')} className="flex-col items-stretch gap-3">
        <Separator />
        <div className="flex h-6 items-center gap-3">
          <Text as="span" size="sm" tone="muted">
            {t('feedback.developer')}
          </Text>
          <Separator orientation="vertical" />
          <Text as="span" size="sm" tone="muted">
            {t('feedback.version')}
          </Text>
          <Separator orientation="vertical" />
          <Text as="span" size="sm" tone="muted">
            {t('feedback.category')}
          </Text>
        </div>
      </DemoRow>
    </DemoSection>
  );
}
