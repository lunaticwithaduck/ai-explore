'use client';

import {
  Button,
  Dialog,
  DialogClose,
  Heading,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  Text,
  Tooltip,
} from '@ai-explore/ui';
import { Info, LayoutGrid, Library, PanelLeft, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';
import { MenuDemo } from '../MenuDemo/MenuDemo';
import { ToastDemo } from '../ToastDemo/ToastDemo';

export function OverlaysSection() {
  const t = useTranslations('dev');
  return (
    <DemoSection id="overlays" title={t('overlays.title')} description={t('overlays.description')}>
      <DemoRow label={t('overlays.modal')}>
        <Dialog
          trigger={<Button>{t('overlays.dialog')}</Button>}
          title={t('overlays.dialogTitle')}
          description={t('overlays.dialogDescription')}
          closeLabel={t('overlays.close')}
          footer={
            <>
              <DialogClose asChild>
                <Button variant="secondary">{t('overlays.cancel')}</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="danger">{t('overlays.confirm')}</Button>
              </DialogClose>
            </>
          }
        />
        <Sheet
          trigger={
            <Button variant="secondary" iconLeft={PanelLeft}>
              {t('overlays.sheet')}
            </Button>
          }
          title={t('overlays.sheetTitle')}
          closeLabel={t('overlays.close')}
        >
          <nav className="flex flex-col gap-1">
            <Button variant="ghost" iconLeft={Library} className="justify-start">
              {t('overlays.sheetLibrary')}
            </Button>
            <Button variant="ghost" iconLeft={LayoutGrid} className="justify-start">
              {t('overlays.sheetBundles')}
            </Button>
          </nav>
        </Sheet>
      </DemoRow>
      <DemoRow label={t('overlays.floating')}>
        <MenuDemo />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" iconLeft={Sparkles}>
              {t('overlays.popover')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-1">
            <Heading level={3} size="sm">
              {t('overlays.popoverTitle')}
            </Heading>
            <Text size="sm" tone="muted">
              {t('overlays.popoverBody')}
            </Text>
          </PopoverContent>
        </Popover>
        <Tooltip content={t('overlays.tooltipBody')}>
          <IconButton icon={Info} label={t('overlays.tooltip')} variant="secondary" />
        </Tooltip>
      </DemoRow>
      <DemoRow label={t('overlays.toastRow')}>
        <ToastDemo />
      </DemoRow>
    </DemoSection>
  );
}
