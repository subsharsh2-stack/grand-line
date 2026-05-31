"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Play, Flame, Trophy, Target,
  Users, MessageSquare, Calendar, TrendingUp, Shield
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const RANK_LABELS: Record<string, string> = {
  cabin_boy: "Cabin Boy", rookie_pirate: "Rookie Pirate", notorious_pirate: "Notorious Pirate",
  supernova: "Supernova", warlord_candidate: "Warlord Candidate", yonko_commander: "Yonko Commander",
  yonko: "Yonko", pirate_king_candidate: "Pirate King Candidate",
};
const RANK_COLORS: Record<string, string> = {
  cabin_boy: "#94a3b8", rookie_pirate: "#22c55e", notorious_pirate: "#3b82f6",
  supernova: "#a855f7", warlord_candidate: "#f59e0b", yonko_commander: "#ef4444",
  yonko: "#f97316", pirate_king_candidate: "#eab308",
};
const HAKI_LABELS: Record<string, string> = {
  none: "No Haki", observation_basic: "Observation Haki", armament_basic: "Armament Haki",
  advanced_armament: "Adv. Armament", advanced_observation: "Adv. Observation",
  conquerors: "Conqueror's Haki", advanced_conquerors: "Adv. Conqueror's",
};

const COMMUNITY_DISCUSSIONS = [
  { id: 1, avatar: "M", title: "Who had the best moment in Enies Lobby?", type: "Poll", upvotes: 128, comments: 64, time: "2h ago" },
  { id: 2, avatar: "P", title: "Is Robin's backstory the saddest in One Piece?", type: "Discussion", upvotes: 96, comments: 43, time: "4h ago" },
  { id: 3, avatar: "N", title: "Best Straw Hat duo? 🔥", type: "Debate", upvotes: 74, comments: 38, time: "6h ago" },
];
const DAILY_QUESTS = [
  { title: "Watch 5 episodes today", progress: 3, total: 5, berries: 200, haki: 100 },
  { title: "Complete 2 episode quizzes", progress: 1, total: 2, berries: 150, haki: 75 },
  { title: "Participate in 1 discussion", progress: 0, total: 1, berries: 100, haki: 50 },
];
const STREAK_DAYS = ["M","T","W","T","F","S","S"];
const STREAK_DONE = [true,true,true,true,true,false,true];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [nextEpisode, setNextEpisode] = useState<any>(null);
  const [currentArc, setCurrentArc] = useState<any>(null);
  const [arcProgress, setArcProgress] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      let { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (!prof) {
        const base = (user.email?.split("@")[0] || "pirate").toLowerCase().replace(/[^a-z0-9_]/g, "_");
        const username = `${base}_${Math.floor(Math.random() * 9000 + 1000)}`;
        const { data: created } = await supabase.from("profiles").insert({ id: user.id, username, display_name: username }).select("*").maybeSingle();
        prof = created;
      }
      setProfile(prof);
      if (prof) {
        const nextEpNum = (prof.current_episode || 0) + 1;
        const { data: ep } = await supabase.from("episodes").select("*, arcs(name, slug, saga_id, start_episode, end_episode, sagas(name))").eq("episode_number", nextEpNum).maybeSingle();
        setNextEpisode(ep);
        if (ep?.arc_id) {
          const { data: arc } = await supabase.from("arcs").select("*, sagas(name)").eq("id", ep.arc_id).maybeSingle();
          setCurrentArc(arc);
          const { data: ap } = await supabase.from("arc_progress").select("*").eq("user_id", user.id).eq("arc_id", ep.arc_id).maybeSingle();
          setArcProgress(ap);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4 animate-bounce">🏴‍☠️</div>
      <div className="text-[#f5a623] font-bold text-sm tracking-widest uppercase">Setting Sail…</div></div>
    </div>
  );
  if (!profile) return null;

  const rankColor = RANK_COLORS[profile.rank] || "#94a3b8";
  const rankLabel = RANK_LABELS[profile.rank] || "Cabin Boy";
  const hakiLabel = HAKI_LABELS[profile.haki_level || "none"] || "No Haki";
  const arcName = (currentArc as any)?.sagas?.name || (currentArc as any)?.name || "East Blue Saga";
  const arcEps = currentArc ? ((currentArc as any).end_episode - (currentArc as any).start_episode + 1) : 61;
  const arcWatched = (arcProgress as any)?.episodes_watched || profile.total_episodes_watched || 0;
  const arcPct = Math.min(100, Math.round((arcWatched / arcEps) * 100));
  const nextEpNum = (nextEpisode as any)?.episode_number || (profile.current_episode || 0) + 1;
  const nextEpTitle = (nextEpisode as any)?.title || "Continue Your Journey";

  return (
    <div className="min-h-screen p-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><span>☠️</span><span>Welcome back, Nakama!</span></div>
        <h1 className="font-display text-3xl font-black text-white">
          {profile.display_name || profile.username}
          <span className="ml-3 text-xs font-normal px-2.5 py-1 rounded-full border" style={{ color: rankColor, borderColor: `${rankColor}40`, backgroundColor: `${rankColor}15` }}>{rankLabel}</span>
        </h1>
      </motion.div>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {/* Continue Journey */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0a1628] via-[#0d1e35] to-[#080c14] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-transparent" />
            <div className="relative">
              <div className="text-xs text-[#f5a623]/70 font-semibold tracking-widest uppercase mb-1">Continue Your Journey</div>
              <h2 className="font-display text-2xl font-black text-white mb-1">{arcName}</h2>
              <p className="text-slate-400 text-sm mb-4">You are in the middle of an epic adventure!</p>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5"><span>Arc Progress</span><span className="text-[#f5a623] font-bold">{arcPct}%</span></div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #d97706, #f5a623, #fcd34d)" }}
                    initial={{ width: 0 }} animate={{ width: `${arcPct}%` }} transition={{ duration: 1.2, ease: "easeOut" }} />
                </div>
              </div>
              <div className="flex items-center gap-6 mb-5">
                <div><div className="text-xs text-slate-600 uppercase tracking-wider">Current Ep</div><div className="font-display text-2xl font-black text-white">{profile.current_episode || 0}</div></div>
                <ArrowRight size={16} className="text-slate-700" />
                <div><div className="text-xs text-slate-600 uppercase tracking-wider">Next Ep</div><div className="font-display text-2xl font-black text-[#f5a623]">{nextEpNum}</div></div>
                <div className="flex-1 hidden sm:block"><div className="text-xs text-slate-600 uppercase tracking-wider">Next Title</div><div className="text-sm text-slate-300 truncate">{nextEpTitle}</div></div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/episodes" className="flex items-center gap-2 px-5 py-2.5 bg-[#f5a623] hover:bg-[#fbbf24] text-black font-bold text-sm rounded-xl transition-all shadow-lg">
                  <Play size={14} className="fill-current" />Continue Watching
                </Link>
                <Link href="/arcs" className="flex items-center gap-2 px-4 py-2.5 border border-white/[0.1] text-slate-300 hover:border-white/[0.2] hover:text-white font-medium text-sm rounded-xl transition-all">
                  View Arc
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 4 stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Next Milestone", icon: Target, color: "#f5a623", main: `Ep ${nextEpNum + 24}`, sub: "Only 25 episodes left!", progress: 77 },
              { label: "Recent Achievement", icon: Trophy, color: "#a855f7", main: "Quiz Master", sub: "Score 90%+ on 10 quizzes", badge: "2h ago" },
              { label: "Bounty Today", icon: TrendingUp, color: "#22c55e", main: "+1,250,000", sub: "Berries earned today", extra: "📈 +12% vs yesterday" },
              { label: "Haki Progress", icon: Shield, color: "#8b5cf6", main: hakiLabel, sub: "Advanced Lv. 4", progress: 72 },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-2xl border p-4" style={{ backgroundColor: `${card.color}10`, borderColor: `${card.color}25` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{card.label}</div>
                  <card.icon size={14} style={{ color: card.color }} />
                </div>
                <div className="text-sm font-bold text-slate-100 mb-0.5">{card.main}</div>
                <div className="text-xs text-slate-500">{card.sub}</div>
                {card.badge && <div className="mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 inline-block">{card.badge}</div>}
                {card.extra && <div className="mt-2 text-xs text-green-400">{card.extra}</div>}
                {card.progress !== undefined && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${card.progress}%`, backgroundColor: card.color }} />
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1">{card.progress}% to next level</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Community + Crew */}
          <div className="grid md:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><MessageSquare size={14} className="text-blue-400" /><span className="text-sm font-semibold text-slate-200">Community Discussions</span></div>
                <Link href="/community" className="text-xs text-[#f5a623] hover:text-[#fbbf24] font-medium transition-colors">View All →</Link>
              </div>
              <div className="space-y-3">
                {COMMUNITY_DISCUSSIONS.map((d) => (
                  <div key={d.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.06] flex items-center justify-center text-xs font-bold text-slate-300">{d.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#f5a623]/80 font-medium mb-0.5">{d.type}</div>
                      <div className="text-sm text-slate-200 font-medium leading-tight mb-1 truncate">{d.title}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-600"><span>{d.upvotes} votes</span><span>·</span><span>{d.comments} replies</span><span>·</span><span>{d.time}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/community" className="mt-3 w-full flex items-center justify-center py-2.5 border border-white/[0.06] text-slate-400 hover:text-slate-200 text-xs font-medium rounded-xl transition-all">Join Discussion</Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><Users size={14} className="text-[#f5a623]" /><span className="text-sm font-semibold text-slate-200">Crew Activity</span></div>
                <Link href="/crew" className="text-xs text-[#f5a623] hover:text-[#fbbf24] font-medium transition-colors">Go to Crew →</Link>
              </div>
              <div className="text-center py-8">
                <div className="text-3xl mb-3">⚓</div>
                <div className="text-slate-400 text-sm font-medium mb-1">No crew yet!</div>
                <div className="text-slate-600 text-xs mb-4">Join a crew to sail with Nakama</div>
                <Link href="/crew" className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5a623]/10 border border-[#f5a623]/20 text-[#f5a623] text-xs font-medium rounded-xl hover:bg-[#f5a623]/20 transition-all">
                  <Users size={12} />Find Your Crew
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="space-y-5">
          {/* AI Narrator */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-sm">🐌</div>
              <div><div className="text-xs font-bold text-slate-200">AI Voyage Narrator</div><span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded font-medium">BETA</span></div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">Captain, your journey through {arcName} has been remarkable. Great adventures await ahead…</p>
            <button className="text-xs text-[#f5a623] hover:text-[#fbbf24] font-medium transition-colors">🔊 Tell me more</button>
          </motion.div>

          {/* Daily Quests */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Target size={14} className="text-[#f5a623]" /><span className="text-sm font-semibold text-slate-200">Daily Quests</span></div>
              <span className="text-xs text-slate-500">Resets in 14h 32m</span>
            </div>
            <div className="space-y-3">
              {DAILY_QUESTS.map((q, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs"><span className="text-slate-300 font-medium">{q.title}</span><span className="text-slate-600">{q.progress}/{q.total}</span></div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#d97706] to-[#f5a623]" style={{ width: `${(q.progress / q.total) * 100}%` }} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-600">
                    <span className="text-[#f5a623]">+{q.berries} Berries</span><span>·</span><span className="text-purple-400">+{q.haki} Haki</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/challenges" className="mt-4 w-full flex items-center justify-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-2">View All Quests →</Link>
          </motion.div>

          {/* Streak */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4"><Flame size={14} className="text-orange-400" /><span className="text-sm font-semibold text-slate-200">Your Streak</span></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-4xl font-black text-orange-400">{profile.watch_streak || 0}</span>
              <div><div className="text-sm font-bold text-slate-200">Days</div><div className="text-xs text-slate-500">Longest: {profile.longest_streak || profile.watch_streak || 0}</div></div>
            </div>
            <div className="flex items-center gap-1.5">
              {STREAK_DAYS.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full aspect-square rounded-full flex items-center justify-center text-[9px] font-bold ${STREAK_DONE[i] ? "bg-orange-500 text-white" : "bg-white/[0.04] text-slate-700"}`}>
                    {STREAK_DONE[i] ? "✓" : ""}
                  </div>
                  <span className="text-[9px] text-slate-700">{d}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* World Event */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl overflow-hidden border border-orange-500/20" style={{ background: "linear-gradient(135deg, #1a0e00 0%, #0a0f1a 60%)" }}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1"><Calendar size={12} className="text-orange-400" /><span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">World Event</span></div>
              <div className="font-display font-black text-base text-white mb-1">Wano Country Festival</div>
              <div className="text-xs text-slate-400 mb-3">Ends in <span className="text-orange-400 font-bold">6d 14h 32m</span></div>
              <p className="text-xs text-slate-500 mb-4">Complete event missions and earn exclusive Wano-themed rewards!</p>
              <Link href="/events" className="flex items-center justify-center w-full py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 text-xs font-bold rounded-xl transition-all">
                View Event
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
