import { useState } from 'react';
import { Check, X, Zap, DollarSign, Layers, GitBranch } from 'lucide-react';
import { AITool } from '../data/aiTools';

interface ToolComparisonProps {
  currentTool: AITool;
  availableTools: AITool[];
}

export function ToolComparison({ currentTool, availableTools }: ToolComparisonProps) {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const selectedTool = availableTools.find(t => t.id === selectedToolId);

  const renderRating = (value: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm ${
              i < value ? 'bg-primary' : 'bg-accent'
            }`}
          />
        ))}
      </div>
    );
  };

  const comparisonRows = selectedTool ? [
    {
      label: 'Pricing',
      icon: DollarSign,
      current: currentTool.comparison.pricing,
      compare: selectedTool.comparison.pricing,
    },
    {
      label: 'Starting Price',
      icon: DollarSign,
      current: currentTool.price,
      compare: selectedTool.price,
    },
    {
      label: 'API Access',
      icon: GitBranch,
      current: currentTool.comparison.apiAccess,
      compare: selectedTool.comparison.apiAccess,
    },
    {
      label: 'Integrations',
      icon: Layers,
      current: `${currentTool.comparison.integrations}+ tools`,
      compare: `${selectedTool.comparison.integrations}+ tools`,
    },
    {
      label: 'Speed',
      icon: Zap,
      current: renderRating(currentTool.comparison.speed),
      compare: renderRating(selectedTool.comparison.speed),
    },
    {
      label: 'Output Quality',
      icon: Zap,
      current: renderRating(currentTool.comparison.outputQuality),
      compare: renderRating(selectedTool.comparison.outputQuality),
    },
    {
      label: 'Free Plan',
      icon: Check,
      current: currentTool.hasFreePlan,
      compare: selectedTool.hasFreePlan,
    },
    {
      label: 'Free Trial',
      icon: Check,
      current: currentTool.hasTrial ? `${currentTool.trialDays} days` : 'No',
      compare: selectedTool.hasTrial ? `${selectedTool.trialDays} days` : 'No',
    },
    {
      label: 'User Rating',
      icon: Check,
      current: `${currentTool.rating}/5 (${currentTool.reviewCount} reviews)`,
      compare: `${selectedTool.rating}/5 (${selectedTool.reviewCount} reviews)`,
    },
    {
      label: 'Best Use Case',
      icon: Check,
      current: currentTool.comparison.bestUseCase,
      compare: selectedTool.comparison.bestUseCase,
    },
  ] : [];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="mb-6">Compare with Other Tools</h2>

      {!selectedTool ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Select a tool to compare with {currentTool.name}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableTools
              .filter(tool => tool.id !== currentTool.id)
              .map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className="p-3 border border-border rounded-lg hover:border-primary/50 transition-all text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center"
                    style={{ background: tool.logoBackground }}
                  >
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-6 h-6 object-contain"
                      style={tool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
                    />
                  </div>
                  <div className="text-sm">{tool.name}</div>
                  <div className="text-xs text-muted-foreground">{tool.category}</div>
                </button>
              ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Tool Headers */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-sm text-muted-foreground">Feature</div>
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-xl mx-auto mb-2 flex items-center justify-center"
                style={{ background: currentTool.logoBackground }}
              >
                <img
                  src={currentTool.logo}
                  alt={currentTool.name}
                  className="w-10 h-10 object-contain"
                  style={currentTool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
                />
              </div>
              <div className="text-sm">{currentTool.name}</div>
            </div>
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-xl mx-auto mb-2 flex items-center justify-center"
                style={{ background: selectedTool.logoBackground }}
              >
                <img
                  src={selectedTool.logo}
                  alt={selectedTool.name}
                  className="w-10 h-10 object-contain"
                  style={selectedTool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
                />
              </div>
              <div className="text-sm">{selectedTool.name}</div>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3">
            {comparisonRows.map((row, idx) => {
              const Icon = row.icon;
              return (
                <div
                  key={idx}
                  className="grid grid-cols-3 gap-4 p-4 bg-accent/30 rounded-lg items-center"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-muted-foreground" />
                    <span className="text-sm">{row.label}</span>
                  </div>
                  <div className="text-center text-sm">
                    {typeof row.current === 'boolean' ? (
                      row.current ? (
                        <Check size={20} className="text-green-400 mx-auto" />
                      ) : (
                        <X size={20} className="text-red-400 mx-auto" />
                      )
                    ) : typeof row.current === 'object' ? (
                      <div className="flex justify-center">{row.current}</div>
                    ) : (
                      row.current
                    )}
                  </div>
                  <div className="text-center text-sm">
                    {typeof row.compare === 'boolean' ? (
                      row.compare ? (
                        <Check size={20} className="text-green-400 mx-auto" />
                      ) : (
                        <X size={20} className="text-red-400 mx-auto" />
                      )
                    ) : typeof row.compare === 'object' ? (
                      <div className="flex justify-center">{row.compare}</div>
                    ) : (
                      row.compare
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setSelectedToolId(null)}
            className="mt-6 px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors text-sm"
          >
            Compare with Different Tool
          </button>
        </div>
      )}
    </div>
  );
}
