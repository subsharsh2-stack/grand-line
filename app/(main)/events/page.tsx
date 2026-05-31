'use client';

import { Calendar, Flame, Gift } from 'lucide-react';

export default function EventsPage() {
  const activeEvents = [
    {
      id: 1,
      title: 'Marineford Month',
      emoji: '🔥',
      description: 'Battle through the greatest war. Earn exclusive rewards.',
      endDate: '6d 14h 32m',
      progress: 47,
      rewards: ['🪙 Berries', '💰 Bounty', '🍗 Mera Mera'],
      featured: true,
    },
    {
      id: 2,
      title: 'Daily Navigation Challenge',
      emoji: '🗺️',
      description: 'Complete daily navigation tasks for amazing rewards.',
      endDate: '2d 8h 15m',
      progress: 62,
      rewards: ['🪙 Berries', '⭐ XP', '📜 Lore Scroll'],
      featured: false,
    },
  ];

  const upcomingEvents = [
    {
      id: 3,
      title: 'Wano Country Festival',
      emoji: '🎉',
      description: 'Experience the beauty of Wano. Exclusive cosmetics await.',
      startsIn: '5d',
      progress: 0,
      rewards: ['🪙 Berries', '👘 Kimono', '⚡ Skill Book'],
    },
    {
      id: 4,
      title: 'Devil Fruit Hunt',
      emoji: '🍎',
      description: 'Find rare Devil Fruits hidden across the Grand Line.',
      startsIn: '12d',
      progress: 0,
      rewards: ['🍗 Gomu Gomu', '🔥 Mera Mera', '💎 Legendary Fruit'],
    },
  ];

  const EventCard = ({ event, isUpcoming = false }) => (
    <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/20 transition">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-br from-[#f5a623]/30 to-purple-500/30 flex items-center justify-center overflow-hidden">
        <div className="text-6xl">{event.emoji}</div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white font-bold text-xl mb-2">{event.title}</h3>
        <p className="text-white/60 text-sm mb-4">{event.description}</p>

        {/* Time Info */}
        <div className="mb-4 pb-4 border-b border-white/10">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
            {isUpcoming ? 'Starts in' : 'Ends in'}
          </p>
          <p className="text-[#f5a623] font-bold text-lg">
            {isUpcoming ? event.startsIn : event.endDate}
          </p>
        </div>

        {/* Progress Bar */}
        {!isUpcoming && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white/50 text-xs uppercase tracking-wider">Community Goal</p>
              <p className="text-[#f5a623] font-bold text-sm">{event.progress}%</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-[#f5a623] h-2 rounded-full transition-all"
                style={{ width: `${event.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="mb-6">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Rewards</p>
          <div className="flex gap-2">
            {event.rewards.slice(0, 3).map((reward, idx) => (
              <span key={idx} className="text-lg">{reward}</span>
            ))}
          </div>
        </div>

        {/* Button */}
        <button className={`w-full py-2 rounded-lg font-bold transition ${
          isUpcoming
            ? 'bg-white/5 border border-white/10 text-white hover:border-white/20'
            : 'bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#060B14]'
        }`}>
          {isUpcoming ? 'Notify Me' : 'Participate'}
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#060B14] text-white p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-8 h-8 text-[#f5a623]" />
          <h1 className="text-4xl font-bold font-display tracking-widest text-[#f5a623]">
            EVENTS
          </h1>
        </div>
        <p className="text-white/60 text-lg">Limited-time events and exclusive rewards</p>
      </div>

      {/* Featured Event */}
      <div className="mb-16">
        <div className="relative bg-gradient-to-r from-[#f5a623]/25 to-red-500/25 border border-[#f5a623]/40 rounded-2xl p-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-8 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-5xl">🔥</span>
                  <h2 className="text-4xl font-bold font-display tracking-widest text-[#f5a623]">
                    MARINEFORD MONTH
                  </h2>
                </div>
                <p className="text-white/80 text-lg max-w-2xl">
                  The greatest war in One Piece history. Battle through epic encounters and unlock legendary rewards.
                </p>
              </div>
              <div className="text-center bg-black/40 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/10 flex-shrink-0">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Time Remaining</p>
                <p className="text-3xl font-bold text-[#f5a623]">6d 14h</p>
                <p className="text-white/50 text-sm mt-1">32m remaining</p>
              </div>
            </div>

            {/* Featured Rewards */}
            <div className="mb-6">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Exclusive Rewards</p>
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-2xl">🪙</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Berries</p>
                    <p className="text-white/50 text-xs">Up to 500,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Bounty</p>
                    <p className="text-white/50 text-xs">+50,000 Points</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-2xl">🍗</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Mera Mera Fruit</p>
                    <p className="text-white/50 text-xs">Exclusive Devil Fruit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#060B14] font-bold px-8 py-3 rounded-lg transition flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Enter the War
            </button>
          </div>
        </div>
      </div>

      {/* Active Events */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold font-display tracking-widest text-[#f5a623] mb-6 flex items-center gap-2">
          <Gift className="w-6 h-6" />
          ACTIVE EVENTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold font-display tracking-widest text-[#f5a623] mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          UPCOMING EVENTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} isUpcoming={true} />
          ))}
        </div>
      </div>
    </main>
  );
}
