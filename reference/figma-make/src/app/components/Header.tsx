import { Bell, User, Settings, LogOut, Sparkles, Tag, TrendingUp, Gift } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'new' | 'update' | 'sale' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new',
    title: 'New Tool Added',
    message: 'Claude AI has been added to the library',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'update',
    title: 'MidJourney v6.1 Released',
    message: 'New features and improved image quality',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'sale',
    title: 'Limited Offer',
    message: 'ChatGPT Plus - 20% off this week',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'Tutorial Available',
    message: 'New Stable Diffusion advanced tutorial',
    time: '2 days ago',
    read: true,
  },
];

const notificationIcons = {
  new: Sparkles,
  update: TrendingUp,
  sale: Gift,
  info: Tag,
};

const notificationColors = {
  new: 'text-blue-400 bg-blue-500/20',
  update: 'text-green-400 bg-green-500/20',
  sale: 'text-purple-400 bg-purple-500/20',
  info: 'text-orange-400 bg-orange-500/20',
};

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <h1 className="text-xl">AI Library</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-muted-foreground">{unreadCount} new</p>
                    )}
                  </div>
                  <button className="text-xs text-primary hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => {
                    const Icon = notificationIcons[notification.type];
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-accent/20' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="p-2 rounded-lg flex-shrink-0">
                            <Icon size={18} className={notificationColors[notification.type].split(' ')[0]} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-border text-center">
                  <button className="text-sm text-primary hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm">John Doe</div>
              <div className="text-xs text-muted-foreground">Pro Member</div>
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">john.doe@example.com</div>
                </div>
                <div className="py-2">
                  <a
                    href="/profile"
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </a>
                  <a
                    href="/settings"
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </a>
                </div>
                <div className="border-t border-border py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent text-red-500 transition-colors">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
