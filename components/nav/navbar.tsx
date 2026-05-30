"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, Map, Trophy, Users, ShoppingBag, Swords,
  Menu, X, Bell, ChevronDown, LogOut, User, Settings,
  Flame, Zap
} from "lucide-react";
import { formatBounty, RANK_CONFIG } from "@/types";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/arcs",        label: "Grand Line",  icon: Map,       description: "Arc progress map" },
  { href: "/episodes",    label: "Log Pose",    icon: Compass,   description: "All episodes" },
  { href: "/challenges",  label: "Challenges",  icon: Swords,    description: "Daily & arc challenges" },
  { href: "/crew",        label: "Nakama",      icon: Users,     description: "Your crew" },
  { href: "/leaderboard", label: "Bounties",    icon: Trophy,    description: "World rankings" },
  { href: "/marketplace", label: "Sabaody",     icon: ShoppingBag, description: "Merch & fan art" },
];

interface NavbarProps {
  profile?: {
    username: string;
    display_name: string | null;
    bounty: number;
    rank: string;
    watch_streak: number;
    avatar_url: string | null;
  } | null;
}

export function Navbar({ profile: profileProp }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(profileProp ?? null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Fetch profile client-side if not provided by server
  useEffect(() => {
    if (profile) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("username, display_name, bounty, rank, watch_streak, avatar_url")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => { if (data) setProfile(data); });
    });
  }, []);

  const rankInfo = profile?.rank
    ? RANK_CONFIG[profile.rank as keyof typeof RANK_CONFIG]
    : null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080c14]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-sm font-bold shadow-gold-glow group-hover:shadow-gold-glow-lg transition-all">
                🏴‍☠️
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-gold-400 group-hover:text-gold-300 transition-colors hidden sm:block">
                GRAND LINE
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "text-gold-400 bg-gold-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={14} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 h-0.5 bg-gold-500"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {profile ? (
                <>
                  {/* Streak badge */}
                  {profile.watch_streak > 0 && (
                    <div className="hidden sm:flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
                      <Flame size={12} className="text-orange-400" />
                      <span className="text-xs font-bold text-orange-400">{profile.watch_streak}d</span>
                    </div>
                  )}

                  {/* Bounty */}
                  <div className="hidden sm:flex items-center gap-1 bg-gold-500/10 border border-gold-500/20 rounded-full px-3 py-1">
                    <Zap size={12} className="text-gold-400" />
                    <span className="text-xs font-bold text-gold-400">
                      ฿{formatBounty(profile.bounty)}
                    </span>
                  </div>

                  {/* Notifications */}
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all relative">
                    <Bell size={16} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
                  </button>

                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/[0.04] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 border border-gold-500/30 flex items-center justify-center text-xs font-bold text-gold-400">
                        {(profile.display_name || profile.username)[0].toUpperCase()}
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-xs font-semibold text-slate-200 leading-none mb-0.5">
                          {profile.display_name || profile.username}
                        </div>
                        {rankInfo && (
                          <div className="text-[10px]" style={{ color: rankInfo.color }}>
                            {rankInfo.icon} {rankInfo.label}
                          </div>
                        )}
                      </div>
                      <ChevronDown size={12} className="text-slate-500" />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-[#0f172a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-white/[0.06]">
                            <div className="text-sm font-semibold text-slate-200">
                              {profile.display_name || profile.username}
                            </div>
                            <div className="text-xs text-slate-500">@{profile.username}</div>
                          </div>
                          <div className="p-1">
                            <Link
                              href={`/profile/${profile.username}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white rounded-lg transition-all"
                              onClick={() => setProfileOpen(false)}
                            >
                              <User size={14} />
                              Wanted Poster
                            </Link>
                            <Link
                              href="/settings"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white rounded-lg transition-all"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Settings size={14} />
                              Settings
                            </Link>
                            <div className="my-1 h-px bg-white/[0.06]" />
                            <form action="/api/auth/signout" method="POST">
                              <button
                                type="submit"
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <LogOut size={14} />
                                Set Sail (Sign Out)
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm text-slate-400 hover:text-slate-200 px-3 py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-semibold bg-gold-500 hover:bg-gold-400 text-void-950 px-4 py-2 rounded-lg transition-all shadow-gold-glow hover:shadow-gold-glow-lg"
                  >
                    Join the Crew
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/[0.06] bg-[#080c14]/98 backdrop-blur-xl"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "text-gold-400 bg-gold-500/10"
                          : "text-slate-400"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon size={16} />
                      <div>
                        <div>{item.label}</div>
                        <div className="text-xs text-slate-600">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop for profile dropdown */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}
