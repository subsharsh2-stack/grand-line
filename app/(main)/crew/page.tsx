'use client';

import { Users, Skull, Plus } from 'lucide-react';

export default function CrewPage() {
  const crews = [
    {
      id: 1,
      name: 'Straw Hat Alliance',
      emoji: '🏴‍☠️',
      bounty: '4,632,100,000',
      members: '12/20',
      rank: 'S+',
      rankColor: 'bg-red-500/20 border-red-500/50 text-red-300',
      description: 'Join the legend. Adventure awaits those brave enough.',
    },
    {
      id: 2,
      name: 'Dragon Claw Pirates',
      emoji: '🐉',
      bounty: '2,145,000,000',
      members: '18/25',
      rank: 'A',
      rankColor: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
      description: 'Eastern seas crew seeking active members for raids.',
    },
    {
      id: 3,
      name: 'Sky Knights',
      emoji: '⭐',
      bounty: '1,876,500,000',
      members: '8/15',
      rank: 'B+',
      rankColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
      description: 'Flying high above competition. Recruitment open.',
    },
    {
      id: 4,
      name: 'Iron Mast Crew',
      emoji: '⚙️',
      bounty: '956,200,000',
      members: '15/30',
      rank: 'B',
      rankColor: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
      description: 'Master shipwrights and engineers. Building legends.',
    },
  ];

  const benefits = [
    'Exclusive crew events and challenges',
    'Shared bounty rewards and treasures',
    'Crew-only Discord channel',
    'Rank up together and earn prestige',
    'Crew vs Crew competitions',
    'Custom crew name and banner',
  ];

  return (
    <main className="min-h-screen bg-[#060B14] text-white p-8">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-[#f5a623]/20 to-red-500/20 border border-[#f5a623]/30 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">🏴‍☠️</p>
          <h1 className="text-5xl font-bold font-display tracking-widest text-[#f5a623] mb-4">
            FIND YOUR NAKAMA
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Join a crew or create your own. Form bonds stronger than steel and conquer the Grand Line together.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#060B14] font-bold px-8 py-3 rounded-lg transition flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create a Crew
            </button>
            <button className="border border-[#f5a623] hover:bg-[#f5a623]/10 text-[#f5a623] font-bold px-8 py-3 rounded-lg transition flex items-center gap-2">
              <Users className="w-5 h-5" />
              Browse Crews
            </button>
          </div>
        </div>
      </div>

      {/* Active Crews Recruiting */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Skull className="w-8 h-8 text-[#f5a623]" />
          <h2 className="text-3xl font-bold font-display tracking-widest text-[#f5a623]">
            ACTIVE CREWS RECRUITING
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crews.map((crew) => (
            <div key={crew.id} className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/20 transition">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{crew.emoji}</span>
                    <h3 className="text-xl font-bold text-white">{crew.name}</h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${crew.rankColor}`}>
                  {crew.rank}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Total Bounty</p>
                  <p className="text-[#f5a623] font-bold text-lg">{crew.bounty}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Members</p>
                  <p className="text-white font-bold text-lg">{crew.members}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm mb-6">{crew.description}</p>

              {/* Join Button */}
              <button className="w-full bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#060B14] font-bold py-2 rounded-lg transition">
                Join Crew
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Your Own Crew */}
      <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-12">
        <div className="flex items-center gap-3 mb-6">
          <Plus className="w-8 h-8 text-[#f5a623]" />
          <h2 className="text-3xl font-bold font-display tracking-widest text-[#f5a623]">
            CREATE YOUR OWN CREW
          </h2>
        </div>

        <p className="text-white/60 mb-8 text-lg">
          Don't see a crew that fits? Start your own and become a legendary pirate captain. Here's what you get:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#f5a623] flex-shrink-0" />
              <span className="text-white/80 text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        <button className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#060B14] font-bold px-8 py-3 rounded-lg transition">
          Start Creating
        </button>
      </div>
    </main>
  );
}
