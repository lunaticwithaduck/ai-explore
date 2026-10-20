import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Check, Rocket, Video, Briefcase, TrendingUp, Sparkles, Code, ShoppingCart } from 'lucide-react';
import { bundles, aiTools } from '../data/aiTools';
import { ToolCard } from './ToolCard';

type BillingPeriod = 'monthly' | 'quarterly' | 'yearly';

const iconMap = {
  rocket: Rocket,
  video: Video,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  sparkles: Sparkles,
  code: Code,
};

export function BundleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');
  const bundle = bundles.find((b) => b.id === id);

  if (!bundle) {
    return (
      <div className="flex-1 overflow-y-auto bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">Bundle not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[bundle.icon as keyof typeof iconMap];
  const bundleTools = aiTools.filter(tool => bundle.toolIds.includes(tool.id));

  const features = [
    'Access to all tools in the bundle',
    'Priority customer support',
    'Regular updates and new features',
    'Cancel anytime, no commitments',
    'Commercial license included',
    'Unlimited usage across all tools',
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header Banner */}
      <div className={`h-64 bg-gradient-to-br ${bundle.gradient} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all z-10"
        >
          <ArrowLeft size={20} />
          <span>Back to Library</span>
        </button>

        {/* Bundle Icon */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className={`w-32 h-32 bg-gradient-to-br ${bundle.gradient} rounded-2xl flex items-center justify-center shadow-2xl border-4 border-background`}>
            <Icon size={64} className="text-white" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-20 pb-8">
        {/* Title & Description */}
        <div className="text-center mb-8">
          <h1 className="mb-3">{bundle.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {bundle.description}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-card border border-border rounded-xl p-8">
            {/* Billing Period Tabs */}
            <div className="flex gap-2 mb-6 bg-accent rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`flex-1 px-4 py-3 rounded-md text-sm transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent/80'
                }`}
              >
                <div>Monthly</div>
                <div className="text-xs opacity-80 mt-1">Pay monthly</div>
              </button>
              <button
                onClick={() => setBillingPeriod('quarterly')}
                className={`flex-1 px-4 py-3 rounded-md text-sm transition-all relative ${
                  billingPeriod === 'quarterly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent/80'
                }`}
              >
                <div>3 Months</div>
                <div className="text-xs opacity-80 mt-1">Save more</div>
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`flex-1 px-4 py-3 rounded-md text-sm transition-all relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent/80'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Yearly</span>
                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/30">Best</span>
                </div>
                <div className="text-xs opacity-80 mt-1">Best value</div>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-5xl">{bundle.pricing[billingPeriod].price}</span>
                <span className="text-2xl text-muted-foreground line-through">{bundle.pricing[billingPeriod].originalPrice}</span>
              </div>
              {billingPeriod !== 'monthly' && (
                <div className="text-sm text-muted-foreground mb-2">
                  {bundle.pricing[billingPeriod].perMonth}/month
                </div>
              )}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                <span className="text-sm">Save {bundle.pricing[billingPeriod].savings} on this bundle</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-lg">
              <ShoppingCart size={20} />
              <span>Subscribe Now</span>
            </button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {billingPeriod === 'monthly' && 'Billed monthly'}
              {billingPeriod === 'quarterly' && 'Billed every 3 months'}
              {billingPeriod === 'yearly' && 'Billed annually'}
              {' • Cancel anytime • '}{bundleTools.length} tools included
            </p>
          </div>
        </div>

        {/* Included Tools */}
        <div className="mb-8">
          <h2 className="mb-6">Included Tools ({bundleTools.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bundleTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Why This Bundle */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h2 className="mb-6">Why Choose This Bundle?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                <Check size={24} className="text-primary" />
              </div>
              <h3 className="text-lg mb-2">Carefully Curated</h3>
              <p className="text-sm text-muted-foreground">
                Each tool has been hand-picked to work perfectly together for your specific use case.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <h3 className="text-lg mb-2">Save Money</h3>
              <p className="text-sm text-muted-foreground">
                Get all the tools you need at a significant discount compared to buying individually.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                <Sparkles size={24} className="text-primary" />
              </div>
              <h3 className="text-lg mb-2">Ready to Use</h3>
              <p className="text-sm text-muted-foreground">
                Start working immediately with a complete toolkit designed for your workflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
