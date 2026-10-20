import { Skeleton, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';

export function GateSkeleton() {
  const t = useTranslations('shell');
  return (
    <main aria-busy="true" className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8">
      <Text as="span" role="status" className="sr-only">
        {t('gate.loading')}
      </Text>
      <Skeleton shape="text" className="h-8 w-56" />
      <Skeleton shape="text" className="w-80 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton shape="card" className="h-40" />
        <Skeleton shape="card" className="h-40" />
        <Skeleton shape="card" className="h-40" />
      </div>
    </main>
  );
}
