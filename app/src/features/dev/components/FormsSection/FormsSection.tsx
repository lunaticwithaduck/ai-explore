'use client';

import {
  Checkbox,
  Input,
  Label,
  SearchInput,
  Select,
  Switch,
  Text,
  Textarea,
} from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SORT_OPTIONS } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';

const FIELD = 'flex w-full flex-col gap-1.5 sm:w-auto sm:min-w-64 sm:flex-1';

export function FormsSection() {
  const t = useTranslations('dev');
  const [query, setQuery] = useState(t('forms.searchValue'));
  const [sort, setSort] = useState<string>('rating');
  const [notify, setNotify] = useState(true);
  const [terms, setTerms] = useState(false);

  return (
    <DemoSection id="forms" title={t('forms.title')} description={t('forms.description')}>
      <DemoRow label={t('forms.search')}>
        <SearchInput
          size="lg"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          clearLabel={t('forms.clear')}
          placeholder={t('forms.searchPlaceholder')}
          aria-label={t('forms.search')}
        />
      </DemoRow>
      <DemoRow label={t('forms.fields')} className="items-start">
        <div className={FIELD}>
          <Label htmlFor="dev-name">{t('forms.nameLabel')}</Label>
          <Input id="dev-name" placeholder={t('forms.namePlaceholder')} />
        </div>
        <div className={FIELD}>
          <Label htmlFor="dev-email">{t('forms.emailLabel')}</Label>
          <Input id="dev-email" type="email" invalid defaultValue={t('forms.emailValue')} />
          <Text size="xs" tone="danger">
            {t('forms.emailError')}
          </Text>
        </div>
        <div className={FIELD}>
          <Label htmlFor="dev-disabled" tone="muted">
            {t('forms.disabledLabel')}
          </Label>
          <Input id="dev-disabled" disabled placeholder={t('forms.namePlaceholder')} />
        </div>
      </DemoRow>
      <DemoRow label={t('forms.textarea')}>
        <Textarea
          aria-label={t('forms.textarea')}
          placeholder={t('forms.reviewPlaceholder')}
          rows={3}
        />
      </DemoRow>
      <DemoRow label={t('forms.select')}>
        <Select
          aria-label={t('forms.sortLabel')}
          value={sort}
          onValueChange={setSort}
          options={SORT_OPTIONS.map((value) => ({ value, label: t(`forms.sort.${value}`) }))}
          className="sm:w-64"
        />
        <Select
          aria-label={t('forms.sortLabel')}
          placeholder={t('forms.selectPlaceholder')}
          options={SORT_OPTIONS.map((value) => ({ value, label: t(`forms.sort.${value}`) }))}
          size="sm"
          className="w-48"
        />
      </DemoRow>
      <DemoRow label={t('forms.toggles')} className="gap-6">
        <div className="flex items-center gap-3">
          <Switch id="dev-notify" checked={notify} onCheckedChange={setNotify} />
          <Label htmlFor="dev-notify">{t('forms.notify')}</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="dev-notify-sm" size="sm" disabled />
          <Label htmlFor="dev-notify-sm" tone="muted">
            {t('forms.emailDigest')}
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="dev-terms" checked={terms} onCheckedChange={(v) => setTerms(v === true)} />
          <Label htmlFor="dev-terms">{t('forms.terms')}</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="dev-all" checked="indeterminate" />
          <Label htmlFor="dev-all">{t('forms.selectAll')}</Label>
        </div>
      </DemoRow>
    </DemoSection>
  );
}
