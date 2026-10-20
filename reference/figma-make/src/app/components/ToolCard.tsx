import { Star, Gift, ExternalLink } from 'lucide-react';
import { AITool } from '../data/aiTools';
import { useNavigate } from 'react-router';

interface ToolCardProps {
  tool: AITool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the external link button
    if ((e.target as HTMLElement).closest('.external-link-btn')) {
      return;
    }
    navigate(`/tool/${tool.id}`);
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(tool.website, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:border-primary/50 group relative flex flex-col"
    >
      <div
        className="relative h-48 flex items-center justify-center p-8"
        style={{ background: tool.logoBackground }}
      >
        <img
          src={tool.logo}
          alt={tool.name}
          className="w-24 h-24 object-contain"
          style={tool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
        />
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white flex items-center gap-1">
          <Star size={14} fill="currentColor" className="text-yellow-400" />
          <span className="text-sm">{tool.rating}</span>
        </div>
        {tool.hasFreePlan && (
          <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-white flex items-center gap-1">
            <Gift size={12} />
            <span className="text-xs">Free</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1">{tool.name}</h3>
          <button
            onClick={handleExternalClick}
            className="external-link-btn opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-accent rounded-lg"
            title="Visit website"
          >
            <ExternalLink size={16} />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {tool.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-foreground font-medium">{tool.price}</span>
            {tool.hasTrial && tool.trialDays && (
              <span className="ml-2 text-xs text-muted-foreground">
                {tool.trialDays}d trial
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {tool.reviewCount} reviews
          </span>
        </div>
      </div>
    </div>
  );
}
