import { Tag } from '@ai-explore/ui';

export type FilterChip = { id: string; label: string };

export type FilterChipsProps = {
  chips: readonly FilterChip[];
  isPressed: (id: string) => boolean;
  onToggle: (id: string) => void;
  label: string;
  testId: string;
};

export function FilterChips({ chips, isPressed, onToggle, label, testId }: FilterChipsProps) {
  return (
    <fieldset
      aria-label={label}
      data-testid={testId}
      className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0"
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
