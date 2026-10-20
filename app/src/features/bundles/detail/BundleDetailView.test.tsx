import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { FeatureFlagProvider } from '@/lib/feature-flags/FeatureFlagProvider';
import messages from '../../../messages/en/bundles.json';
import { BundleDetailView } from './BundleDetailView';

vi.mock('@/features/catalogue/components/ToolCard/ToolCard', () => ({
  ToolCard: ({ tool }: { tool: { name: string } }) => <div>{tool.name}</div>,
}));
vi.mock('@/features/bundle-interest/components/NotifyMeButton/NotifyMeButton', () => ({
  NotifyMeButton: ({ period }: { period: string }) => (
    <button type="button" data-testid="bundle-interest-notify-me">
      notify {period}
    </button>
  ),
}));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children?: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const bundle = {
  id: 'pack',
  slug: 'pack',
  name: { en: 'Pack', bg: 'Пакет' },
  description: { en: 'Desc', bg: 'Опис' },
  toolIds: ['a', 'b'],
  icon: 'rocket',
  accent: 'blue',
  pricing: {
    monthly: { priceCents: 3000 },
    quarterly: { priceCents: 8000 },
    yearly: { priceCents: 30000 },
  },
  published: true,
} as WithId<Bundle>;

const tool = (id: string, from: number) =>
  ({
    id,
    slug: id,
    name: id,
    logo: { path: '/logos/x.svg', background: '#000000' },
    pricing: { hasFreePlan: false, fromPriceCents: from },
  }) as unknown as WithId<Tool>;

function renderView(checkoutEnabled: boolean) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ bundles: messages }}>
      <FeatureFlagProvider flags={{ checkoutEnabled }}>
        <BundleDetailView bundle={bundle} tools={[tool('a', 2000), tool('b', 3000)]} />
      </FeatureFlagProvider>
    </NextIntlClientProvider>,
  );
}

const text = (id: string) => screen.getByTestId(id).textContent;

describe('BundleDetailView', () => {
  it('starts monthly and updates price, list price and savings per period', () => {
    renderView(false);
    expect(text('bundles-price')).toBe('$30');
    expect(text('bundles-list-price')).toBe('$50');
    expect(text('bundles-savings')).toBe('Save 40%');

    fireEvent.click(document.querySelector('[data-id="quarterly"]') as HTMLElement);
    expect(text('bundles-price')).toBe('$80');
    expect(text('bundles-list-price')).toBe('$150');
    expect(text('bundles-savings')).toBe('Save 47%');
    expect(screen.getByText('$26.67 per month')).toBeInTheDocument();

    fireEvent.click(document.querySelector('[data-id="yearly"]') as HTMLElement);
    expect(text('bundles-price')).toBe('$300');
    expect(text('bundles-list-price')).toBe('$600');
    expect(text('bundles-savings')).toBe('Save 50%');
  });

  it('marks the selected period with aria-checked', () => {
    renderView(false);
    const monthly = document.querySelector('[data-id="monthly"]') as HTMLElement;
    expect(monthly).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(document.querySelector('[data-id="yearly"]') as HTMLElement);
    expect(monthly).toHaveAttribute('aria-checked', 'false');
  });

  it('shows Notify me and no Subscribe when the flag is off', () => {
    renderView(false);
    expect(screen.queryByTestId('bundles-subscribe')).toBeNull();
    expect(screen.getByTestId('bundle-interest-notify-me')).toBeInTheDocument();
  });

  it('shows Subscribe when the flag is on', () => {
    renderView(true);
    expect(screen.getByTestId('bundles-subscribe')).toBeInTheDocument();
    expect(screen.queryByTestId('bundle-interest-notify-me')).toBeNull();
  });
});
