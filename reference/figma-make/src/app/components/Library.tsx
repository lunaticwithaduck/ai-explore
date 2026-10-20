import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { aiTools } from '../data/aiTools';
import { ToolCard } from './ToolCard';
import { useUser } from '../context/UserContext';
import { BundlesSection } from './BundlesSection';

interface LibraryProps {
  selectedCategory: string;
  selectedCollection: string | null;
}

type SortOption = 'rating-high' | 'rating-low' | 'name-asc' | 'name-desc' | 'price-low' | 'price-high';

export function Library({ selectedCategory, selectedCollection }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating-high');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { userData } = useUser();

  // Get all unique tags from tools
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    aiTools.forEach(tool => tool.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('rating-high');
  };

  const filteredTools = useMemo(() => {
    let tools = aiTools.filter((tool) => {
      // Filter by collection
      if (selectedCollection === 'saved') {
        if (!userData.savedTools.includes(tool.id)) return false;
      } else if (selectedCollection) {
        const collection = userData.collections.find((c) => c.id === selectedCollection);
        if (!collection?.toolIds.includes(tool.id)) return false;
      }

      // Filter by category
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      // Filter by search
      const matchesSearch = tool.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.developer.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by tags
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => tool.tags.includes(tag));

      return matchesCategory && matchesSearch && matchesTags;
    });

    // Sort tools
    tools.sort((a, b) => {
      switch (sortBy) {
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-low':
          const priceA = a.price === 'Free' ? 0 : parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = b.price === 'Free' ? 0 : parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        case 'price-high':
          const priceA2 = a.price === 'Free' ? 0 : parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB2 = b.price === 'Free' ? 0 : parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceB2 - priceA2;
        default:
          return 0;
      }
    });

    return tools;
  }, [selectedCategory, selectedCollection, searchQuery, selectedTags, sortBy, userData]);

  const getTitle = () => {
    if (selectedCollection === 'saved') return 'Saved Tools';
    if (selectedCollection) {
      const collection = userData.collections.find((c) => c.id === selectedCollection);
      return collection?.name || 'Collection';
    }
    return 'AI Library';
  };

  const getDescription = () => {
    if (selectedCollection === 'saved') return 'Your saved AI tools';
    if (selectedCollection) return 'Tools in this collection';
    return 'Discover the best AI tools for your projects';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-2">{getTitle()}</h1>
          <p className="text-muted-foreground">
            {getDescription()}
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
                size={20}
              />
              <input
                type="text"
                placeholder="Search AI tools by name, description, or developer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none transition-all text-black placeholder:text-muted-foreground relative z-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                showFilters || selectedTags.length > 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              <SlidersHorizontal size={20} />
              <span className="hidden md:inline">Filters</span>
              {selectedTags.length > 0 && (
                <span className="bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm">Sort By</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy('rating-high')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    sortBy === 'rating-high'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  <TrendingUp size={16} />
                  Highest Rated
                </button>
                <button
                  onClick={() => setSortBy('rating-low')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    sortBy === 'rating-low'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  <TrendingDown size={16} />
                  Lowest Rated
                </button>
                <button
                  onClick={() => setSortBy('price-low')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    sortBy === 'price-low'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  <DollarSign size={16} />
                  Lowest Price
                </button>
                <button
                  onClick={() => setSortBy('price-high')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    sortBy === 'price-high'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  <DollarSign size={16} />
                  Highest Price
                </button>
                <button
                  onClick={() => setSortBy('name-asc')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    sortBy === 'name-asc'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  A-Z
                </button>
                <button
                  onClick={() => setSortBy('name-desc')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    sortBy === 'name-desc'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  Z-A
                </button>
              </div>

              <div>
                <h3 className="text-sm mb-3">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent hover:bg-accent/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedCategory === 'all' && !selectedCollection && !searchQuery && selectedTags.length === 0 && (
          <BundlesSection />
        )}

        <div className="mb-6">
          <h2 className="mb-4">
            {selectedCategory === 'all' && !selectedCollection && !searchQuery && selectedTags.length === 0
              ? 'All Tools'
              : 'Tools'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No tools found matching your criteria
            </p>
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
