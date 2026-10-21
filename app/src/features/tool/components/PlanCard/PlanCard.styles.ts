export const planCardStyles = {
  base: 'relative flex h-full flex-col rounded-button p-5 transition-shadow duration-base hover:shadow-lg',
  popular: 'border-accent bg-accent/5',
  badge: 'absolute -top-3 left-1/2 -translate-x-1/2 px-3',
  name: 'mb-2',
  price: 'mb-4 text-2xl',
  features: 'mb-5 flex flex-col gap-2',
  check: 'mt-0.5 size-4 shrink-0 text-accent',
  action: 'mt-auto text-base',
} as const;
