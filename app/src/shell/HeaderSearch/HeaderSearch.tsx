'use client';

import { SearchInput } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { useRouter } from '@/i18n/navigation';

export type HeaderSearchProps = {
  className?: string;
  inputClassName?: string;
};

export function HeaderSearch({ className, inputClassName }: HeaderSearchProps) {
  const t = useTranslations('shell');
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(routes.libraryWith({ q: query.trim() || undefined }));
  };

  return (
    <search className={className}>
      <form onSubmit={handleSubmit}>
        <SearchInput
          size="sm"
          name="q"
          enterKeyHint="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          clearLabel={t('header.clearSearch')}
          placeholder={t('header.searchPlaceholder')}
          aria-label={t('header.searchLabel')}
          data-testid={TEST_IDS.shell.searchInput}
          className={inputClassName}
        />
      </form>
    </search>
  );
}
