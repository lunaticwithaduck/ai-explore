'use client';

import type { Locale, Tutorial } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Button, Card, Image, Text } from '@ai-explore/ui';
import { Clock, GraduationCap, Play } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { embedUrl, thumbnailUrl } from '../../utils/youtube';
import { tutorialItemStyles as styles } from './TutorialItem.styles';

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
      className={styles.root}
      data-testid={TEST_IDS.tool.tutorialItem}
      data-id={tutorial.youtubeId}
    >
      <div className={styles.media}>
        {playing ? (
          <iframe
            src={embedUrl(tutorial.youtubeId)}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            className={styles.frame}
          />
        ) : (
          <Button
            variant="ghost"
            aria-label={t('play', { title })}
            onClick={() => setPlaying(true)}
            className={styles.play}
          >
            <Image
              src={thumbnailUrl(tutorial.youtubeId)}
              alt={title}
              fit="cover"
              className="size-full"
            />
            <span aria-hidden className={styles.playIcon}>
              <Play className="size-5 fill-current" />
            </span>
          </Button>
        )}
      </div>
      <div className={styles.body}>
        <Text size="sm" weight="medium" clamp={2}>
          {title}
        </Text>
        <div className={styles.meta}>
          <Text as="span" size="xs" tone="muted" className={styles.metaItem}>
            <Clock aria-hidden className={styles.metaIcon} />
            {t('duration', { minutes: tutorial.durationMin })}
          </Text>
          <Text as="span" size="xs" tone="muted" className={styles.metaItem}>
            <GraduationCap aria-hidden className={styles.metaIcon} />
            {t(`difficulty.${tutorial.difficulty}`)}
          </Text>
        </div>
      </div>
    </Card>
  );
}
