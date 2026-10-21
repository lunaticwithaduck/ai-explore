export const userMenuStyles = {
  trigger: 'h-auto gap-3 rounded-button p-1.5 text-text md:p-2',
  avatar: 'border-0 bg-linear-to-br from-blue-500 to-cyan-500 text-white',
  identityLabel: 'hidden min-w-0 flex-col items-start md:flex',
  name: 'max-w-32 truncate',
  role: 'leading-tight',
  content: 'w-64',
  identity: 'flex items-center gap-3 px-2.5 py-2.5',
  identityText: 'min-w-0',
} as const;
