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
            <Badge icon={Gift} className="bg-green-500/20 px-3 text-green-400">
              {t('freeBadge')}
            </Badge>
          )}
          {trialDays !== undefined && (
            <Badge icon={CalendarClock} className="bg-blue-500/20 px-3 text-blue-400">
              {t('trialBadge', { days: trialDays })}
            </Badge>
          )}
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tool.plans.map((plan) => (
          <PlanCard key={`${plan.name}-${plan.period}`} plan={plan} websiteUrl={tool.websiteUrl} />
        ))}
      </div>
    </ToolSection>
  );
}
