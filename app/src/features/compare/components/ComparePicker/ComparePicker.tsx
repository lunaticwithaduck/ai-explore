'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SearchInput,
  Text,
  ToolLogo,
} from '@ai-explore/ui';
import { ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { pickerStyles } from './ComparePicker.styles';

export type ComparePickerProps = {
  tools: readonly WithId<Tool>[];
  selected: WithId<Tool> | undefined;
  excludeId: string | undefined;
  label: string;
  onSelect: (id: string) => void;
};

export function ComparePicker({ tools, selected, excludeId, label, onSelect }: ComparePickerProps) {
  const t = useTranslations('compare');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const options = tools.filter(
    (tool) =>
      tool.id !== excludeId &&
      (needle === '' ||
        tool.name.toLowerCase().includes(needle) ||
        tool.developer.toLowerCase().includes(needle)),
  );

  const choose = (id: string) => {
    setOpen(false);
    setQuery('');
    onSelect(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          iconRight={ChevronsUpDown}
          aria-label={`${label}: ${selected?.name ?? t('pickerPlaceholder')}`}
          className={pickerStyles.trigger}
          data-testid={TEST_IDS.compare.picker}
        >
          {selected?.name ?? t('pickerPlaceholder')}
        </Button>
      </PopoverTrigger>
      <PopoverContent size="lg" align="start">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          clearLabel={t('pickerClear')}
          aria-label={t('pickerSearch')}
          placeholder={t('pickerSearchPlaceholder')}
        />
        <div className={pickerStyles.list}>
          {options.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              fullWidth
              className={pickerStyles.option}
              onClick={() => choose(tool.id)}
              data-testid={TEST_IDS.compare.pickerOption}
              data-id={tool.slug}
            >
              <ToolLogo
                src={tool.logo.path}
                alt={tool.name}
                background={tool.logo.background}
                size="sm"
              />
              {tool.name}
            </Button>
          ))}
          {options.length === 0 && (
            <Text size="sm" tone="muted" className={pickerStyles.empty}>
              {t('pickerEmpty')}
            </Text>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
