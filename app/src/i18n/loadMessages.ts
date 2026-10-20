import { NAMESPACES } from './namespaces';
import type { Locale } from './routing';

export async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    NAMESPACES.map(async (namespace) => {
      const module = await import(`../messages/${locale}/${namespace}.json`);
      return [namespace, module.default] as const;
    }),
  );
  return Object.fromEntries(entries);
}
