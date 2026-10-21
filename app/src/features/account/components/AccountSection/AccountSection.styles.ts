export const accountSectionStyles = {
  root: 'flex flex-col gap-5 p-5 sm:gap-6 sm:p-6',
  border: {
    default: 'border-border',
    danger: 'border-danger/40',
  },
  header: 'flex items-center justify-between gap-4',
  titleRow: 'flex min-w-0 items-center gap-2',
  icon: 'size-6 shrink-0',
  heading: {
    default: '',
    danger: 'text-danger',
  },
} as const;
