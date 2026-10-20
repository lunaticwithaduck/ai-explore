import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AITool } from '../data/aiTools';

interface SimilarToolsProps {
  tools: AITool[];
}

export function SimilarTools({ tools }: SimilarToolsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const itemsPerView = 3;

  if (tools.length === 0) {
    return null;
  }

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < tools.length - itemsPerView;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2>Similar Tools</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg transition-all ${
              canScrollLeft
                ? 'bg-accent hover:bg-accent/80'
                : 'bg-accent/30 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg transition-all ${
              canScrollRight
                ? 'bg-accent hover:bg-accent/80'
                : 'bg-accent/30 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="min-w-[calc(33.333%-11px)] bg-accent/30 border border-border rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => navigate(`/tool/${tool.id}`)}
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: tool.logoBackground }}
                >
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="w-10 h-10 object-contain"
                    style={tool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="currentColor" className="text-yellow-500" />
                      <span className="text-xs">{tool.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({tool.reviewCount})
                    </span>
                  </div>
                  <div className="text-xs text-primary">{tool.price}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {tool.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-accent rounded text-muted-foreground">
                  {tool.category}
                </span>
                <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {tools.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(tools.length - itemsPerView + 1) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === idx ? 'bg-primary w-6' : 'bg-accent'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
