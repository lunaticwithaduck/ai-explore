import { User, Mail, Calendar, Award, Heart, Folder, TrendingUp, Edit2, Shield, Bell as BellIcon, ArrowLeft } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { aiTools } from '../data/aiTools';
import { useNavigate } from 'react-router';

export function Profile() {
  const { userData } = useUser();
  const navigate = useNavigate();

  const savedToolsData = aiTools.filter(tool => userData.savedTools.includes(tool.id));

  const stats = [
    { label: 'Saved Tools', value: userData.savedTools.length, icon: Heart, color: 'text-red-400' },
    { label: 'Collections', value: userData.collections.length, icon: Folder, color: 'text-blue-400' },
    { label: 'Member Since', value: 'May 2026', icon: Calendar, color: 'text-green-400' },
    { label: 'Activity Score', value: '847', icon: TrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all z-10"
        >
          <ArrowLeft size={20} />
          <span>Back to Library</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-24 relative z-10">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <div className="flex items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl">
                <User size={64} />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
                <Edit2 size={16} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="mb-2">John Doe</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span className="text-sm">john.doe@example.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="text-sm">Joined May 2026</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded-full text-sm flex items-center gap-1 border border-yellow-500/30">
                      <Award size={14} />
                      Pro Member
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors flex items-center gap-2">
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              </div>
              <p className="text-muted-foreground">
                AI enthusiast and developer exploring the latest tools and technologies.
                Passionate about integrating AI solutions into everyday workflows.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-accent/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={20} className={stat.color} />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-2xl">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saved Tools Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2>Saved Tools</h2>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-primary hover:underline"
            >
              View All
            </button>
          </div>

          {savedToolsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedToolsData.slice(0, 3).map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => navigate(`/tool/${tool.id}`)}
                  className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center"
                    style={{ background: tool.logoBackground }}
                  >
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-8 h-8 object-contain"
                      style={tool.id === '2' ? { filter: 'brightness(0) invert(1)' } : undefined}
                    />
                  </div>
                  <h3 className="text-sm mb-1">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Heart size={48} className="mx-auto mb-4 opacity-50" />
              <p>No saved tools yet</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Explore Tools
              </button>
            </div>
          )}
        </div>

        {/* Collections Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2>My Collections</h2>
            <span className="text-sm text-muted-foreground">
              {userData.collections.length} collections
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.collections.map((collection) => (
              <div
                key={collection.id}
                className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${collection.color}20`, border: `1px solid ${collection.color}40` }}
                  >
                    <Folder size={20} style={{ color: collection.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm">{collection.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {collection.toolIds.length} tools
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="mb-6">Settings</h2>

          <div className="space-y-4">
            <a
              href="/settings"
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-blue-400" />
                <div className="text-left">
                  <div className="text-sm">Privacy & Security</div>
                  <div className="text-xs text-muted-foreground">Manage your privacy settings</div>
                </div>
              </div>
              <span className="text-muted-foreground">›</span>
            </a>

            <a
              href="/settings"
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <BellIcon size={20} className="text-purple-400" />
                <div className="text-left">
                  <div className="text-sm">Notifications</div>
                  <div className="text-xs text-muted-foreground">Configure notification preferences</div>
                </div>
              </div>
              <span className="text-muted-foreground">›</span>
            </a>

            <a
              href="/settings"
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Award size={20} className="text-yellow-400" />
                <div className="text-left">
                  <div className="text-sm">Subscription</div>
                  <div className="text-xs text-muted-foreground">Manage your Pro membership</div>
                </div>
              </div>
              <span className="text-muted-foreground">›</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
