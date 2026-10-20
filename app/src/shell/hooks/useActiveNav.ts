import { useSearchParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';

export type ActiveNav = {
  pathname: string;
  category: string | null;
  collection: string | null;
};

export function useActiveNav(): ActiveNav {
  const pathname = usePathname();
  const params = useSearchParams();
  return { pathname, category: params.get('category'), collection: params.get('collection') };
}
