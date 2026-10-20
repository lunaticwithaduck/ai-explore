import { useSearchParams } from 'next/navigation';
import { sanitizeNext } from '../utils/nextParam';

export function useNextParam(): string | null {
  return sanitizeNext(useSearchParams().get('next'));
}
