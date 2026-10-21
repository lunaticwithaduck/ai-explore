import { cn, Tag } from '@ai-explore/ui';

export type FilterChip = { id: string; label: string };

export type FilterChipsProps = {
  chips: readonly FilterChip[];
  isPressed: (id: string) => boolean;
  onToggle: (id: string) => void;
  label: string;
  testId: string;
  className?: string | undefined;
};

export function FilterChips({
  chips,
  isPressed,
  onToggle,
  label,
  testId,
  className,
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
          pressed={isPressed(chip.id)}
          onPressedChange={() => onToggle(chip.id)}
        >
          {chip.label}
        </Tag>
      ))}
    </fieldset>
  );
}
