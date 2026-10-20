import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  User,
  ThumbsUp,
  Tag,
  Heart,
  Plus,
  Check,
  LucideIcon
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { aiTools, reviews } from '../data/aiTools';
import { useUser } from '../context/UserContext';
import { PricingSection } from './PricingSection';
import { TutorialsSection } from './TutorialsSection';
import { UpdatesSection } from './UpdatesSection';
import { ToolComparison } from './ToolComparison';
import { SimilarTools } from './SimilarTools';
import { ComplementaryTools } from './ComplementaryTools';
import { ShareTool } from './ShareTool';

export function ToolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, toggleSavedTool, isToolSaved, addToolToCollection, removeToolFromCollection, isToolInCollection } = useUser();
  const [showCollectionsMenu, setShowCollectionsMenu] = useState(false);

  const tool = aiTools.find((t) => t.id === id);
  const toolReviews = reviews.filter((r) => r.toolId === id);
  const similarTools = tool ? aiTools.filter((t) => tool.similarTools.includes(t.id)) : [];
  const complementaryTools = tool ? aiTools.filter((t) => tool.complementaryTools.includes(t.id)) : [];

  if (!tool) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">Tool not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div
        className="relative h-80 flex items-center justify-center p-16"
        style={{ background: tool.logoBackground }}
      >
        <img
          src={tool.logo}
          alt={tool.name}
          className="max-w-sm max-h-full object-contain opacity-90"
          style={tool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all z-10"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-20 relative z-10">
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="mb-2">{tool.name}</h1>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
            <div className="text-right ml-8">
              <div className="text-3xl mb-1">{tool.price}</div>
              <div className="flex items-center gap-2 justify-end">
                <Star size={20} fill="currentColor" className="text-yellow-500" />
                <span className="text-lg">{tool.rating}</span>
                <span className="text-muted-foreground">
                  ({tool.reviewCount})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User size={18} />
              <span>{tool.developer}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground justify-end">
              <Clock size={18} />
              <span>Updated: {tool.lastUpdate}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Open
            </a>

            <button
              onClick={() => toggleSavedTool(tool.id)}
              className={`px-6 py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                isToolSaved(tool.id)
                  ? 'bg-primary/20 text-primary border-2 border-primary'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              <Heart size={20} fill={isToolSaved(tool.id) ? 'currentColor' : 'none'} />
              {isToolSaved(tool.id) ? 'Saved' : 'Save'}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowCollectionsMenu(!showCollectionsMenu)}
                className="px-6 py-4 bg-accent hover:bg-accent/80 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                <span>Collection</span>
              </button>

              {showCollectionsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCollectionsMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {userData.collections.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No collections yet. Create one in the sidebar!
                        </div>
                      ) : (
                        userData.collections.map((collection) => {
                          const IconComponent = (Icons as Record<string, LucideIcon>)[collection.icon];
                          const isInCollection = isToolInCollection(collection.id, tool.id);

                          return (
                            <button
                              key={collection.id}
                              onClick={() => {
                                if (isInCollection) {
                                  removeToolFromCollection(collection.id, tool.id);
                                } else {
                                  addToolToCollection(collection.id, tool.id);
                                }
                              }}
                              className="w-full flex items-center justify-between gap-3 px-3 py-2 hover:bg-accent rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {IconComponent && (
                                  <IconComponent size={18} style={{ color: collection.color }} />
                                )}
                                <span>{collection.name}</span>
                              </div>
                              {isInCollection && (
                                <Check size={16} className="text-primary" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <ShareTool tool={tool} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <h2 className="mb-4">About this tool</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {tool.longDescription}
            </p>

            <h3 className="mb-3">Features</h3>
            <ul className="space-y-2">
              {tool.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="mb-4">Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Overall Rating
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tool.rating}</span>
                  <Star size={20} fill="currentColor" className="text-yellow-500" />
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Reviews
                </div>
                <div className="text-2xl">{tool.reviewCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Category
                </div>
                <div className="capitalize">{tool.category}</div>
              </div>
            </div>
          </div>
        </div>

        <PricingSection
          plans={tool.plans}
          hasFreePlan={tool.hasFreePlan}
          hasTrial={tool.hasTrial}
          trialDays={tool.trialDays}
        />

        <div className="mt-8">
          <TutorialsSection tutorials={tool.tutorials} />
        </div>

        <div className="mt-8">
          <UpdatesSection updates={tool.updates} />
        </div>

        <div className="mt-8">
          <ToolComparison
            currentTool={tool}
            availableTools={aiTools.filter(t => t.category === tool.category || t.category === tool.category)}
          />
        </div>

        {similarTools.length > 0 && (
          <div className="mt-8">
            <SimilarTools tools={similarTools} />
          </div>
        )}

        {complementaryTools.length > 0 && (
          <div className="mt-8">
            <ComplementaryTools currentTool={tool} tools={complementaryTools} />
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 mb-8 mt-8">
          <h2 className="mb-6">User Reviews</h2>
          <div className="space-y-6">
            {toolReviews.map((review) => (
              <div
                key={review.id}
                className="pb-6 border-b border-border last:border-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{review.author}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                            className={
                              i < review.rating
                                ? 'text-yellow-500'
                                : 'text-muted-foreground'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {review.date}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">{review.comment}</p>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp size={14} />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
