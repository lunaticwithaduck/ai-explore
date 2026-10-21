'use client';

import type { Locale, Tutorial } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Badge, Button, Card, Image, Text } from '@ai-explore/ui';
import { Clock, Play } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { DIFFICULTY_TONE } from '../../config/constants';
import { embedUrl, thumbnailUrl } from '../../utils/youtube';

export type TutorialItemProps = {
  tutorial: Tutorial;
};

export function TutorialItem({ tutorial }: TutorialItemProps) {
  const t = useTranslations('tool.tutorials');
  const locale = useLocale() as Locale;
  const [playing, setPlaying] = useState(false);
  const title = pickLocalized(tutorial.title, locale);
  return (
    <Card
      variant="flat"
      padding="none"
      className="flex h-full flex-col overflow-hidden"
      data-testid={TEST_IDS.tool.tutorialItem}
      data-id={tutorial.youtubeId}
    >
      <div className="relative aspect-video w-full bg-surface-sunken">
        {playing ? (
          <iframe
            src={embedUrl(tutorial.youtubeId)}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <Button
            variant="ghost"
            aria-label={t('play', { title })}
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 size-full rounded-none p-0"
          >
            <Image
              src={thumbnailUrl(tutorial.youtubeId)}
              alt={title}
              fit="cover"
              className="size-full"
            />
            <span
              aria-hidden
              className="absolute flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-overlay transition-transform duration-fast group-hover:scale-110"
            >
              <Play className="size-5" />
            </span>
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Text weight="medium" clamp={2}>
          {title}
        </Text>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <Badge icon={Clock}>{t('duration', { minutes: tutorial.durationMin })}</Badge>
          <Badge tone={DIFFICULTY_TONE[tutorial.difficulty]}>
            {t(`difficulty.${tutorial.difficulty}`)}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
