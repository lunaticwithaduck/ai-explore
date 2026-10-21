import type { Tool } from '@ai-explore/schemas';
import { Badge } from '@ai-explore/ui';
import { CalendarClock, Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { PlanCard } from '../PlanCard/PlanCard';
import { ToolSection } from '../ToolSection/ToolSection';

export type ToolPlansProps = {
  tool: Pick<Tool, 'plans' | 'pricing' | 'websiteUrl'>;
};

export function ToolPlans({ tool }: ToolPlansProps) {
  const t = useTranslations('tool.plans');
  const { hasFreePlan, trialDays } = tool.pricing;
  if (tool.plans.length === 0) return null;
  return (
    <ToolSection
      title={t('title')}
      data-testid={TEST_IDS.tool.plans}
      aside={
        <div className="flex flex-wrap gap-2">
          {hasFreePlan && (
            <Badge tone="success" icon={Gift}>
              {t('freeBadge')}
            </Badge>
          )}
          {trialDays !== undefined && (
            <Badge tone="accent" icon={CalendarClock}>
              {t('trialBadge', { days: trialDays })}
            </Badge>
          )}
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tool.plans.map((plan) => (
          <PlanCard key={`${plan.name}-${plan.period}`} plan={plan} websiteUrl={tool.websiteUrl} />
        ))}
      </div>
    </ToolSection>
  );
}
