import { routes } from '@/config/routes';
import { routing } from '@/i18n/routing';
import { AUTH_ROUTES } from '../config/constants';

const SENTINEL_ORIGIN = 'https://next.invalid';

const hasControlCharacter = (value: string) =>
  [...value].some((char) => {
    const code = char.charCodeAt(0);
    return code < 32 || code === 127;
  });

const stripLocale = (pathname: string) => {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
};

const decodeOrNull = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
};

const isSingleSlashPath = (path: string) => {
  const decoded = decodeOrNull(path);
  return (
    decoded !== null &&
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !decoded.startsWith('//') &&
    !decoded.includes('\\') &&
    !hasControlCharacter(decoded)
  );
};

const staysOnSentinel = (path: string) => {
  try {
    return new URL(path, SENTINEL_ORIGIN).origin === SENTINEL_ORIGIN;
  } catch {
    return false;
  }
};

export function sanitizeNext(raw: string | null | undefined): string | null {
  if (!raw?.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) return null;
  if (hasControlCharacter(raw) || !staysOnSentinel(raw)) return null;
  const url = new URL(raw, SENTINEL_ORIGIN);
  const pathname = stripLocale(url.pathname);
  if (!isSingleSlashPath(pathname) || AUTH_ROUTES.includes(pathname)) return null;
  const result = `${pathname}${url.search}${url.hash}`;
  return staysOnSentinel(result) ? result : null;
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(stripLocale(pathname));
}

const withNext = (base: string, next: string | null | undefined) => {
  const safe = sanitizeNext(next);
  return safe && safe !== routes.library ? `${base}?next=${encodeURIComponent(safe)}` : base;
};

export const signInHref = (next?: string | null) => withNext(routes.signIn, next);
export const signUpHref = (next?: string | null) => withNext(routes.signUp, next);
