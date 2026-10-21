export function clipDisplayName(value: string, maxUnits: number): string {
  if (value.length <= maxUnits) return value;
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  let clipped = '';
  for (const { segment } of segmenter.segment(value)) {
    if (clipped.length + segment.length > maxUnits) break;
    clipped += segment;
  }
  return clipped;
}
