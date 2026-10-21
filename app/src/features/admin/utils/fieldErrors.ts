export type FieldErrorKey =
  | 'required'
  | 'slug'
  | 'url'
  | 'hex'
  | 'logoPath'
  | 'youtubeId'
  | 'version'
  | 'number'
  | 'range'
  | 'price'
  | 'taken'
  | 'invalid';

export type FieldErrorInput = {
  name: string;
  type: string | undefined;
  empty: boolean;
  numeric?: boolean;
  money?: boolean;
};

const FORMAT_RULES: readonly (readonly [RegExp, FieldErrorKey])[] = [
  [/(^|\.)slug$/, 'slug'],
  [/^tags\.\d+\.value$/, 'slug'],
  [/^(categoryId|toolId)$/, 'slug'],
  [/^websiteUrl$/, 'url'],
  [/^logo\.path$/, 'logoPath'],
  [/^logo\.background$/, 'hex'],
  [/youtubeId$/, 'youtubeId'],
  [/^version$/, 'version'],
];

export function fieldErrorKey({
  name,
  type,
  empty,
  numeric = false,
  money = false,
}: FieldErrorInput): FieldErrorKey {
  if (type === 'taken') return 'taken';
  if (empty) return 'required';
  if (money) return 'price';
  if (numeric) {
    return type === 'too_small' || type === 'too_big' ? 'range' : 'number';
  }
  if (type === 'invalid_format' || type === 'invalid_string' || type === 'custom') {
    return FORMAT_RULES.find(([pattern]) => pattern.test(name))?.[1] ?? 'invalid';
  }
  return 'required';
}

export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  return typeof value === 'string' && value.trim() === '';
}
