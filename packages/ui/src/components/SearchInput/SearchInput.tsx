import { Search, X } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton/IconButton';
import { Input, type InputProps } from '../Input/Input';
import { searchClearStyles, searchIconStyles, searchInputStyles } from './SearchInput.styles';

export type SearchInputProps = Omit<InputProps, 'type'> & {
  clearLabel?: string | undefined;
  onClear?: (() => void) | undefined;
  wrapperClassName?: string | undefined;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ size = 'md', clearLabel, onClear, wrapperClassName, className, value, ...props }, ref) => {
    const clearable = Boolean(onClear && clearLabel && value !== undefined && String(value) !== '');
    return (
      <div className={cn('relative w-full', wrapperClassName)}>
        <Search aria-hidden className={searchIconStyles({ size })} />
        <Input
          ref={ref}
          type="search"
          size={size}
          value={value}
          className={cn(searchInputStyles({ size, clearable }), className)}
          {...props}
        />
        {clearable && onClear && clearLabel && (
          <IconButton
            icon={X}
            label={clearLabel}
            size="sm"
            onClick={onClear}
            className={searchClearStyles({ size })}
          />
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
