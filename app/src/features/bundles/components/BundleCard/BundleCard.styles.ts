export const bundleCardStyles = {
  card: 'group isolate flex h-full flex-col overflow-hidden p-6 hover:scale-100',
  tint: 'absolute inset-0 -z-10 bg-linear-to-br opacity-5 transition-opacity duration-base group-hover:opacity-10',
  top: 'mb-4 flex items-start justify-between gap-3',
  icon: 'flex size-12 shrink-0 items-center justify-center rounded-button bg-linear-to-br text-white',
  title: 'mb-2',
  link: "after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none",
  description: 'mb-4',
  footer: 'mt-auto flex flex-col gap-4',
  tools: 'flex items-center gap-3',
  view: 'text-base',
  chevron: 'size-4 transition-transform duration-base group-hover:translate-x-1',
} as const;
