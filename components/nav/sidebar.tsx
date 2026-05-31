"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Map, Play, Anchor, Users, MessageSquare,
  Trophy, Star, Zap, BookOpen, ShoppingBag, Calendar,
  ChevronLeft, ChevronRight, Flame, Crown, LogOut, Settings, User
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_SECTIONS = [
  {
    items: [
      { href: "/dashboard",    label: "Dashboard",      icon: LayoutDashboard },
      { href: "/map",          label: "Grand Line Map", icon: Map },
      { href: "/episodes",     label: "Episodes",        icon: Play },
      { href: "/arcs",         label: "Arcs",            icon: Anchor },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { href: "/crew",         label: "Crew",            icon: Users },
      { href: "/community",    label: "Community",       icon: MessageSquare },
      { href: "/leaderboard",  label: "Leaderboards",   icon: Trophy },
    ],
  },
  {
    label: "COLLECTION",
    items: [
      { href: "/achievements", label: "Achievements",    icon: Star },
      { href: "/devil-fruits", label: "Devil Fruits",    icon: Zap },
      { href: "/encyclopedia", label: "Encyclopedia",    icon: BookOpen },
    ],
  },
  {
    label: "MORE",
    items: [
      { href: "/challenges",   label: "Challenges",      icon: Crown },
      { href: "/marketplace",  label: "Marketplace",     icon: ShoppingBag },
      { href: "/events",       label: "Events",          icon: Calendar },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("username, display_name, avatar_url, bounty, rank, watch_streak")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => { if (data) setProfile(data); });
    });
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[#06090f] border-r border-white/[0.06] overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/[0.06] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shadow-gold-glow text-base">
            ☠️
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="font-display font-bold text-sm tracking-widest text-gold-400 block leading-tight">
                  GRAND LINE
                </span>
                <span className="text-[10px] text-slate-500 tracking-widest uppercase block">
                  Your Voyage
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-none">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} className="mb-1">
            <AnimatePresence>
              {!collapsed && section.label && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-1.5 text-[10px] font-semibold tracking-widest text-slate-600 uppercase"
                >
                  {section.label}
                </motion.div>
              )}
            </AnimatePresence>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    active
                      ? "bg-gold-500/10 text-gold-400"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-gold-500/10 border border-gold-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon
                    size={18}
                    className={`shrink-0 relative z-10 ${active ? "text-gold-400" : "text-slate-500 group-hover:text-slate-300"}`}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="relative z-10 whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Tooltip on collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0f172a] border border-white/[0.08] rounded-lg text-xs text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: Profile + Toggle */}
      <div className="shrink-0 border-t border-white/[0.06]">
        {/* Profile card */}
        {profile && (
          <div className={`p-3 ${collapsed ? "" : ""}`}>
            <div className={`flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.04] transition-all cursor-pointer group`}>
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border border-gold-500/30" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-700/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-sm">
                    {(profile.display_name || profile.username || "P")[0].toUpperCase()}
                  </div>
                )}
                {profile.watch_streak >= 3 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                    <Flame size={8} className="text-white" />
                  </div>
                )}
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0 overflow-hidden"
                  >
                    <div className="text-sm font-semibold text-slate-200 truncate leading-tight">
                      {profile.display_name || profile.username}
                    </div>
                    <div className="text-xs text-gold-500 font-medium truncate">
                      ฿{profile.bounty?.toLocaleString() || "0"}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-0.5"
                  >
                    <Link href={`/profile/${profile.username}`} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-slate-300 transition-colors">
                      <User size={12} />
                    </Link>
                    <form action="/api/auth/signout" method="POST">
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                        <LogOut size={12} />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full h-10 text-slate-600 hover:text-slate-400 hover:bg-white/[0.04] transition-all border-t border-white/[0.04]"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>
  );
}
