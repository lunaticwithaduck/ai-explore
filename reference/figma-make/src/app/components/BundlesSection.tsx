import { Rocket, Video, Briefcase, TrendingUp, Sparkles, Code, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { bundles, aiTools } from '../data/aiTools';

const iconMap = {
  rocket: Rocket,
  video: Video,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  sparkles: Sparkles,
  code: Code,
};

export function BundlesSection() {
  const navigate = useNavigate();
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="mb-2">Curated Collections</h2>
          <p className="text-muted-foreground">Pre-built tool stacks for specific use cases</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => {
          const Icon = iconMap[bundle.icon as keyof typeof iconMap];
          const bundleTools = aiTools.filter(tool => bundle.toolIds.includes(tool.id));

          return (
            <div
              key={bundle.id}
              onClick={() => navigate(`/bundle/${bundle.id}`)}
              className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${bundle.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${bundle.gradient} rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl">{bundle.pricing.monthly.price}</span>
                      <span className="text-sm text-muted-foreground line-through">{bundle.pricing.monthly.originalPrice}</span>
                    </div>
                    <span className="text-xs text-green-400">Save {bundle.pricing.monthly.savings}</span>
                    <div className="text-xs text-muted-foreground mt-1">per month</div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mb-2">{bundle.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {bundle.description}
                </p>

                {/* Tool Icons */}
                <div className="flex items-center mb-4">
                  <div className="flex -space-x-2">
                    {bundleTools.slice(0, 4).map((tool) => (
                      <div
                        key={tool.id}
                        className="w-8 h-8 rounded-full border-2 border-card flex items-center justify-center"
                        style={{ background: tool.logoBackground }}
                      >
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-5 h-5 object-contain"
                          style={tool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
                        />
                      </div>
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-muted-foreground">
                    {bundle.toolIds.length} tools included
                  </span>
                </div>

                {/* CTA */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity group">
                  <span>View Bundle</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
