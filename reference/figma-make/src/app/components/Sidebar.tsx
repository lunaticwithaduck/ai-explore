import { categories } from '../data/aiTools';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import {
  Grid3x3,
  Image,
  Type,
  Video,
  Music,
  Code,
  BarChart,
  Heart,
  Plus,
  LucideIcon,
  Trash2,
  X
} from 'lucide-react';
import * as Icons from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCollection: string | null;
  onCollectionChange: (collectionId: string | null) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'grid-3x3': <Grid3x3 size={20} />,
  'image': <Image size={20} />,
  'type': <Type size={20} />,
  'video': <Video size={20} />,
  'music': <Music size={20} />,
  'code': <Code size={20} />,
  'bar-chart': <BarChart size={20} />,
};

const colorOptions = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
];

const iconOptions = ['Briefcase', 'Palette', 'Star', 'Zap', 'Trophy', 'Target', 'Bookmark', 'Flag'];

export function Sidebar({ selectedCategory, onCategoryChange, selectedCollection, onCollectionChange }: SidebarProps) {
  const { userData, addCollection, deleteCollection } = useUser();
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionIcon, setNewCollectionIcon] = useState('Bookmark');
  const [newCollectionColor, setNewCollectionColor] = useState('#3b82f6');

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      addCollection({
        name: newCollectionName,
        icon: newCollectionIcon,
        toolIds: [],
        color: newCollectionColor,
      });
      setNewCollectionName('');
      setNewCollectionIcon('Bookmark');
      setNewCollectionColor('#3b82f6');
      setShowNewCollectionModal(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
    onCollectionChange(null);
  };

  const handleCollectionClick = (collectionId: string) => {
    onCollectionChange(collectionId);
    onCategoryChange('all');
  };

  const handleSavedClick = () => {
    onCollectionChange('saved');
    onCategoryChange('all');
  };

  return (
    <>
      <aside className="w-64 bg-card border-r border-border h-full overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="mb-3 text-muted-foreground text-xs uppercase tracking-wide">Library</h2>
            <button
              onClick={handleSavedClick}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                selectedCollection === 'saved'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart size={20} fill={selectedCollection === 'saved' ? 'currentColor' : 'none'} />
                <span>Saved Tools</span>
              </div>
              <span className="text-xs bg-accent/50 px-2 py-1 rounded">
                {userData.savedTools.length}
              </span>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-muted-foreground text-xs uppercase tracking-wide">Categories</h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    selectedCategory === category.id && !selectedCollection
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  {iconMap[category.icon]}
                  <span>{category.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-muted-foreground text-xs uppercase tracking-wide">Collections</h2>
              <button
                onClick={() => setShowNewCollectionModal(true)}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <nav className="space-y-1">
              {userData.collections.map((collection) => {
                const IconComponent = (Icons as Record<string, LucideIcon>)[collection.icon];
                return (
                  <div
                    key={collection.id}
                    className={`flex items-center gap-2 rounded-lg ${
                      selectedCollection === collection.id
                        ? 'bg-primary text-primary-foreground'
                        : ''
                    }`}
                  >
                    <button
                      onClick={() => handleCollectionClick(collection.id)}
                      className="flex-1 flex items-center justify-between gap-3 px-4 py-3 transition-all hover:bg-accent/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {IconComponent && (
                          <IconComponent size={20} style={{ color: collection.color }} />
                        )}
                        <span>{collection.name}</span>
                      </div>
                      <span className="text-xs bg-accent/50 px-2 py-1 rounded">
                        {collection.toolIds.length}
                      </span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {showNewCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2>Create New Collection</h2>
              <button
                onClick={() => setShowNewCollectionModal(false)}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Collection Name</label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Design Tools"
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((iconName) => {
                    const IconComponent = (Icons as Record<string, LucideIcon>)[iconName];
                    return (
                      <button
                        key={iconName}
                        onClick={() => setNewCollectionIcon(iconName)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newCollectionIcon === iconName
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {IconComponent && <IconComponent size={20} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewCollectionColor(color.value)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        newCollectionColor === color.value
                          ? 'border-white scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewCollectionModal(false)}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
