import { cva } from 'class-variance-authority';

export const searchInputStyles = cva(
  '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
  {
    variants: {
      size: {
        sm: 'pl-8',
        md: 'pl-9',
        lg: 'pl-11',
      },
      clearable: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { clearable: true, size: 'sm', className: 'pr-8' },
      { clearable: true, size: 'md', className: 'pr-10' },
      { clearable: true, size: 'lg', className: 'pr-12' },
    ],
    defaultVariants: { size: 'md', clearable: false },
  },
);

export const searchIconStyles = cva(
  'pointer-events-none absolute top-1/2 -translate-y-1/2 text-text-subtle',
  {
    variants: {
      size: {
        sm: 'left-2.5 size-4',
        md: 'left-3 size-4',
        lg: 'left-4 size-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const searchClearStyles = cva('absolute top-1/2 -translate-y-1/2', {
  variants: {
    size: {
      sm: 'right-0.5 size-7',
      md: 'right-1',
      lg: 'right-2',
    },
  },
  defaultVariants: { size: 'md' },
});
