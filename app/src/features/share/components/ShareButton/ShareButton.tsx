'use client';

import {
  Button,
  Heading,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  TextLink,
} from '@ai-explore/ui';
import { Check, Link2, Share2, SquareArrowOutUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { SHARE_INTENTS } from '../../config/constants';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { buildShareIntents } from '../../utils/shareIntents';
import { shareStyles } from './ShareButton.styles';

export type ShareButtonProps = {
  url: string;
  title: string;
};

const COPIED_MS = 2000;

export function ShareButton({ url, title }: ShareButtonProps) {
  const t = useTranslations('share');
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    return () => clearTimeout(timer.current);
  }, []);

  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    clearTimeout(timer.current);
    setCopied(ok);
    setFailed(!ok);
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, COPIED_MS);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ url, title });
    } catch {
      return;
    }
  };

  const intents = buildShareIntents(url, title);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" iconLeft={Share2} data-testid={TEST_IDS.share.button}>
          {t('button')}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <Heading level={3} size="sm" className={shareStyles.heading}>
          {t('title')}
        </Heading>
        <div className={shareStyles.list}>
          <Button
            variant="ghost"
            fullWidth
            iconLeft={copied ? Check : Link2}
            className={shareStyles.item}
            onClick={handleCopy}
            data-testid={TEST_IDS.share.copyLink}
          >
            {copied ? (
              <span data-testid={TEST_IDS.share.copied}>{t('copied')}</span>
            ) : (
              t('copyLink')
            )}
          </Button>
          {canShare && (
            <Button
              variant="ghost"
              fullWidth
              iconLeft={Share2}
              className={shareStyles.item}
              onClick={handleNativeShare}
            >
              {t('native')}
            </Button>
          )}
          {SHARE_INTENTS.map(({ key, icon }) => (
            <Button
              key={key}
              asChild
              variant="ghost"
              fullWidth
              iconLeft={icon}
              iconRight={SquareArrowOutUpRight}
              className={shareStyles.item}
            >
              <TextLink
                href={intents[key]}
                tone="inherit"
                underline="none"
                target="_blank"
                rel="noopener noreferrer"
                data-id={key}
              >
                {t(key)}
              </TextLink>
            </Button>
          ))}
        </div>
        {failed && (
          <Text size="xs" tone="danger" role="status" className={shareStyles.status}>
            {t('copyFailed')}
          </Text>
        )}
      </PopoverContent>
    </Popover>
  );
}
