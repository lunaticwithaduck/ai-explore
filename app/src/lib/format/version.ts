export function formatVersion(version: string): string {
  return version.trim().replace(/^(?:version\s*|v\s*)/i, '');
}
