'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';

export type NavigationWatcherProps = {
  onNavigate: () => void;
};

export function NavigationWatcher({ onNavigate }: NavigationWatcherProps) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const location = `${pathname}?${search}`;
  const lastLocation = useRef(location);

  useEffect(() => {
    if (lastLocation.current === location) return;
    lastLocation.current = location;
    onNavigate();
  }, [location, onNavigate]);

  return null;
}
