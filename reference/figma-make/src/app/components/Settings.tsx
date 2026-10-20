import { ArrowLeft, User, Mail, Lock, Shield, Bell, Moon, Globe, CreditCard, LogOut, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function Settings() {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all z-10"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-20 relative z-10">
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <h1 className="mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <User size={24} />
            <h2>Account Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-black placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-black placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="password123"
                  className="w-full pl-10 pr-12 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-black placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={24} />
            <h2>Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="text-sm mb-1">Two-Factor Authentication</div>
                <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
              </div>
              <button className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors text-sm">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="text-sm mb-1">Profile Visibility</div>
                <div className="text-xs text-muted-foreground">Control who can see your profile</div>
              </div>
              <select className="px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none text-black">
                <option>Public</option>
                <option>Private</option>
                <option>Friends Only</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="text-sm mb-1">Activity Status</div>
                <div className="text-xs text-muted-foreground">Show when you're active</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-zinc-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell size={24} />
            <h2>Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="text-sm mb-1">Email Notifications</div>
                <div className="text-xs text-muted-foreground">Receive updates via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-zinc-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="text-sm mb-1">Push Notifications</div>
                <div className="text-xs text-muted-foreground">Get notified about updates</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-zinc-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="text-sm mb-1">Weekly Digest</div>
                <div className="text-xs text-muted-foreground">Summary of your activity</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-zinc-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="text-sm mb-1">New Tool Releases</div>
                <div className="text-xs text-muted-foreground">Get notified about new AI tools</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-zinc-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Moon size={24} />
            <h2>Appearance & Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="text-sm mb-1">Theme</div>
                <div className="text-xs text-muted-foreground">Always dark mode</div>
              </div>
              <select className="px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none text-black">
                <option>Dark</option>
                <option>Light</option>
                <option>Auto</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2">
                <Globe size={18} />
                <div>
                  <div className="text-sm mb-1">Language</div>
                  <div className="text-xs text-muted-foreground">Choose your language</div>
                </div>
              </div>
              <select className="px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none text-black">
                <option>English</option>
                <option>Български</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard size={24} />
            <h2>Subscription & Billing</h2>
          </div>

          <div className="p-6 border border-primary/50 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg mb-1">Pro Member</div>
                <div className="text-sm text-muted-foreground">$9.99/month • Next billing: June 18, 2026</div>
              </div>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">
                Active
              </span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors text-sm">
                Manage Subscription
              </button>
              <button className="px-4 py-2 border border-border hover:bg-accent/50 rounded-lg transition-colors text-sm">
                View Invoices
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="text-sm">Payment Method</div>
              <div className="text-sm text-muted-foreground">•••• 4242</div>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="text-sm">Billing Email</div>
              <div className="text-sm text-muted-foreground">john.doe@example.com</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-destructive/50 rounded-xl p-6">
          <h3 className="text-destructive mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-destructive/10 transition-colors">
              <div className="text-left">
                <div className="text-sm mb-1">Delete Account</div>
                <div className="text-xs text-muted-foreground">Permanently delete your account and data</div>
              </div>
              <span className="text-destructive">Delete</span>
            </button>
            <button className="w-full flex items-center gap-2 justify-center p-3 border border-border rounded-lg hover:bg-accent transition-colors">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
