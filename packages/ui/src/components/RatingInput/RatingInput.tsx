'use client';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { Star } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef, type KeyboardEvent, useState } from 'react';
import { cn } from '../../lib/cn';
import { ratingInputStyles, ratingOptionStyles, ratingStarStyles } from './RatingInput.styles';

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export type RatingInputProps = Omit<
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  'type' | 'value' | 'defaultValue' | 'onValueChange' | 'onChange' | 'aria-label' | 'children'
> & {
  value: number | null;
  onChange: (value: RatingValue) => void;
  label: string;
  getOptionLabel: (value: RatingValue) => string;
  size?: 'md' | 'lg' | undefined;
  invalid?: boolean | undefined;
};

const OPTIONS: readonly RatingValue[] = [1, 2, 3, 4, 5];

const toRating = (value: number): RatingValue =>
  Math.min(5, Math.max(1, Math.round(value))) as RatingValue;

const KEY_STEPS: Record<string, (option: RatingValue) => RatingValue> = {
  ArrowRight: (option) => toRating(option + 1),
  ArrowDown: (option) => toRating(option + 1),
  ArrowLeft: (option) => toRating(option - 1),
  ArrowUp: (option) => toRating(option - 1),
  Home: () => 1,
  End: () => 5,
};

export const RatingInput = forwardRef<HTMLDivElement, RatingInputProps>(
  (
    {
      value,
      onChange,
      label,
      getOptionLabel,
      size,
      disabled = false,
      invalid = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const shown = hovered ?? value ?? 0;

    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, option: RatingValue) => {
      const step = KEY_STEPS[event.key];
      if (step) onChange(step(option));
    };

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="single"
        value={value ? String(value) : ''}
        onValueChange={(next) => {
          if (next) onChange(toRating(Number(next)));
        }}
        aria-label={label}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        loop={false}
        className={cn(ratingInputStyles({ invalid, disabled }), className)}
        onMouseLeave={() => setHovered(null)}
        {...props}
      >
        {OPTIONS.map((option) => (
          <ToggleGroupPrimitive.Item
            key={option}
            value={String(option)}
            aria-label={getOptionLabel(option)}
            data-id={String(option)}
            className={ratingOptionStyles({ size })}
            onKeyDown={(event) => onKeyDown(event, option)}
            onMouseEnter={() => setHovered(option)}
          >
            <Star aria-hidden className={ratingStarStyles({ size, active: option <= shown })} />
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  },
);

RatingInput.displayName = 'RatingInput';
