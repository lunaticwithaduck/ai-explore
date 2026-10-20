export const ACCENT_NAMES = [
  'blue',
  'violet',
  'pink',
  'amber',
  'emerald',
  'cyan',
  'rose',
  'slate',
] as const;

export type AccentName = (typeof ACCENT_NAMES)[number];

export const accentTextClass: Record<AccentName, string> = {
  blue: 'text-accent-blue',
  violet: 'text-accent-violet',
  pink: 'text-accent-pink',
  amber: 'text-accent-amber',
  emerald: 'text-accent-emerald',
  cyan: 'text-accent-cyan',
  rose: 'text-accent-rose',
  slate: 'text-accent-slate',
};

export const accentSolidClass: Record<AccentName, string> = {
  blue: 'bg-accent-blue text-text-inverse',
  violet: 'bg-accent-violet text-text-inverse',
  pink: 'bg-accent-pink text-text-inverse',
  amber: 'bg-accent-amber text-text-inverse',
  emerald: 'bg-accent-emerald text-text-inverse',
  cyan: 'bg-accent-cyan text-text-inverse',
  rose: 'bg-accent-rose text-text-inverse',
  slate: 'bg-accent-slate text-text-inverse',
};

export const accentSubtleClass: Record<AccentName, string> = {
  blue: 'bg-accent-blue-subtle text-accent-blue',
  violet: 'bg-accent-violet-subtle text-accent-violet',
  pink: 'bg-accent-pink-subtle text-accent-pink',
  amber: 'bg-accent-amber-subtle text-accent-amber',
  emerald: 'bg-accent-emerald-subtle text-accent-emerald',
  cyan: 'bg-accent-cyan-subtle text-accent-cyan',
  rose: 'bg-accent-rose-subtle text-accent-rose',
  slate: 'bg-accent-slate-subtle text-accent-slate',
};

export const accentBorderClass: Record<AccentName, string> = {
  blue: 'border-accent-blue',
  violet: 'border-accent-violet',
  pink: 'border-accent-pink',
  amber: 'border-accent-amber',
  emerald: 'border-accent-emerald',
  cyan: 'border-accent-cyan',
  rose: 'border-accent-rose',
  slate: 'border-accent-slate',
};
