"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Mail, ChevronDown, Flame, User,
  Settings, LogOut, X, Menu
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TopbarProps {
  sidebarCollapsed: boolean;
  onMenuToggle: () => void;
}

export function Topbar({ sidebarCollapsed, onMenuToggle }: TopbarProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifCount] = useState(3);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("username, display_name, avatar_url, bounty, berries, haki_level, watch_streak, rank, crew_id")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => { if (data) setProfile(data); });
    });
  }, []);

  const hakiLabel: Record<string, string> = {
    none: "No Haki",
    observation_basic: "Observation",
    armament_basic: "Armament",
    advanced_armament: "Adv. Armament",
    advanced_observation: "Adv. Observation",
    conquerors: "Conqueror's",
    advanced_conquerors: "Adv. Conqueror's",
  };

  const rankColors: Record<string, string> = {
    cabin_boy: "#94a3b8",
    rookie_pirate: "#22c55e",
    notorious_pirate: "#3b82f6",
    supernova: "#a855f7",
    warlord_candidate: "#f59e0b",
    yonko_commander: "#ef4444",
    yonko: "#f97316",
    pirate_king_candidate: "#eab308",
  };

  const rankLabels: Record<string, string> = {
    cabin_boy: "Cabin Boy",
    rookie_pirate: "Rookie",
    notorious_pirate: "Notorious",
    supernova: "Supernova",
    warlord_candidate: "Warlord",
    yonko_commander: "Commander",
    yonko: "Yonko",
    pirate_king_candidate: "Pirate King",
  };

  const leftOffset = sidebarCollapsed ? 72 : 240;

  return (
    <>
      <motion.header
        animate={{ left: leftOffset }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 right-0 z-30 h-16 bg-[#06090f]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 gap-3"
      >
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all lg:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 w-full h-9 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-500 text-sm hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group"
          >
            <Search size={14} className="shrink-0" />
            <span className="flex-1 text-left text-slate-600 text-xs">Search islands, arcs, episodes...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] text-slate-700 font-mono">
              <span>⌘</span><span>K</span>
            </kbd>
          </button>
        </div>

        {/* Stats pills */}
        {profile && (
          <div className="hidden lg:flex items-center gap-2">
            {/* Berries */}
            <div className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-gold-500/8 border border-gold-500/15 group hover:border-gold-500/30 transition-colors cursor-default">
              <span className="text-base leading-none">🍓</span>
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-gold-500/60 leading-none font-medium uppercase tracking-wider">Berries</span>
                <span className="text-xs font-bold text-gold-400 leading-none">
                  {(profile.berries || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bounty */}
            <div className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-500/8 border border-amber-500/15 hover:border-amber-500/30 transition-colors cursor-default">
              <span className="text-base leading-none">⚡</span>
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-amber-500/60 leading-none font-medium uppercase tracking-wider">Bounty</span>
                <span className="text-xs font-bold text-amber-400 leading-none">
                  ฿{(profile.bounty || 0) >= 1_000_000
                    ? `${((profile.bounty || 0) / 1_000_000).toFixed(1)}M`
                    : (profile.bounty || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Haki */}
            <div className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-purple-500/8 border border-purple-500/15 hover:border-purple-500/30 transition-colors cursor-default">
              <span className="text-base leading-none">🔮</span>
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-purple-400/60 leading-none font-medium uppercase tracking-wider">Haki</span>
                <span className="text-xs font-bold text-purple-300 leading-none">
                  {hakiLabel[profile.haki_level || "none"] || "None"}
                </span>
              </div>
            </div>

            {/* Streak */}
            {(profile.watch_streak || 0) > 0 && (
              <div className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-orange-500/8 border border-orange-500/15 hover:border-orange-500/30 transition-colors cursor-default">
                <Flame size={14} className="text-orange-400" />
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-orange-400/60 leading-none font-medium uppercase tracking-wider">Streak</span>
                  <span className="text-xs font-bold text-orange-400 leading-none">
                    {profile.watch_streak} Days
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all">
            <Bell size={17} />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gold-500 text-[9px] font-bold text-black flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          {/* Mail */}
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all">
            <Mail size={17} />
          </button>

          {/* Profile */}
          {profile && (
            <div className="relative ml-1">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-xl hover:bg-white/[0.06] transition-all"
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-gold-500/30" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-700/30 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-xs">
                    {(profile.display_name || profile.username || "P")[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {profile.display_name || profile.username}
                  </div>
                  <div className="text-[10px] font-medium leading-tight" style={{ color: rankColors[profile.rank] || "#94a3b8" }}>
                    {rankLabels[profile.rank] || "Cabin Boy"}
                  </div>
                </div>
                <ChevronDown size={12} className="text-slate-600" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-[#0a0f1a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/[0.06]">
                      <div className="text-sm font-bold text-slate-100">{profile.display_name || profile.username}</div>
                      <div className="text-xs text-slate-500">@{profile.username}</div>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="text-gold-400 font-medium">฿{(profile.bounty || 0).toLocaleString()}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">{rankLabels[profile.rank] || "Cabin Boy"}</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        href={`/profile/${profile.username}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white rounded-xl transition-all"
                      >
                        <User size={14} />
                        Wanted Poster
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white rounded-xl transition-all"
                      >
                        <Settings size={14} />
                        Settings
                      </Link>
                      <div className="my-1 h-px bg-white/[0.05]" />
                      <form action="/api/auth/signout" method="POST">
                        <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                          <LogOut size={14} />
                          Set Sail (Sign Out)
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.header>

      {/* Profile dropdown backdrop */}
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            >
              <div className="bg-[#0a0f1a] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                  <Search size={16} className="text-slate-500 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search islands, arcs, characters, episodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                      if (e.key === "Enter" && searchQuery) {
                        router.push(`/episodes?search=${encodeURIComponent(searchQuery)}`);
                        setSearchOpen(false);
                      }
                    }}
                    className="flex-1 bg-transparent text-slate-200 placeholder:text-slate-600 outline-none text-sm"
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-slate-600 hover:text-slate-400 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-xs text-slate-600 font-medium mb-3 uppercase tracking-wider">Quick Links</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { href: "/arcs", label: "Grand Line Map", icon: "🗺️" },
                      { href: "/episodes", label: "All Episodes", icon: "▶️" },
                      { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
                      { href: "/challenges", label: "Challenges", icon: "⚔️" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                      >
                        <span>{item.icon}</span>
                        <span className="text-sm text-slate-300">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
