'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function DevilFruitsPage() {
  const [activeRarity, setActiveRarity] = useState('All');

  const rarities = ['All', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythical'];

  const fruits = [
    { id: 1, name: 'Gomu Gomu no Mi', emoji: '🔴', type: 'Paramecia', typeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', rarity: 'Common', rarityColor: 'bg-gray-500/20 border-gray-500/50 text-gray-300', description: 'Rubber body powers', owned: true, earnMethod: null },
    { id: 2, name: 'Mera Mera no Mi', emoji: '🔥', type: 'Logia', typeColor: 'bg-orange-500/20 border-orange-500/50 text-orange-300', rarity: 'Rare', rarityColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', description: 'Fire manipulation', owned: true, earnMethod: null },
    { id: 3, name: 'Hie Hie no Mi', emoji: '❄️', type: 'Logia', typeColor: 'bg-orange-500/20 border-orange-500/50 text-orange-300', rarity: 'Rare', rarityColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', description: 'Freeze everything', owned: true, earnMethod: null },
    { id: 4, name: 'Gura Gura no Mi', emoji: '📍', type: 'Paramecia', typeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', rarity: 'Legendary', rarityColor: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300', description: 'Create earthquakes', owned: false, earnMethod: 'Complete Marineford Arc' },
    { id: 5, name: 'Yami Yami no Mi', emoji: '⚫', type: 'Logia', typeColor: 'bg-orange-500/20 border-orange-500/50 text-orange-300', rarity: 'Legendary', rarityColor: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300', description: 'Darkness powers', owned: false, earnMethod: 'Reach Rank A' },
    { id: 6, name: 'Ope Ope no Mi', emoji: '🏥', type: 'Paramecia', typeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', rarity: 'Epic', rarityColor: 'bg-purple-500/20 border-purple-500/50 text-purple-300', description: 'Create operation fields', owned: true, earnMethod: null },
    { id: 7, name: 'Tori Tori: Mythical Zoan', emoji: '🦅', type: 'Zoan', typeColor: 'bg-green-500/20 border-green-500/50 text-green-300', rarity: 'Mythical', rarityColor: 'bg-pink-500/20 border-pink-500/50 text-pink-300', description: 'Transform into phoenix', owned: false, earnMethod: 'Reach 100 Day Streak' },
    { id: 8, name: 'Mochi Mochi no Mi', emoji: '🍡', type: 'Paramecia', typeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', rarity: 'Epic', rarityColor: 'bg-purple-500/20 border-purple-500/50 text-purple-300', description: 'Mochi body control', owned: false, earnMethod: 'Win 5 PvP Battles' },
    { id: 9, name: 'Ito Ito no Mi', emoji: '🧵', type: 'Paramecia', typeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', rarity: 'Epic', rarityColor: 'bg-purple-500/20 border-purple-500/50 text-purple-300', description: 'Create string constructs', owned: false, earnMethod: 'Complete Dressrosa' },
    { id: 10, name: 'Nikyu Nikyu no Mi', emoji: '🐾', type: 'Paramecia', typeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', rarity: 'Rare', rarityColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', description: 'Push anything away', owned: false, earnMethod: 'Complete Thriller Bark' },
    { id: 11, name: 'Pika Pika no Mi', emoji: '⚡', type: 'Logia', typeColor: 'bg-orange-500/20 border-orange-500/50 text-orange-300', rarity: 'Rare', rarityColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', description: 'Light speed travel', owned: false, earnMethod: 'Reach Episode 500' },
    { id: 12, name: 'Bari Bari no Mi', emoji: '🛡️', type: 'Paramecia', typeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300', rarity: 'Common', rarityColor: 'bg-gray-500/20 border-gray-500/50 text-gray-300', description: 'Create barriers', owned: true, earnMethod: null },
  ];

  const ownedCount = fruits.filter((f) => f.owned).length;

  return (
    <main className="min-h-screen bg-[#060B14] text-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-[#f5a623]" />
            <h1 className="text-4xl font-bold font-display tracking-widest text-[#f5a623]">
              DEVIL FRUIT COLLECTION
            </h1>
          </div>
          <p className="text-white/60 text-lg">Collect and unlock supernatural powers</p>
        </div>
        <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-xl px-6 py-4 text-right">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Collected</p>
          <p className="text-3xl font-bold text-[#f5a623]">
            {ownedCount} <span className="text-lg text-white/50">/ {fruits.length}</span>
          </p>
        </div>
      </div>

      {/* Rarity Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {rarities.map((rarity) => (
          <button
            key={rarity}
            onClick={() => setActiveRarity(rarity)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeRarity === rarity
                ? 'bg-[#f5a623] text-[#060B14]'
                : 'bg-white/5 border border-white/10 text-white hover:border-white/20'
            }`}
          >
            {rarity}
          </button>
        ))}
      </div>

      {/* Fruits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {fruits.map((fruit) => (
          <div
            key={fruit.id}
            className={`border rounded-2xl p-6 backdrop-blur-sm transition hover:border-white/20 ${
              fruit.owned
                ? 'bg-[#0a0f1a] border-white/[0.06]'
                : 'bg-[#0a0f1a]/50 border-white/[0.03]'
            }`}
          >
            {/* Emoji */}
            <div className={`text-6xl mb-3 ${fruit.owned ? '' : 'opacity-30 grayscale'}`}>
              {fruit.emoji}
            </div>

            {/* Name */}
            <h3 className={`font-bold text-sm mb-2 line-clamp-2 ${fruit.owned ? 'text-white' : 'text-white/50'}`}>
              {fruit.name}
            </h3>

            {/* Description */}
            <p className="text-white/50 text-xs line-clamp-2 mb-4">{fruit.description}</p>

            {/* Type Badge */}
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-3 ${fruit.typeColor}`}>
              {fruit.type}
            </div>

            {/* Rarity Badge */}
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ml-2 mb-4 ${fruit.rarityColor}`}>
              {fruit.rarity}
            </div>

            {/* Status */}
            {fruit.owned ? (
              <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-3 py-2 rounded-lg text-xs font-bold text-center w-full">
                ✓ OWNED
              </div>
            ) : (
              <div>
                <p className="text-white/50 text-xs mb-2">🔒 Locked</p>
                <p className="text-[#f5a623] text-xs font-semibold">{fruit.earnMethod}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
