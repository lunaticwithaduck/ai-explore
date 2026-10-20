'use client';

import { Button, Toast, ToastProvider } from '@ai-explore/ui';
import { BellRing } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function ToastDemo() {
  const t = useTranslations('dev');
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider label={t('overlays.toastLabel')} viewportLabel={t('overlays.toastViewport')}>
      <Button variant="secondary" iconLeft={BellRing} onClick={() => setOpen(true)}>
        {t('overlays.toast')}
      </Button>
      <Toast
        open={open}
        onOpenChange={setOpen}
        tone="success"
        title={t('overlays.toastTitle')}
        description={t('overlays.toastDescription')}
        closeLabel={t('overlays.close')}
        action={{
          label: t('overlays.toastAction'),
          altText: t('overlays.toastAction'),
          onClick: () => setOpen(false),
        }}
      />
    </ToastProvider>
  );
}
