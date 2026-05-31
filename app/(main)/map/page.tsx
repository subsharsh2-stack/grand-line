'use client';

import { MapPin, Compass, Lock } from 'lucide-react';

export default function MapPage() {
  const islands = [
    { id: 'east-blue', name: 'East Blue', x: 20, y: 35, color: '#3b82f6', visited: true },
    { id: 'reverse-mt', name: 'Reverse Mt.', x: 35, y: 28, color: '#f97316', visited: true },
    { id: 'alabasta', name: 'Alabasta', x: 42, y: 45, color: '#f5a623', visited: true },
    { id: 'sky-island', name: 'Sky Island', x: 55, y: 25, color: '#06b6d4', visited: true },
    { id: 'water-7', name: 'Water 7', x: 60, y: 40, color: '#3b82f6', visited: true },
    { id: 'marineford', name: 'Marineford', x: 75, y: 50, color: '#ef4444', visited: true },
    { id: 'fish-man', name: 'Fish-Man Island', x: 70, y: 65, color: '#8b5cf6', visited: false },
    { id: 'wano', name: 'Wano', x: 80, y: 35, color: '#ec4899', visited: false },
    { id: 'laugh-tale', name: 'Laugh Tale', x: 85, y: 55, color: '#f5a623', visited: false, locked: true },
  ];

  return (
    <main className="min-h-screen bg-[#060B14] text-white p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <Compass className="w-8 h-8 text-[#f5a623]" />
          <h1 className="text-4xl font-bold font-display tracking-widest text-[#f5a623]">
            GRAND LINE WORLD MAP
          </h1>
        </div>
        <p className="text-white/60 text-lg">Navigate the world and unlock new islands</p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {['World', 'Grand Line', 'East Blue', 'West Blue'].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === 'Grand Line'
                ? 'bg-[#f5a623] text-[#060B14]'
                : 'bg-white/5 border border-white/10 text-white hover:border-white/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative bg-[#0a0f1a] border border-white/[0.06] rounded-2xl overflow-hidden p-8 min-h-[500px]">
            {/* SVG Map */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full absolute inset-0"
              style={{ minHeight: '500px' }}
            >
              {/* Dotted connection lines */}
              <line x1="20" y1="35" x2="35" y2="28" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="35" y1="28" x2="42" y2="45" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="42" y1="45" x2="55" y2="25" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="55" y1="25" x2="60" y2="40" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="60" y1="40" x2="75" y2="50" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="75" y1="50" x2="70" y2="65" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="70" y1="65" x2="80" y2="35" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="80" y1="35" x2="85" y2="55" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" strokeWidth="0.5" />

              {/* Islands */}
              {islands.map((island) => (
                <g key={island.id}>
                  {/* Glow effect */}
                  <circle cx={island.x} cy={island.y} r="3" fill={island.color} opacity="0.3" />
                  {/* Main circle */}
                  <circle cx={island.x} cy={island.y} r="1.5" fill={island.color} />
                  {/* Lock icon for locked islands */}
                  {island.locked && (
                    <text x={island.x} y={island.y + 4} fontSize="2" fill="#f5a623" textAnchor="middle">
                      🔒
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* "Coming Soon" overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl z-10">
              <div className="text-center">
                <p className="text-[#f5a623] text-lg font-bold tracking-widest">INTERACTIVE 3D MAP</p>
                <p className="text-white/60 text-sm mt-2">Coming Soon</p>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg text-xs text-white/70 z-20">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Visited
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#f5a623]" /> Current
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/20" /> Upcoming
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Your Voyage Card */}
          <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#f5a623]" />
              <h3 className="text-[#f5a623] font-bold tracking-widest text-sm">YOUR VOYAGE</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Current Location</p>
                <p className="text-white font-semibold">Marineford</p>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Next Destination</p>
                <p className="text-white font-semibold">Wano Country</p>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Progress</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-[#f5a623] h-2 rounded-full w-[72%]" />
                </div>
                <p className="text-[#f5a623] text-sm font-bold mt-1">72%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
