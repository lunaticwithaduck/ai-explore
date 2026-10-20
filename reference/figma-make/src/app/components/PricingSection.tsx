import { Check, Gift, Calendar } from 'lucide-react';
import { PricingPlan } from '../data/aiTools';

interface PricingSectionProps {
  plans: PricingPlan[];
  hasFreePlan: boolean;
  hasTrial: boolean;
  trialDays?: number;
}

export function PricingSection({ plans, hasFreePlan, hasTrial, trialDays }: PricingSectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2>Pricing & Plans</h2>
        <div className="flex gap-2">
          {hasFreePlan && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
              <Gift size={14} />
              Free Plan Available
            </span>
          )}
          {hasTrial && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              <Calendar size={14} />
              {trialDays}-Day Trial
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative border rounded-lg p-5 transition-all hover:shadow-lg ${
              plan.isPopular
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="mb-2">{plan.name}</h3>
              <div className="text-2xl">{plan.price}</div>
            </div>

            <ul className="space-y-2 mb-5">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 rounded-lg transition-all ${
                plan.isPopular
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              {plan.price === 'Free' ? 'Get Started' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
