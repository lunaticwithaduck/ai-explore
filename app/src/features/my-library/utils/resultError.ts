export function resultErrorCode(result: { error?: unknown } | { data?: unknown }): string | null {
  if (!('error' in result) || !result.error) return null;
  const code = (result.error as { code?: unknown }).code;
  return typeof code === 'string' ? code : 'unknown';
}
