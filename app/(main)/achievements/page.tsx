'use client';

import { Trophy } from 'lucide-react';
import { useState } from 'react';

export default function AchievementsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Journey', 'Community', 'Collector', 'Seasonal', 'Hidden', 'Legendary'];

  const achievements = [
    // Earned
    { id: 1, icon: '🚢', title: 'First Voyage', description: 'Start your adventure', rarity: 'common', earned: true, progress: 100 },
    { id: 2, icon: '⚔️', title: 'East Blue Survivor', description: 'Complete East Blue arc', rarity: 'common', earned: true, progress: 100 },
    { id: 3, icon: '👥', title: 'Nakama Found', description: 'Join or create a crew', rarity: 'rare', earned: true, progress: 100 },
    { id: 4, icon: '🧠', title: 'Quiz Master', description: 'Score 100% on a quiz', rarity: 'rare', earned: true, progress: 100 },
    { id: 5, icon: '🏆', title: 'Arc Conqueror', description: 'Complete Marineford arc', rarity: 'epic', earned: true, progress: 100 },
    { id: 6, icon: '💫', title: 'Haki Awakened', description: 'Unlock Haki ability', rarity: 'rare', earned: false, progress: 35 },
    { id: 7, icon: '💀', title: 'Marineford Witness', description: 'Experience the greatest war', rarity: 'legendary', earned: false, progress: 0 },
    { id: 8, icon: '☠️', title: 'Pirate King\'s Path', description: 'Reach final destination', rarity: 'legendary', earned: false, progress: 8 },
    { id: 9, icon: '🦉', title: 'Night Owl', description: 'Watch 100 episodes at night', rarity: 'hidden', earned: false, progress: 67 },
    { id: 10, icon: '🔥', title: 'Binge Monster', description: 'Watch 50 episodes in one week', rarity: 'hidden', earned: false, progress: 42 },
    { id: 11, icon: '🎯', title: 'Sharpshooter', description: 'Score 10 bullseyes in mini-game', rarity: 'common', earned: true, progress: 100 },
    { id: 12, icon: '🌊', title: 'Ocean Explorer', description: 'Discover all major islands', rarity: 'rare', earned: false, progress: 65 },
    { id: 13, icon: '💎', title: 'Treasure Hunter', description: 'Collect 25 rare items', rarity: 'epic', earned: false, progress: 22 },
    { id: 14, icon: '⚡', title: 'Thunder God', description: 'Unlock Zeus power', rarity: 'legendary', earned: false, progress: 0 },
    { id: 15, icon: '🏴‍☠️', title: 'Captain\'s Honor', description: 'Lead crew to rank S', rarity: 'epic', earned: false, progress: 18 },
    { id: 16, icon: '📚', title: 'Lore Master', description: 'Learn all character backstories', rarity: 'rare', earned: false, progress: 56 },
    { id: 17, icon: '🎨', title: 'Artist\'s Touch', description: 'Create custom crew banner', rarity: 'common', earned: true, progress: 100 },
    { id: 18, icon: '🔐', title: 'Secret Keeper', description: 'Unlock all hidden chapters', rarity: 'hidden', earned: false, progress: 30 },
    { id: 19, icon: '🌟', title: 'Rising Star', description: 'Reach 10,000 community points', rarity: 'rare', earned: false, progress: 72 },
    { id: 20, icon: '👑', title: 'Legend Among Legends', description: 'Complete all achievements', rarity: 'legendary', earned: false, progress: 11 },
  ];

  const rarityColors = {
    common: 'border-gray-400/30 bg-gray-400/10 text-gray-300',
    rare: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
    epic: 'border-purple-400/30 bg-purple-400/10 text-purple-300',
    legendary: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300',
    hidden: 'border-red-400/30 bg-red-400/10 text-red-300',
  };

  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <main className="min-h-screen bg-[#060B14] text-white p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-8 h-8 text-[#f5a623]" />
          <h1 className="text-4xl font-bold font-display tracking-widest text-[#f5a623]">
            ACHIEVEMENTS
          </h1>
        </div>
        <p className="text-white/60 text-lg">Earn badges and unlock prestige across your journey</p>
      </div>

      {/* Stats */}
      <div className="mb-8 bg-gradient-to-r from-[#f5a623]/20 to-purple-500/20 border border-[#f5a623]/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Progress</p>
            <p className="text-4xl font-bold text-[#f5a623]">
              {earnedCount} <span className="text-2xl text-white/50">/ {achievements.length}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="flex gap-3 flex-wrap justify-end">
              {[
                { label: 'Common', count: 3, color: 'bg-gray-400/20 border-gray-400/50 text-gray-300' },
                { label: 'Rare', count: 5, color: 'bg-blue-400/20 border-blue-400/50 text-blue-300' },
                { label: 'Epic', count: 3, color: 'bg-purple-400/20 border-purple-400/50 text-purple-300' },
                { label: 'Legendary', count: 1, color: 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300' },
              ].map((item) => (
                <div key={item.label} className={`px-4 py-2 rounded-lg border text-xs font-bold ${item.color}`}>
                  {item.label} {item.count}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-[#f5a623] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(earnedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeFilter === filter
                ? 'bg-[#f5a623] text-[#060B14]'
                : 'bg-white/5 border border-white/10 text-white hover:border-white/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`border rounded-xl p-5 backdrop-blur-sm transition hover:border-white/20 ${
              achievement.earned
                ? 'bg-[#0a0f1a] border-white/[0.06]'
                : 'bg-[#0a0f1a] border-white/[0.06]'
            }`}
          >
            {/* Icon */}
            <div className={`text-5xl mb-3 ${achievement.earned ? '' : 'opacity-50 grayscale'}`}>
              {achievement.icon}
            </div>

            {/* Title and Description */}
            <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{achievement.title}</h3>
            <p className="text-white/50 text-xs line-clamp-2 mb-4">{achievement.description}</p>

            {/* Rarity Badge */}
            <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border mb-3 ${rarityColors[achievement.rarity]}`}>
              {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
            </div>

            {/* Progress or Earned Badge */}
            {achievement.earned ? (
              <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-3 py-1.5 rounded-lg text-xs font-bold text-center">
                ✓ EARNED
              </div>
            ) : (
              <div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-[#f5a623] h-1.5 rounded-full"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
                <p className="text-white/50 text-xs text-center">{achievement.progress}% complete</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
