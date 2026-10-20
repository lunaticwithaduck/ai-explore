const svg = (viewBox: string, body: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'>${body}</svg>`,
  )}`;

export const SAMPLE_LOGOS = [
  {
    id: 'square',
    background: 'var(--color-accent-emerald-subtle)',
    src: svg(
      '0 0 64 64',
      "<circle cx='32' cy='32' r='26' fill='none' stroke='white' stroke-width='6'/><path d='M20 32h24M32 20v24' stroke='white' stroke-width='6' stroke-linecap='round'/>",
    ),
  },
  {
    id: 'wide',
    background: 'var(--color-accent-violet-subtle)',
    src: svg(
      '0 0 192 48',
      "<rect x='4' y='8' width='32' height='32' rx='8' fill='white'/><rect x='48' y='14' width='140' height='20' rx='10' fill='white' opacity='0.85'/>",
    ),
  },
  {
    id: 'tall',
    background: 'var(--color-accent-amber-subtle)',
    src: svg(
      '0 0 40 96',
      "<rect x='4' y='4' width='32' height='40' rx='16' fill='white'/><rect x='12' y='52' width='16' height='40' rx='8' fill='white' opacity='0.8'/>",
    ),
  },
] as const;

export const SAMPLE_COVER = svg(
  '0 0 320 180',
  "<circle cx='60' cy='30' r='90' fill='white' opacity='0.08'/><circle cx='290' cy='170' r='110' fill='white' opacity='0.06'/><circle cx='160' cy='90' r='30' fill='white' opacity='0.92'/><path d='M151 76l24 14-24 14z' fill='black' opacity='0.75'/>",
);

export const SURFACE_SWATCHES = [
  { token: 'surface', className: 'bg-surface' },
  { token: 'surface-raised', className: 'bg-surface-raised' },
  { token: 'surface-sunken', className: 'bg-surface-sunken' },
  { token: 'surface-overlay', className: 'bg-surface-overlay' },
  { token: 'border', className: 'bg-border' },
  { token: 'border-strong', className: 'bg-border-strong' },
] as const;

export const TEXT_SWATCHES = [
  { token: 'text', className: 'text-text' },
  { token: 'text-muted', className: 'text-text-muted' },
  { token: 'text-subtle', className: 'text-text-subtle' },
  { token: 'accent', className: 'text-accent' },
] as const;

export const ACCENT_SWATCHES = [
  { token: 'accent', className: 'bg-accent' },
  { token: 'accent-hover', className: 'bg-accent-hover' },
  { token: 'accent-subtle', className: 'bg-accent-subtle' },
  { token: 'focus-ring', className: 'bg-focus-ring' },
  { token: 'success', className: 'bg-success' },
  { token: 'warning', className: 'bg-warning' },
  { token: 'danger', className: 'bg-danger' },
  { token: 'star', className: 'bg-star' },
] as const;

export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
export const SIZES = ['sm', 'md', 'lg'] as const;
export const TEXT_TONES = [
  'default',
  'muted',
  'subtle',
  'accent',
  'success',
  'warning',
  'danger',
] as const;
export const TEXT_SIZES = ['xs', 'sm', 'md', 'lg'] as const;
export const HEADING_LEVELS = [1, 2, 3, 4] as const;
export const BADGE_TONES = [
  'neutral',
  'accent',
  'solid',
  'success',
  'warning',
  'danger',
  'outline',
] as const;
export const CARD_VARIANTS = ['raised', 'flat', 'interactive'] as const;
export const SORT_OPTIONS = ['rating', 'reviews', 'priceLow', 'priceHigh', 'newest'] as const;
export const PERIODS = ['monthly', 'quarterly', 'yearly'] as const;
export const FILTER_TAGS = ['image', 'video', 'writing', 'code', 'audio'] as const;
export const STAR_VALUES = [5, 4.5, 3, 1.5, 0] as const;
export const CAROUSEL_SLIDES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const SECTION_IDS = [
  'colors',
  'typography',
  'buttons',
  'forms',
  'surfaces',
  'feedback',
  'overlays',
  'navigation',
  'carousel',
  'media',
  'ratings',
] as const;
