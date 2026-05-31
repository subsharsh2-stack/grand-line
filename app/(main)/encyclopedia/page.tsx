'use client';

import { Search, BookOpen, Shield } from 'lucide-react';
import { useState } from 'react';

export default function EncyclopediaPage() {
  const [activeTab, setActiveTab] = useState('Characters');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['Characters', 'Locations', 'Organizations', 'Devil Fruits', 'Events', 'Weapons'];

  const characters = [
    { id: 1, initials: 'ML', name: 'Monkey D. Luffy', title: 'Captain', episode: 1, description: 'The pirate captain and protagonist' },
    { id: 2, initials: 'RZ', name: 'Roronoa Zoro', title: 'Swordsman', episode: 1, description: 'Master swordsman seeking to become the best' },
    { id: 3, initials: 'NM', name: 'Nami', title: 'Navigator', episode: 1, description: 'Skilled navigator and cartographer' },
    { id: 4, initials: 'UP', name: 'Usopp', title: 'Sniper', episode: 1, description: 'Sharpshooter and storyteller' },
    { id: 5, initials: 'SV', name: 'Sanji', title: 'Cook', episode: 20, description: 'Expert chef with devastating kicks' },
    { id: 6, initials: 'TC', name: 'Tony Tony Chopper', title: 'Doctor', episode: 81, description: 'Reindeer doctor with human powers' },
    { id: 7, initials: 'NR', name: 'Nico Robin', title: 'Archaeologist', episode: 67, description: 'Brilliant archaeologist seeking truth' },
    { id: 8, initials: 'FN', name: 'Franky', title: 'Shipwright', episode: 229, description: 'Cyborg shipwright and engineer' },
    { id: 9, initials: 'BK', name: 'Brook', title: 'Musician', episode: 337, description: 'Skeleton musician and swordsman' },
    { id: 10, initials: 'JN', name: 'Jinbe', title: 'Helmsman', episode: 430, description: 'Fish-man warrior and helmsman' },
    { id: 11, initials: 'SH', name: 'Shanks', title: 'Yonko', episode: 1, description: 'Red-haired emperor of the sea' },
    { id: 12, initials: 'WB', name: 'Whitebeard', title: 'Yonko', episode: 234, description: 'The strongest man in the world' },
  ];

  const avatarColors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500'];

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#060B14] text-white p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-8 h-8 text-[#f5a623]" />
          <h1 className="text-4xl font-bold font-display tracking-widest text-[#f5a623]">
            ENCYCLOPEDIA
          </h1>
        </div>
        <p className="text-white/60 text-lg">Explore characters, locations, and lore</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Search characters, locations, organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0a0f1a] border border-white/[0.06] rounded-2xl pl-12 pr-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium tracking-wider text-sm whitespace-nowrap transition ${
              activeTab === tab
                ? 'text-[#f5a623] border-b-2 border-[#f5a623] -mb-4'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Spoiler Shield Badge */}
      <div className="mb-8 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-lg text-sm">
        <Shield className="w-4 h-4" />
        <span>Spoiler Shield Active: Showing info up to Episode 150</span>
      </div>

      {/* Characters Grid */}
      {activeTab === 'Characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCharacters.map((char, idx) => (
            <div key={char.id} className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/20 transition cursor-pointer">
              {/* Avatar */}
              <div className={`${avatarColors[idx % avatarColors.length]} w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl mb-4`}>
                {char.initials}
              </div>

              {/* Content */}
              <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">{char.name}</h3>
              <p className="text-[#f5a623] text-sm font-semibold mb-3">{char.title}</p>
              <p className="text-white/60 text-sm line-clamp-2 mb-4">{char.description}</p>

              {/* Episode */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">First Appearance</p>
                <p className="text-white font-semibold">Episode {char.episode}</p>
              </div>

              {/* Link */}
              <button className="mt-4 w-full text-[#f5a623] hover:text-[#f5a623]/80 text-sm font-semibold flex items-center justify-center gap-2 transition">
                View Details <span>→</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab !== 'Characters' && (
        <div className="text-center py-16 bg-[#0a0f1a] border border-white/[0.06] rounded-2xl">
          <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50 text-lg">{activeTab} content coming soon</p>
          <p className="text-white/40 text-sm mt-2">Check back later for detailed information</p>
        </div>
      )}
    </main>
  );
}
