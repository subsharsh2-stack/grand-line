import Link from "next/link";
import { ArrowRight, Users, Star, Shield, MessageSquare } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060B14] text-white overflow-x-hidden">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 bg-[#060B14]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#d97706] flex items-center justify-center text-base shadow-lg">☠️</div>
          <div>
            <div className="font-display font-bold text-sm tracking-widest text-[#f5a623]">GRAND LINE</div>
            <div className="text-[10px] text-slate-600 tracking-widest uppercase leading-none">Your Voyage. Your Legend.</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          {["Features", "World", "Community", "Rewards", "Merch", "About"].map((l) => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white px-4 py-2 transition-colors">Log In</Link>
          <Link href="/signup" className="flex items-center gap-2 px-5 py-2.5 bg-[#f5a623] hover:bg-[#fbbf24] text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#f5a623]/20">
            Begin Voyage
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Ocean background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(14,116,144,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(59,130,246,0.08) 0%, transparent 50%), linear-gradient(180deg, #060B14 0%, #081427 50%, #060B14 100%)"
          }} />
          {/* Stars */}
          {[...Array(40)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/30" style={{
              width: Math.random() * 2 + 1, height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 70}%`,
              opacity: Math.random() * 0.6 + 0.2,
            }} />
          ))}
          {/* Ocean wave effect at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40" style={{
            background: "linear-gradient(0deg, rgba(6,11,20,1) 0%, rgba(8,20,39,0.5) 50%, transparent 100%)"
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left: Hero text */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                589,342+ Pirates Already Sailing
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
                THE<br />
                <span style={{ background: "linear-gradient(135deg, #f5a623, #fcd34d, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  GRAND LINE
                </span><br />
                AWAITS YOU
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-8">
                Embark on the ultimate One Piece journey. Track your progress, earn bounties, build your crew, and become part of the world's greatest adventure.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
                <Link href="/signup" className="flex items-center gap-3 px-7 py-4 bg-[#f5a623] hover:bg-[#fbbf24] text-black font-black text-base rounded-2xl transition-all shadow-xl shadow-[#f5a623]/25 group">
                  <span className="font-display tracking-wider">BEGIN YOUR VOYAGE</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#map" className="flex items-center gap-2 px-6 py-4 border border-white/[0.1] text-slate-300 hover:border-white/[0.2] hover:text-white font-medium rounded-2xl transition-all">
                  Explore The Map
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: "589K+", label: "Active Pirates", icon: "☠️" },
                  { value: "4.28B+", label: "Berries Earned", icon: "🍓" },
                  { value: "912K+", label: "Episodes Logged", icon: "▶️" },
                  { value: "23K+", label: "Crews Formed", icon: "⚓" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="font-display text-2xl font-black text-[#f5a623]">{s.value}</div>
                    <div className="text-xs text-slate-600">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: World Economic Journal */}
            <div className="lg:col-span-2">
              <div className="bg-[#0a0f1a]/90 border border-[#f5a623]/20 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="font-display text-xs font-bold tracking-widest text-[#f5a623]">WORLD ECONOMIC JOURNAL</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Daily Edition · LIVE
                  </div>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { headline: "Straw Hat Pirates climb to Rank #23!", sub: "Bounty increased by 18,500,000 berries this week.", img: "🏴‍☠️", time: "2m ago" },
                    { headline: "Marineford Remains Most Completed Arc", sub: "1.2M episodes watched globally this month.", img: "⚔️", time: "15m ago" },
                    { headline: "Wano Country Festival Event is Live!", sub: "Complete missions and earn exclusive Wano rewards.", img: "🎋", time: "1h ago" },
                    { headline: "Egghead Island Viewership Surges by 42%", sub: "New episodes bringing massive community activity.", img: "🤖", time: "3h ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-white/[0.04] flex items-center justify-center text-lg">{item.img}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-200 leading-tight mb-0.5">{item.headline}</div>
                        <div className="text-xs text-slate-600 leading-relaxed">{item.sub}</div>
                      </div>
                      <div className="text-[10px] text-slate-700 shrink-0">{item.time}</div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/[0.04]">
                  <button className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors">VIEW ALL NEWS →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Preview */}
      <section id="map" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs text-[#f5a623]/60 font-semibold tracking-widest uppercase mb-3">☸ Log Pose Navigation</div>
            <h2 className="font-display text-4xl font-black text-white mb-4">Explore. Progress. Become Legend.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Travel through iconic arcs and make your mark on the Grand Line. Every island is a new chapter.</p>
          </div>

          {/* Island path visualization */}
          <div className="relative bg-[#0a1628]/60 border border-white/[0.06] rounded-3xl p-8 overflow-hidden">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(14,116,144,0.1) 0%, transparent 60%)" }} />
            <div className="relative flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {[
                { name: "East Blue", pct: 100, color: "#22c55e", done: true },
                { name: "Alabasta", pct: 100, color: "#22c55e", done: true },
                { name: "Sky Island", pct: 75, color: "#f5a623", done: false },
                { name: "Water 7", pct: 52, color: "#3b82f6", done: false },
                { name: "Marineford", pct: 25, color: "#ef4444", done: false },
                { name: "Wano", pct: 0, color: "#94a3b8", done: false },
                { name: "Laugh Tale", pct: 0, color: "#94a3b8", done: false, locked: true },
              ].map((island, i) => (
                <div key={island.name} className="flex flex-col items-center gap-3 shrink-0 min-w-[100px]">
                  <div className={`relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all ${
                    island.done ? "border-green-500/50 bg-green-500/10" :
                    island.pct > 0 ? "border-[#f5a623]/50 bg-[#f5a623]/5" :
                    "border-white/[0.08] bg-white/[0.02]"
                  } ${island.locked ? "opacity-40" : ""}`}>
                    {island.locked ? "🔒" : island.done ? "🏝️" : i === 2 ? "⛅" : i === 3 ? "🏙️" : i === 4 ? "⚔️" : "🌊"}
                    {island.done && <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">✓</div>}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-300 mb-1">{island.name}</div>
                    {island.pct > 0 && !island.locked && (
                      <div className="text-xs font-bold" style={{ color: island.color }}>{island.pct}%</div>
                    )}
                  </div>
                  {/* Connecting line */}
                  {i < 6 && <div className="absolute hidden" />}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white text-sm font-medium rounded-xl transition-all">
                ☸ Explore Grand Line Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-[#f5a623]/60 font-semibold tracking-widest uppercase mb-3">⚓ Every Voyage is Unique</div>
            <h2 className="font-display text-4xl font-black text-white">Built For Every Pirate</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🗺️", title: "Track Your Journey", desc: "Automatically track episodes, earn bounties, and unlock exclusive rewards for every arc you conquer.", color: "#3b82f6" },
              { icon: "🍓", title: "Collect & Upgrade", desc: "Unlock Devil Fruits, Haki abilities, and legendary items. Build your ultimate pirate collection.", color: "#a855f7" },
              { icon: "☠️", title: "Build Your Crew", desc: "Form or join powerful crews, complete crew missions, and dominate the leaderboards together.", color: "#f5a623" },
              { icon: "💬", title: "Join the Community", desc: "Discuss theories, share memes, participate in polls, and connect with fans worldwide.", color: "#22c55e" },
            ].map((f) => (
              <div key={f.title} className="group p-6 bg-[#0a0f1a] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-200">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-base text-white mb-2 tracking-wide">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progression showcase */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs text-[#f5a623]/60 font-semibold tracking-widest uppercase mb-3">🏆 Become A Legend</div>
              <h2 className="font-display text-4xl font-black text-white mb-6">From Cabin Boy to Pirate King</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Every episode you watch builds your bounty. Every arc you complete unlocks new rewards. The deeper you sail, the more legendary you become.
              </p>
              <div className="space-y-4">
                {[
                  { rank: "Cabin Boy", bounty: "0", color: "#94a3b8" },
                  { rank: "Supernova", bounty: "50,000,000", color: "#a855f7" },
                  { rank: "Yonko Commander", bounty: "500,000,000", color: "#ef4444" },
                  { rank: "Pirate King Candidate", bounty: "5,000,000,000", color: "#eab308" },
                ].map((r) => (
                  <div key={r.rank} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color, boxShadow: `0 0 8px ${r.color}60` }} />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-200">{r.rank}</div>
                      <div className="text-xs text-slate-600">฿{r.bounty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: "🔥", title: "Daily Streak Rewards", desc: "Maintain your daily watch streak to unlock Haki abilities. 90 days = Conqueror's Haki." },
                { icon: "🏆", title: "Achievement System", desc: "47+ achievements across Journey, Community, Collector, and Hidden categories." },
                { icon: "⚔️", title: "Crew Wars", desc: "Compete with other crews for seasonal rankings and exclusive cosmetics." },
                { icon: "🌟", title: "World Events", desc: "Participate in platform-wide events like Marineford Month and Wano Festival." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-4 bg-[#0a0f1a] border border-white/[0.06] rounded-2xl">
                  <div className="text-2xl shrink-0">{f.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-200 mb-1">{f.title}</div>
                    <div className="text-xs text-slate-500">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-6">🏴‍☠️</div>
          <h2 className="font-display text-4xl font-black text-white mb-4">Your Legend Begins Now</h2>
          <p className="text-slate-400 mb-8 text-lg">Join 589,342+ pirates already sailing the Grand Line. It's completely free to start.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="flex items-center gap-2 px-8 py-4 bg-[#f5a623] hover:bg-[#fbbf24] text-black font-black text-base rounded-2xl transition-all shadow-xl shadow-[#f5a623]/20">
              <span className="font-display tracking-wider">BEGIN YOUR VOYAGE</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="px-6 py-4 border border-white/[0.1] text-slate-300 hover:border-white/[0.2] hover:text-white font-medium rounded-2xl transition-all">
              Already have an account? Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#d97706] flex items-center justify-center text-sm">☠️</div>
            <span className="font-display font-bold text-sm tracking-widest text-[#f5a623]">GRAND LINE</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            {["About", "Privacy", "Terms", "Contact"].map(l => <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>)}
          </div>
          <div className="text-xs text-slate-700 text-center sm:text-right">
            Fan project · One Piece © Eiichiro Oda
          </div>
        </div>
      </footer>
    </div>
  );
}
