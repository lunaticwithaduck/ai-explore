import { cn, Tag } from '@ai-explore/ui';
import type { LucideIcon } from 'lucide-react';

export type FilterChip = { id: string; label: string; icon?: LucideIcon | undefined };

export type FilterChipsProps = {
  chips: readonly FilterChip[];
  isPressed: (id: string) => boolean;
  onToggle: (id: string) => void;
  label: string;
  testId: string;
  className?: string | undefined;
  chipClassName?: string | undefined;
};

export function FilterChips({
  chips,
  isPressed,
  onToggle,
  label,
  testId,
  className,
  chipClassName,
}: FilterChipsProps) {
  return (
    <fieldset
      aria-label={label}
      data-testid={testId}
      className={cn('m-0 flex min-w-0 gap-2 border-0 p-0', className)}
    >
      {chips.map((chip) => (
        <Tag
          key={chip.id}
          data-id={chip.id}
          icon={chip.icon}
          pressed={isPressed(chip.id)}
          onPressedChange={() => onToggle(chip.id)}
          className={chipClassName}
        >
          {chip.label}
        </Tag>
      ))}
    </fieldset>
  );
}
