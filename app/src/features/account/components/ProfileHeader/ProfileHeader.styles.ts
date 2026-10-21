export const profileHeaderStyles = {
  root: 'flex flex-col items-start gap-5 sm:flex-row sm:gap-6',
  avatar:
    'size-24 border-0 bg-linear-to-br from-blue-500 to-cyan-500 text-3xl text-white sm:size-32 sm:text-4xl',
  info: 'flex w-full min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
  identity: 'flex min-w-0 flex-col gap-2',
  name: 'break-words',
  meta: 'flex flex-wrap items-center gap-x-4 gap-y-1 text-text-muted',
  metaItem: 'flex min-w-0 items-center gap-2',
  metaIcon: 'size-4 shrink-0',
  edit: 'self-start text-base',
} as const;
