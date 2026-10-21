import type { Plan } from '@ai-explore/schemas';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import tool from '@/messages/en/tool.json';
import { PlanCard } from './PlanCard';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children?: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const renderPlan = (plan: Plan) =>
  render(
    <NextIntlClientProvider locale="en" messages={{ tool }}>
      <PlanCard plan={plan} websiteUrl="https://example.com" />
    </NextIntlClientProvider>,
  );

const base: Plan = { name: 'Pro', priceCents: 2000, period: 'month', features: [{ en: 'Fast' }] };

describe('PlanCard price label', () => {
  it('free', () => {
    renderPlan({ ...base, name: 'Free', priceCents: 0 });
    expect(screen.getByText('Free', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('monthly', () => {
    renderPlan(base);
    expect(screen.getByText('$20/month')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Choose plan' })).toBeInTheDocument();
  });

  it('yearly', () => {
    renderPlan({ ...base, priceCents: 19900, period: 'year' });
    expect(screen.getByText('$199/year')).toBeInTheDocument();
  });

  it('custom shows contact sales', () => {
    renderPlan({ ...base, name: 'Enterprise', priceCents: null, period: 'custom' });
    expect(screen.getByText('Custom pricing')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact sales' })).toBeInTheDocument();
  });

  it('highlights the popular plan', () => {
    renderPlan({ ...base, popular: true });
    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });
});
