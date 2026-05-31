'use client';

import { User, Bell, Shield, Palette, Lock, AlertTriangle, Upload } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState('Account');
  const [displayName, setDisplayName] = useState('CaptainLuffy');
  const [bio, setBio] = useState('Adventure awaits');
  const [country, setCountry] = useState('Grand Line');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('UTC');
  const [spoilerShield, setSpoilerShield] = useState(true);
  const [spoilerEpisode, setSpoilerEpisode] = useState(150);
  const [notifications, setNotifications] = useState({
    newDiscussions: true,
    eventReminders: true,
    crewUpdates: true,
    achievements: true,
  });

  const sections = [
    { id: 'Account', icon: User, label: 'Account' },
    { id: 'Notifications', icon: Bell, label: 'Notifications' },
    { id: 'SpoilerShield', icon: Shield, label: 'Spoiler Shield' },
    { id: 'Appearance', icon: Palette, label: 'Appearance' },
    { id: 'Privacy', icon: Lock, label: 'Privacy' },
    { id: 'DangerZone', icon: AlertTriangle, label: 'Danger Zone' },
  ];

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'Account':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-3">Avatar</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#f5a623]/20 border border-[#f5a623]/40 flex items-center justify-center font-bold text-[#f5a623] text-2xl">
                  CL
                </div>
                <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-lg transition">
                  <Upload className="w-4 h-4" />
                  Change Avatar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#0a0f1a] border border-white/[0.06] rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-[#0a0f1a] border border-white/[0.06] rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Country</label>
                <select className="w-full bg-[#0a0f1a] border border-white/[0.06] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition">
                  <option>{country}</option>
                  <option>East Blue</option>
                  <option>West Blue</option>
                  <option>North Blue</option>
                  <option>South Blue</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Language</label>
                <select className="w-full bg-[#0a0f1a] border border-white/[0.06] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition">
                  <option>{language}</option>
                  <option>Japanese</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">Timezone</label>
              <select className="w-full bg-[#0a0f1a] border border-white/[0.06] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition">
                <option>{timezone}</option>
                <option>EST</option>
                <option>CST</option>
                <option>PST</option>
              </select>
            </div>

            <button className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#060B14] font-bold px-8 py-3 rounded-lg transition">
              Save Changes
            </button>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-6">
            <p className="text-white/70 text-sm">Control how you receive notifications</p>

            {[
              { key: 'newDiscussions', label: 'New Discussions', description: 'Be notified when new discussion threads are posted' },
              { key: 'eventReminders', label: 'Event Reminders', description: 'Get alerts about upcoming events' },
              { key: 'crewUpdates', label: 'Crew Updates', description: 'Updates from your crew members' },
              { key: 'achievements', label: 'Achievements', description: 'When you unlock new achievements' },
            ].map((item: any) => (
              <div key={item.key} className="flex items-start justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <p className="text-white font-semibold">{item.label}</p>
                  <p className="text-white/50 text-sm">{item.description}</p>
                </div>
                <button
                  onClick={() => handleNotificationChange(item.key)}
                  className={`relative w-14 h-8 rounded-full transition ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-[#f5a623]' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        );

      case 'SpoilerShield':
        return (
          <div className="space-y-6">
            <p className="text-white/70 text-sm">Protect yourself from spoilers by setting your viewing progress</p>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-semibold text-lg">Spoiler Shield</p>
                  <p className="text-white/50 text-sm">Hide content beyond your current episode</p>
                </div>
                <button
                  onClick={() => setSpoilerShield(!spoilerShield)}
                  className={`relative w-14 h-8 rounded-full transition ${
                    spoilerShield ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      spoilerShield ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {spoilerShield && (
                <div className="mt-6 p-4 bg-black/40 border border-white/10 rounded-lg">
                  <label className="block text-white/70 text-sm font-semibold mb-3">
                    Current Episode: <span className="text-[#f5a623] text-lg font-bold">{spoilerEpisode}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="1100"
                    value={spoilerEpisode}
                    onChange={(e) => setSpoilerEpisode(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#f5a623]"
                  />
                  <p className="text-white/50 text-xs mt-2">Showing info up to Episode {spoilerEpisode}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'Appearance':
        return (
          <div className="space-y-6">
            <p className="text-white/70 text-sm">Customize your experience</p>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 cursor-pointer transition">
                <p className="text-white font-semibold">Dark Mode</p>
                <p className="text-white/50 text-sm">Currently active</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 cursor-pointer transition">
                <p className="text-white font-semibold">Font Size</p>
                <p className="text-white/50 text-sm">Standard</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 cursor-pointer transition">
                <p className="text-white font-semibold">Animations</p>
                <p className="text-white/50 text-sm">Enabled</p>
              </div>
            </div>
          </div>
        );

      case 'Privacy':
        return (
          <div className="space-y-6">
            <p className="text-white/70 text-sm">Manage your privacy settings</p>

            {[
              { label: 'Profile Visibility', description: 'Allow others to see your profile' },
              { label: 'Show Activity', description: 'Display your recent activity' },
              { label: 'Search Visibility', description: 'Allow being found in search' },
              { label: 'Message Requests', description: 'Who can message you' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <p className="text-white font-semibold">{item.label}</p>
                  <p className="text-white/50 text-sm">{item.description}</p>
                </div>
                <button className="relative w-14 h-8 rounded-full bg-[#f5a623] transition">
                  <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full" />
                </button>
              </div>
            ))}
          </div>
        );

      case 'DangerZone':
        return (
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-bold text-lg mb-2">Delete Account</p>
                  <p className="text-white/60 text-sm mb-6">
                    This action is permanent and cannot be undone. All your data, achievements, and crew memberships will be deleted.
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition">
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
              <p className="text-white font-bold mb-3">Other Options</p>
              <button className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white py-3 rounded-lg transition text-sm font-semibold">
                Export My Data
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#060B14] text-white p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-8 h-8 text-[#f5a623]" />
          <h1 className="text-4xl font-bold font-display tracking-widest text-[#f5a623]">
            SETTINGS
          </h1>
        </div>
        <p className="text-white/60 text-lg">Customize your Grand Line experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-6 sticky top-8">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-sm ${
                      selectedSection === section.id
                        ? 'bg-[#f5a623] text-[#060B14]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="lg:col-span-3">
          <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-display tracking-widest text-[#f5a623] mb-8">
              {selectedSection}
            </h2>
            {renderContent()}
          </div>
        </div>
      </div>
    </main>
  );
}
