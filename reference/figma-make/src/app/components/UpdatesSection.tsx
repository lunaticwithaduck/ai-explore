import { Sparkles, Bug, TrendingUp, Calendar } from 'lucide-react';
import { Update } from '../data/aiTools';

interface UpdatesSectionProps {
  updates: Update[];
}

const typeConfig = {
  feature: { icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'New Feature' },
  bugfix: { icon: Bug, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Bug Fix' },
  improvement: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Improvement' },
};

export function UpdatesSection({ updates }: UpdatesSectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={24} />
        <h2>Recent Updates</h2>
      </div>

      <div className="space-y-4">
        {updates.map((update) => {
          const config = typeConfig[update.type];
          const Icon = config.icon;

          return (
            <div
              key={update.id}
              className="border border-border rounded-lg p-5 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${config.bg} ${config.color} flex items-center gap-1`}>
                      <Icon size={12} />
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{update.version}</span>
                  </div>
                  <h3 className="text-lg mb-1">{update.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={14} />
                    <span>{update.date}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2">
                {update.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`${config.color} mt-1`}>•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
