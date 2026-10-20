import { ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AITool } from '../data/aiTools';

interface ComplementaryToolsProps {
  currentTool: AITool;
  tools: AITool[];
}

export function ComplementaryTools({ currentTool, tools }: ComplementaryToolsProps) {
  const navigate = useNavigate();

  if (tools.length === 0) {
    return null;
  }

  const workflowSteps = [currentTool, ...tools];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-6">
        <h2 className="mb-2">Complete Your Workflow</h2>
        <p className="text-sm text-muted-foreground">
          These tools work great together with {currentTool.name}
        </p>
      </div>

      {/* Workflow Visualization */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max pb-2">
          {workflowSteps.map((tool, idx) => (
            <div key={tool.id} className="flex items-center gap-3">
              <div
                className={`group relative ${
                  idx === 0 ? 'ring-2 ring-primary' : 'cursor-pointer hover:scale-105'
                } transition-all`}
                onClick={() => idx !== 0 && navigate(`/tool/${tool.id}`)}
              >
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center"
                  style={{ background: tool.logoBackground }}
                >
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="w-12 h-12 object-contain"
                    style={tool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
                  />
                </div>
                {idx === 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground">1</span>
                  </div>
                )}
                <div className="text-center mt-2">
                  <div className="text-xs font-medium">{tool.name}</div>
                  {idx === 0 && (
                    <div className="text-xs text-primary">Current</div>
                  )}
                </div>
              </div>
              {idx < workflowSteps.length - 1 && (
                <div className="flex flex-col items-center gap-1">
                  <ArrowRight size={20} className="text-muted-foreground" />
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {idx === 0 ? 'then use' : 'combine with'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => navigate(`/tool/${tool.id}`)}
            className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: tool.logoBackground }}
              >
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="w-7 h-7 object-contain"
                  style={tool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm mb-1 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <div className="text-xs text-primary">{tool.price}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {tool.description}
            </p>
            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-xs">
                <Plus size={14} />
                Add to Workflow
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Benefits */}
      <div className="mt-6 p-4 bg-accent/30 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plus size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm mb-1">Why use these together?</h3>
            <p className="text-xs text-muted-foreground">
              Combining {currentTool.name} with these complementary tools creates a complete workflow
              for {currentTool.category === 'image' ? 'visual content creation' :
                  currentTool.category === 'text' ? 'content production' :
                  currentTool.category === 'video' ? 'video production' :
                  currentTool.category === 'code' ? 'software development' :
                  currentTool.category === 'audio' ? 'audio production' :
                  'data analytics'}.
              Each tool handles a specific part of the process, making your work more efficient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
