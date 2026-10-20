'use client';

import { ErrorView } from '@/features/system/error/ErrorView';

export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorView onRetry={reset} />;
}
