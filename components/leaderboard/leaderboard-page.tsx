"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Flame, Crown, Zap, Star } from "lucide-react";
import { RANK_CONFIG, formatBounty } from "@/types";

interface LeaderProfile {
  id: string;
  username: string;
  display_name: string | null;
  bounty: number;
  rank: string;
  watch_streak?: number;
  total_episodes_watched?: number;
  avatar_url: string | null;
}

interface WeeklyProfile {
  user_id: string;
  total: number;
  username: string;
  display_name: string | null;
  rank: string;
  avatar_url: string | null;
}

interface Props {
  globalTop: LeaderProfile[];
  weeklyTop: WeeklyProfile[];
  myProfile: { id: string; username: string; bounty: number; rank: string } | null;
  myRankPosition: number;
}

function RankMedal({ position }: { position: number }) {
  if (position === 1) return <span className="text-xl">👑</span>;
  if (position === 2) return <span className="text-lg">🥈</span>;
  if (position === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm font-bold text-slate-500">#{position}</span>;
}

function LeaderRow({
  position, profile, metric, isCurrentUser
}: {
  position: number;
  profile: { username: string; display_name: string | null; rank: string; avatar_url: string | null };
  metric: { value: string | number; label: string };
  isCurrentUser: boolean;
}) {
  const rankInfo = RANK_CONFIG[profile.rank as keyof typeof RANK_CONFIG];
  const isTop3 = position <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.03 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isCurrentUser
          ? "bg-gold-500/10 border border-gold-500/30"
          : isTop3
          ? "bg-void-900/60 border border-white/[0.08]"
          : "border border-transparent hover:border-white/[0.06]"
      }`}
    >
      {/* Position */}
      <div className="w-8 flex items-center justify-center flex-shrink-0">
        <RankMedal position={position} />
      </div>

      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${rankInfo?.color}20, ${rankInfo?.color}40)`,
          border: `1px solid ${rankInfo?.color}40`,
          color: rankInfo?.color,
        }}
      >
        {(profile.display_name || profile.username)[0].toUpperCase()}
      </div>

      {/* Name + rank */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/profile/${profile.username}`}
          className="block text-sm font-semibold text-slate-200 hover:text-white transition-colors truncate"
        >
          {profile.display_name || profile.username}
          {isCurrentUser && <span className="ml-1 text-xs text-gold-400">(you)</span>}
        </Link>
        <div className="text-[10px]" style={{ color: rankInfo?.color }}>
          {rankInfo?.icon} {rankInfo?.label}
        </div>
      </div>

      {/* Metric */}
      <div className="text-right flex-shrink-0">
        <div className={`text-sm font-black ${isTop3 ? "text-gold-400" : "text-slate-300"}`}>
          {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
        </div>
        <div className="text-[10px] text-slate-600">{metric.label}</div>
      </div>
    </motion.div>
  );
}

export function LeaderboardPage({ globalTop, weeklyTop, myProfile, myRankPosition }: Props) {
  const [tab, setTab] = useState<"global" | "weekly">("global");

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-xs text-gold-400 font-semibold tracking-widest uppercase mb-2">🏴‍☠️ World Government</div>
        <h1 className="font-display text-4xl font-black text-white mb-2">Bounty Board</h1>
        <p className="text-slate-400 text-sm">The most wanted pirates in the Grand Line</p>
      </div>

      {/* My position */}
      {myProfile && myRankPosition > 0 && (
        <div className="bg-gold-500/[0.07] border border-gold-500/20 rounded-2xl px-5 py-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy size={16} className="text-gold-400" />
            <div>
              <div className="text-sm font-bold text-white">Your Position</div>
              <div className="text-xs text-slate-500">Keep watching to climb higher</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-xl font-black text-gold-400">#{myRankPosition}</div>
            <div className="text-xs text-slate-500">฿{formatBounty(myProfile.bounty)}</div>
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[1, 0, 2].map((podiumIdx) => {
          const profile = globalTop[podiumIdx];
          if (!profile) return <div key={podiumIdx} />;
          const rankInfo = RANK_CONFIG[profile.rank as keyof typeof RANK_CONFIG];
          const heights = ["h-28", "h-36", "h-24"];
          const actualPos = [2, 1, 3][podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2];
          return (
            <motion.div
              key={podiumIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: podiumIdx * 0.1 }}
              className="relative"
            >
              <Link href={`/profile/${profile.username}`} className="block">
                {/* Crown for #1 */}
                {podiumIdx === 1 && (
                  <div className="text-center mb-1 text-2xl animate-float">👑</div>
                )}
                <div
                  className={`flex flex-col items-center justify-end pb-3 rounded-xl border ${
                    podiumIdx === 1
                      ? "border-gold-500/40 bg-gold-500/10"
                      : "border-white/[0.06] bg-void-900/60"
                  } ${heights[podiumIdx]}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${rankInfo?.color}20, ${rankInfo?.color}40)`,
                      color: rankInfo?.color,
                      border: `1px solid ${rankInfo?.color}40`,
                    }}
                  >
                    {(profile.display_name || profile.username)[0].toUpperCase()}
                  </div>
                  <div className="text-xs font-bold text-white text-center px-2 truncate w-full">
                    {profile.display_name || profile.username}
                  </div>
                  <div className="text-[10px] text-gold-400 font-bold">
                    ฿{formatBounty(profile.bounty)}
                  </div>
                </div>
                <div className="text-center mt-1">
                  <span className="text-[10px] text-slate-500">#{actualPos}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Tab switcher */}
      <div className="flex border border-white/[0.08] rounded-xl overflow-hidden mb-4">
        <button
          onClick={() => setTab("global")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
            tab === "global" ? "bg-gold-500/20 text-gold-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Crown size={14} /> All-Time Global
        </button>
        <button
          onClick={() => setTab("weekly")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
            tab === "weekly" ? "bg-gold-500/20 text-gold-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Flame size={14} /> This Week
        </button>
      </div>

      {/* List */}
      <div className="space-y-1">
        {tab === "global" ? (
          globalTop.slice(3).map((profile, i) => (
            <LeaderRow
              key={profile.id}
              position={i + 4}
              profile={profile}
              metric={{ value: `฿${formatBounty(profile.bounty)}`, label: "total bounty" }}
              isCurrentUser={profile.id === myProfile?.id}
            />
          ))
        ) : (
          weeklyTop.map((profile, i) => (
            <LeaderRow
              key={profile.user_id}
              position={i + 1}
              profile={profile}
              metric={{ value: `฿${formatBounty(profile.total)}`, label: "this week" }}
              isCurrentUser={profile.user_id === myProfile?.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
